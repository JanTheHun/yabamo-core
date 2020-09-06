const allowedMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "*all*"]

export interface EngineRoute {
    path: string
    method?: string
    enabled?: boolean
    debug?: boolean
    currentResponse?: string
    responses: {
        [key: string]: any
    }
}

export function checkRoute(rawRoute: any) {
    return new Promise((resolve, reject) => {
        if (!rawRoute) {
            reject('provide a route to check!')
        }
        if (rawRoute.hasOwnProperty("path")) {
            if (Object.prototype.toString.call(rawRoute.path) !== "[object String]") {
                reject(`wrong "path" format on Route: ${JSON.stringify(rawRoute)}`)
            }
        } else {
            reject(`no "path" on Route: ${JSON.stringify(rawRoute)}`)
        }
        if (rawRoute.hasOwnProperty("method")) {
            if (Object.prototype.toString.call(rawRoute.method) !== "[object String]") {
                reject(`wrong "method" format on Route: ${JSON.stringify(rawRoute)}`)
            }
            if (allowedMethods.indexOf(rawRoute.method) === -1) {
                reject(`wrong "method" value on Route: ${JSON.stringify(rawRoute)}`)
            }
        }
        if (rawRoute.hasOwnProperty("enabled")) {
            if (typeof rawRoute.enabled !== typeof true) {
                reject(`"enabled" is not boolean on Route: ${JSON.stringify(rawRoute)}`)
            }
        }
        if (rawRoute.hasOwnProperty("debug")) {
            if (typeof rawRoute.debug !== typeof true) {
                reject(`"debug" is not boolean on Route: ${JSON.stringify(rawRoute)}`)
            }
        }       
        if (rawRoute.hasOwnProperty("currentResponse")) {
            if (Object.prototype.toString.call(rawRoute.currentResponse) !== "[object String]") {
                reject(`wrong "currentResponse" format on Route: ${JSON.stringify(rawRoute)}`)
            }
        }
        if (rawRoute.hasOwnProperty("responses")) {
            if (Object.prototype.toString.call(rawRoute.responses) !== "[object Object]") {
                reject(`wrong "responses" format on Route: ${JSON.stringify(rawRoute)}`)
            }
            if (Object.keys(rawRoute.responses).length < 1) {
                reject(`empty responses on Route: ${JSON.stringify(rawRoute)}`)
            }
        } else {
            reject(`no "responses" on Route: ${JSON.stringify(rawRoute)}`)
        }
        if (rawRoute.hasOwnProperty("debug")) {
            if (Object.prototype.toString.call(rawRoute.debug) !== '[object Boolean]') {
                reject(`"debug"  is not boolean on Route: ${JSON.stringify(rawRoute)}`)
            }
        }
        
        resolve('route checks out')   
    })   
}
