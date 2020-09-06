import { EngineRoute, checkRoute } from './EngineRoute'
export interface EngineConfig {
    engineName?: string
    port: number,
    routes: any[],
    fallback?: any,
    debugTimeout?: number
}

export function checkConfig(config: any): Promise<string> {
    return new Promise(async (resolve, reject) => {
        if (!config) {
            reject('no config')
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
        } else if (config.routes.length === 0) {
            reject('no routes')
        } else {
            try {
                await checkRoutes(config.routes)
            } catch (err) {
                reject(err)
            }
        }
        if (config.hasOwnProperty('debugTimeout') && isNaN(config.debugTimeout)) {
            reject('debugTimeout must be a number!')
        }
        resolve('config looks good')
    })
}

async function checkRoutes(routes: any[]) {
    let allGood = true
    let error = ''
    try {
        for (let route of routes) {
            await checkRoute(route)
        }
    } catch (err) {
        allGood = false
        error = err
    }
    return new Promise((resolve, reject) => {
        if (allGood) {
            resolve(true)
        } else {
            reject(error)
        }
    })
}