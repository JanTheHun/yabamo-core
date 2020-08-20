import express from 'express'
import { EngineRoute } from './classes/EngineRoute'
import { EngineConfig, checkConfig, checkConfigSync } from './classes/EngineConfig'

export { checkRoute, checkRouteSync } from './classes/EngineRoute'
export { checkConfig, checkConfigSync } from './classes/EngineConfig'

export class ServerInstance {
    _app: express.Application
    _server: any
    _config!: EngineConfig
    running: boolean = false

    constructor () {
        this._app = express()
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
                callback(null, 'create it first..')
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
                    reject('create it first..')
                }
            })
        }
    }

    async startSync() {
        try {
            console.log('start sync')
            await this.start()
            console.log('sync started')
            return true
        } catch (err) {
            return false
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

    changeResponse(method: string, path: string, responseName: string, callback?: any) {
        let error: string | null = null
        let result: string | null = null
        let routeFound: any

        if (!this._config) {
            error = `no engine created!`
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

    createSync(config: EngineConfig): { result: string | null, error: string | null } {
        let result: any = null
        let error: any = null
        let configCheck: { result: string | null, error: string | null } = checkConfigSync(config)
        if (configCheck.error) {
            error = configCheck.error
        } else {
            this._config = config
            this._app = this.createEngine()
            result = 'synchronous creation succeeded!'
        }
        return { result, error }
    }

    async create(config: EngineConfig, callback?: any) {
        let error: string | null = null
        let result: string | null = null

        try {
            this._config = config
            await checkConfig(config)
            this._app = this.createEngine()
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

    private createEngine() {
        let newApp = express()
        let config = this._config
                /*      setting keep-alive to false     */
        newApp.use(function(req: any, res: any, next: any) {
            res.setHeader('Connection', 'close')
            next()
        })

        newApp.get('/favicon.ico', (req: any, res: any) => {
            res.sendFile(__dirname.concat('/favicon.ico'))
        })
                /*      handling requests     */
        newApp.use('/', (req: any,res: any) => {

            let reqPath = req.path
            let reqMethod = req.method
            let engineRoutes: EngineRoute[] = config.routes
            let responseFound: any = engineRoutes.find( r => { return (!r.method || r.method === reqMethod) && r.path === reqPath })

            let currentResponse: any = null

            if (!responseFound || !responseFound.responses || Object.prototype.toString.call(responseFound.responses) !== '[object Object]' || Object.entries(responseFound.responses).length === 0) {
                currentResponse = config.fallback
            } else {
                if (responseFound.currentResponse && responseFound.responses[responseFound.currentResponse]) {
                    currentResponse = responseFound.responses[responseFound.currentResponse]
                } else if (responseFound.responses['default']) {
                    currentResponse = responseFound.responses['default']
                } else {
                    currentResponse = Object.entries(responseFound.responses)[0][1]
                }
            }

            if (Object.prototype.toString.call(currentResponse) === '[object Object]' || Object.prototype.toString.call(currentResponse) === '[object Array]') {
                res.json(currentResponse)
            } else if (Object.prototype.toString.call(currentResponse) === '[object String]' || Object.prototype.toString.call(currentResponse) === '[object Number]') {
                res.send(currentResponse.toString())
            } else {
                console.log('could not determine type of response! is it JSON, is it a string, a number..?')
            }
        })
        return newApp 
    }
}
