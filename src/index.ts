import express from 'express'
import { EventEmitter } from 'events'
import { v4 as uuidv4 } from 'uuid'
import { EngineRoute, checkRoute } from './classes/EngineRoute'
import { EngineConfig, checkConfig } from './classes/EngineConfig'

export class ServerInstance extends EventEmitter {
    _app: express.Application
    _server: any
    _config!: EngineConfig
    _debugTimeout: number
    running: boolean = false
    debuggedResponses: { [key: string]: { res: any, response: any, responses: any }} = {}
    timeoutTimers: { [key: string]: any} = {}

    constructor () {
        super()
        this._debugTimeout = 30000
        this._app = express()
        this.on('go', (id: string, responseName?: string)=> {
            this.proceedDebuggedResponse(id, responseName)
        })
    }

    //  Public API

    async checkConfig(config: any, callback?: any) {
        if (callback) {
            try {
                let check = await checkConfig(config)
                callback(check, null)
            } catch(err) {
                callback(null, err)
            }
        } else {
            return new Promise((resolve, reject) => {
                checkConfig(config)
                .then( res => {
                    resolve(res)
                })
                .catch( err => {
                    reject(err)
                })
            })
        }
    }

    async checkRoute(route: any, callback?: any) {
        if (callback) {
            try {
                let check = await checkRoute(route)
                callback(check, null)
            } catch(err) {
                callback(null, err)
            }
        } else {
            return new Promise((resolve, reject) => {
                checkRoute(route)
                .then( res => {
                    resolve(res)
                })
                .catch( err => {
                    reject(err)
                })
            })
        }
    }

