import { EngineRoute, checkRoute, checkRouteSync } from './EngineRoute'
export interface EngineConfig {
    engineName: string
    port: number,
    routes: any[],
    fallback: any
}

export function checkConfig(config: any): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!config) {
            reject('no config')
        }
        if (!config.engineName) {
            reject('no engineName')
        }
        if (!config.port) {
            reject('no port number')
        }
        if (isNaN(config.port)) {
            reject('port must be a number')
        }
        if (!config.routes) {
            reject('must provide some routes')
        }
        if (Object.prototype.toString.call(config.routes) !== '[object Array]') {
            reject('routes must be Array')
        }
        config.routes.forEach((r: EngineRoute) => {
            checkRoute(r)
            .then(_ => {})
            .catch(err => {
                reject(err)
            })
        })
        resolve('config looks good')
    })
}

export function checkConfigSync(config: any): { result: string | null, error: string | null} {
    let error: string | null = null
    let result: string | null = null
    if (!config) {
        error = 'no config'
    }
    if (!config.engineName) {
        error = 'no engineName'
    }
    if (!config.port) {
        error = 'no port number'
    }
    if (isNaN(config.port)) {
        error = 'port must be a number'
    }
    if (!config.routes) {
        error = 'must provide some routes'
    }
    if (Object.prototype.toString.call(config.routes) !== '[object Array]') {
        error = 'routes must be Array'
    }
    config.routes.forEach((r: EngineRoute) => {
        let routeResult = checkRouteSync(r)
        if (routeResult !== 'route checks out') {
            error = routeResult
        }
    })
    if (error) {
        result = null
        
    } else {
        result = 'config looks good'
    }
    return({ error, result })
}