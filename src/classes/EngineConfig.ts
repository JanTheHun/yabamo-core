import { EngineRoute, checkRoute } from './EngineRoute'
export interface EngineConfig {
    engineName?: string
    port: number,
    routes: any[],
    fallback?: any,
    debugTimeout?: number
}

export function checkConfig(config: any): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!config) {
            reject('no config')
        }
        // if (!config.engineName) {
        //     reject('no engineName')
        // }
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