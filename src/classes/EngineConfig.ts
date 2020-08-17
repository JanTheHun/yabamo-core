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

export function checkConfigSync(config: any) {
    if (!config) {
        return('no config')
    }
    if (!config.engineName) {
        return('no engineName')
    }
    if (!config.port) {
        return('no port number')
    }
    if (isNaN(config.port)) {
        return('port must be a number')
    }
    if (!config.routes) {
        return('must provide some routes')
    }
    if (Object.prototype.toString.call(config.routes) !== '[object Array]') {
        return('routes must be Array')
    }
    config.routes.forEach((r: EngineRoute) => {
        let routeResult = checkRouteSync(r)
        if (routeResult === 'route checks out') {
            return routeResult
        }
    })
    return('config looks good')
}