    async create(config: EngineConfig, callback?: any) {
        let error: string | null = null
        let result: string | null = null
        try {
            await checkConfig(config)
            if(config.debugTimeout) {
                this._debugTimeout = config.debugTimeout
            }
            this._config = config
            this.createEngine()
            result = 'engine created'
        } catch(err) {
            error = err
        }
        if (callback) {
            if (error) {
                callback(null, error)
            } else {
                callback(result, null)
            }
        } else {
            return new Promise((resolve, reject) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        }
    }

    getConfig(callback?: any) {
        if (callback) {
            callback(this._config)
            
        } else {
            return new Promise((resolve, reject) => {
                resolve(this._config)
            })
        }

    }


    async changeConfig(config: any, callback?: any) {
        let error: string | null = null
        let result: any = null
        let wasRunning = this.running
        try {
            if (this.running === true) {
                await this.stop()
                this.running = false
            }
            await this.create(config)
            result = 'config changed'
            if (wasRunning) {
                await this.start()
                result += ', restarted'
            }
        } catch (err) {
            error = `error changing config:${err}`
        }
        if (callback) {
            if (error) {
                callback(null, error)
            } else {    
                callback(result, null)
            }
        } else {
            return new Promise((resolve, reject) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        }

    }
    

    start(callback?: any) {
        if (callback) {
            if (this._config) {
                this._server = this._app.listen(this._config.port)
                this._server.on('listening', () => {
                    this.running = true
                    callback(`running on port ${this._config.port}`, null)
                })
                this._server.on('error', (err: any) => {
                    this.running = false
                    callback(null, `error:${err.code}`)
                })
            } else {
                this.running = false
                callback(null, 'create an engine first!')
            }
        } else {
            return new Promise((resolve, reject) => {
                if (this._config) {
                    this._server = this._app.listen(this._config.port)
                    this._server.on('listening', () => {
                        this.running = true
                        resolve(`running on port ${this._config.port}`)
                    })
                    this._server.on('error', (err: any) => {
                        this.running = false
                        reject(`error:${err.code}`)
                    })
                } else {
                    this.running = false
                    reject('create an engine first!')
                }
            })
        }
    }

    stop(callback?: any) {
        let error: string | null = null
        let result: string | null = null
        try {
            this._server.close()
            result = `engine stopped`
        } catch (err) {
            error = `error stopping engine: ${err}`
        }
        if (callback) {
            if (error) {
                callback(null, error)
            } else {    
                callback(result, null)
            }
        } else {
            return new Promise((resolve, reject) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        }
    }

    toggleDebugMode(method: string, path: string, debug?: any, callback?: any) {
        let error: string | null = null
        let result: any = null
        let routeFound: EngineRoute | undefined
        if (!this._config) {
            error = `create an engine first!`
        } else if (this.running !== true) {
            error = `engine not running!`
        } else {
            let engineRoutes: EngineRoute[] = this._config.routes
            routeFound = engineRoutes.find( r => { return ((!r.method && method === 'GET') || (r.method === method)) && r.path === path })
            if (!routeFound) {
                error = `no "${method} ${path}" route!`
            } else {
                let nextDebugState: boolean
                if (Object.prototype.toString.call(debug) === '[object Boolean]') {
                    nextDebugState = debug
                } else {
                    nextDebugState = !routeFound.debug   
                }
                routeFound.debug = nextDebugState
                result = {
                    method: method,
                    path: path,
                    debugMode: routeFound.debug
                }
                this.emit('debugStatus', result)      
            }
        }
        if (callback) {
            if (error) {
                callback(null, error)
            } else {    
                callback(result, null)
            }
        } else {
            return new Promise((resolve, reject) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        }
    }

    changeResponse(method: string, path: string, responseName: string, callback?: any) {
        let error: string | null = null
        let result: string | null = null
        let routeFound: any
        if (!this._config) {
            error = `create an engine first!`
        } else if (this.running !== true) {
            error = `engine not running!`
        } else {
            let engineRoutes: EngineRoute[] = this._config.routes
            routeFound = engineRoutes.find( r => { return ((!r.method && method === 'GET') || (r.method === method)) && r.path === path })
            if (!routeFound) {
                error = `no "${method} ${path}" route!`
            } else if (!routeFound.responses.hasOwnProperty(responseName)) {
                error = `no response with name "${responseName}"!`
            } else {
                routeFound.currentResponse = responseName
                result = `changed response on "${method} ${path}" to "${responseName}"`
            }
        }
        if (callback) {
            if (error) {
                callback(null, error)
            } else {
                callback(result, null)
            }
        } else {
            return new Promise((resolve, reject) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        }
    }

    //  Private methods

    private createEngine() {
        let config = this._config
                /*      setting keep-alive to false     */
        this._app.use(function(req: any, res: any, next: any) {
            res.setHeader('Connection', 'close')
            next()
        })
                /*      handling requests     */
        this._app.use('/', (req: any,res: any) => {

            let reqPath = req.path
            let reqMethod = req.method
            let engineRoutes: EngineRoute[] = config.routes
            let responseFound: any = engineRoutes.find( r => { return (!r.method || r.method === reqMethod) && r.path === reqPath })

            let selectedResponse: any = null

            if (!responseFound || !responseFound.responses || Object.prototype.toString.call(responseFound.responses) !== '[object Object]' || Object.entries(responseFound.responses).length === 0) {
                selectedResponse = config.fallback
            } else {
                if (responseFound.currentResponse && responseFound.responses[responseFound.currentResponse]) {
                    selectedResponse = responseFound.responses[responseFound.currentResponse]
                } else if (responseFound.responses['default']) {
                    selectedResponse = responseFound.responses['default']
                } else {
                    selectedResponse = Object.entries(responseFound.responses)[0][1]
                }
            }

            if (responseFound.debug) {
                let newResponseId = uuidv4()
                this.debuggedResponses[newResponseId] = {
                    res: res,
                    response: selectedResponse,
                    responses: responseFound.responses
                }
                this.emit('debug', {
                    id: newResponseId,
                    responses: responseFound.responses
                })  
                this.clearDebuggedResponse(newResponseId)
            } else {
                this.sendResponse(res, selectedResponse)
            }
        })
    }

    private sendResponse(res: any, response: any) {
        if (Object.prototype.toString.call(response) === '[object Object]' || Object.prototype.toString.call(response) === '[object Array]') {
            res.json(response)
        } else if (Object.prototype.toString.call(response) === '[object String]' || Object.prototype.toString.call(response) === '[object Number]') {
            res.send(response.toString())
        } else {
            console.log('could not determine type of response! is it JSON, is it a string, a number..?')
        }
    }

    private proceedDebuggedResponse(id: string, responseName?: string | null, timeout?: boolean) {
        if (this.debuggedResponses[id]) {
            let { res, response, responses } = this.debuggedResponses[id]
            delete this.debuggedResponses[id]
            let responseDTO: any = {
                id: id
            }
            if (timeout) {
                responseDTO.timeout = true
                responseDTO.timeoutDelay = this._debugTimeout
            } else {
                responseDTO.proceeding = true
            }
            if (responseName) {
                response = responses[responseName]
                responseDTO.responseName = responseName
            }
            this.clearDebugTimer(id)
            this.sendResponse(res, response)
            this.emit('debugStatus', responseDTO)
        } else {
            this.emit('debugStatus', {
                responseNotFound: true,
                id: id
            })
        }
    }

    private clearDebugTimer(responseId: string) {
        if (this.timeoutTimers[responseId]) {
            clearTimeout(this.timeoutTimers[responseId])
        }
    }

    private clearDebuggedResponse(responseId: string) {
        this.timeoutTimers[responseId] =  setTimeout(()=> {
            this.proceedDebuggedResponse(responseId, null, true)
        }, this._debugTimeout)
    }
}
