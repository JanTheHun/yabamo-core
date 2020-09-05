# yabamo-core

Core library for **Y**et **A**nother **Ba**ckend **Mo**ckup application.
If you need a simple CLI tool to spin up a fake backend in a minute, check out [@jbp/yabamo-cli](https://www.npmjs.com/package/@jbp/yabamo-cli)!

Also on [github](https://github.com/JanTheHun/yabamo-core).

## Installation

```
npm install @jbp/yabamo-core
```

## Usage

### JavaScript

```
const yabamoCore = require('@jbp/yabamo-core')
const server = new yabamoCore.ServerInstance()
```

### TypeScript

```
import { ServerInstance } from ('@jbp/yabamo-core')
const server: ServerInstance = new ServerInstance()
```


## Examples

```
const config = {
    engineName: "test_engine",
    port: 3000,
    routes: [
        {
            path: '/',
            responses: {
                'default': 'yo'
            }
        }
    ],
    fallback: "sorry..404!"
}
server.create(config)
    .then(result => {
        console.log(result) // should log "engine created"
        server.start()
            .then(startResult => {
                console.log(startResult) // should log "running on port {...}"
            })
            .catch( err => {
                console.log(error)
            })
    })
    .catch( err => {
        console.log(error)
    })

```

### using *async-await*
```
try {
    await server.create(config)
    await server.start()
} catch (err) {
    console.log('err:', err)
}
```

## Configuration

```engineName``` - optional

```routes``` - required, ```Array``` of routes your API will respond to

```port``` - required, the port on which you want your API to run

```debugTimeout``` - optional, sets the timeout for ```debug``` events in milliseconds, defaults to 30 seconds

```fallback``` - optional

### Route
```path``` - required

```method``` - optional, defaults to ```GET```

```debug``` - optional boolean flag, when ```true``` the API will pause and emit a ```debug``` event every time the route has been requested

```responses``` - required, a ```key=>value``` map describing possible responses. A response can be a string, a number, an array or an object. Arrays and objects will be JSON stringified and sent as JSON, strings and numbers will be sent as text.

```fallback``` - optional, the response to use if the request didn't match any of the routes.

## Methods
```.create(config)``` - creates API engine from the given configuration

```.start()``` - starts the API engine

```.stop()``` - stops the API engine

```.getConfig()``` - logs the current configuration

```.changeConfig(config)``` - overwrites the configuration with the provided new one and restarts the engine if it was already running

```.changeResponse(method, path, responseName)``` - changes current response on the route described by ```method``` and ```path``` to ```responseName```

```.toggleDebugMode(method, path, debugMode)``` - sets debug mode on the route described by ```method``` and ```path``` to ```debugMode``` if provided, toggles it if omitted. Note that if you are using it with a callback you __must__ provide at least a ```null``` for ```debugMode``` like this:

```
server.toggleDebugMode('GET', '/', null, (err, res) => {...})
```

```.checkRoute(route)``` - checks a single route, returns 'route checks out' if the route is valid

```.checkConfig(config)``` - checks whole configuration, returns 'config looks good' if it is valid

# Debug mode

If a route has a ```debug:true``` property, when a request arrives the engine pauses and emits a ```debug``` event (along with a unique ID of the debugging event), giving you control over which response to send on-the-fly. You can set up a listener with using
```
server.on('debug', (data)=> {
    console.log(data.id)
})
```
and then can use ```server.emit()``` method to responde with a ```go``` event along with the appropriate ```id``` and optionally with the name of a response. If you ommit the response name the engine will use the saved response it would use otherwise but here you have the opportunity to decide which response to send.

There is a timeout for the delayed responses, you can set it in the config with ```debugTimeout``` (in milliseconds) or it will default to 30 seconds.

## Basic debug mode example
Let's say you have a config like this:

```
{
    port: 3000,
    debugTimeout: 10000,
    routes: [
        {
            path: '/',
            debug: true,
            responses: {
                'default': 'yo',
                'other': 'yo!!!'
            }
        }
    ]
}
```
This configuration sets the timeout to 10 seconds, sets ```debug: true``` on the only path and creates two responses, ```default``` and ```other```.
If you set up your engine the following way:
```
import { ServerInstance } from ('@jbp/yabamo-core')
const server: ServerInstance = new ServerInstance()
async function main() {
    try {
        await server.create(config)
        await server.start()
        server.on('debug', (data) => {
            // setTimeout merely for demonstrative purposes
            setTimeout(() => {
                server.emit('go', data.id)
            }, 1000)
        })
    } catch (err) {
        console.log('error:', err)
    }
}
main()
```


 and make a ```GET``` request to ```http://localhost:3000```, the engine will emit a ```debug``` event which in turn will trigger a ```go``` event being emitted 1 second later with the ```id``` of the delayed response. With the config shown above this should result in a one second delayed ```yo``` response. But if you send the ```go``` event like this:
```
server.emit('go', data.id, 'other')
```
then you should get a slightly different result: ```yo!!!```

### ```debug``` event

The payload of ```debug``` event is the following:
```
{
    id: '...',
    responses: [...]
}
```
where ```id``` is a unique id for the debugged request and ```responses``` is an array with the possible responses. Given the basic configuration above, the following:

```
server.on('debug', (data) => {
    console.log(data)
})
```
when the API endpoint is being called, should print this:
```
{
  id: ...,
  responses: { default: 'yo', other: 'yo!!!' }
}
```