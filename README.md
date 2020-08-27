# yabamo-core

Core library for **Y**et **A**nother **Ba**ckend **Mo**ckup application.
If you need a simple CLI tool to spin up a fake backend in a minute, check out [@jbp/yabamo-cli](https://www.npmjs.com/package/@jbp/yabamo-cli)!

## Installation

```npm i @jbp/yabamo-core```

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
## Basic examples
```
// provide a config in JSON
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

// check the config if you want
server.checkConfig(config, (result, error) => {
    if (error) {
        console.log(error)  // should log "config looks good"
    } else {
        console.log(result)
    }
})

/ ..or use Promises instead of callbacks
server.checkConfig(config)
    .then( result => {
        console.log(result)
    })
    .catch( err => {
        console.log(error)
    })
})

// you can even check a single route
server.checkRoute(config)
    .then( result => {
        console.log(result) // should log "route checks out"
    })
    .catch( err => {
        console.log(error)
    })
})

//create a server from config
server.create(config)
    .then( result => {
        console.log(result) // should log "engine created"
    })
    .catch( err => {
        console.log(error)
    })

// finally, start the engine
server.start()
    .then( result => {
        console.log(result) // should log "running on port {...}"
    })
    .catch( err => {
        console.log(error)
    })
```

### Basic working example with async-await
```
// create an async function so that you can use await inside

async function main() {
    try {

        await server.create(config)
        await server.start()

        // ..or you can log confirm messages
        //let creation = await server.create(config)
        //console.log(creation)
        //let starting = await server.start()
        //console.log(starting)

    } catch (err) {
        console.log('err:', err)
    }
}

// ..and run it
main()
```

# Debug mode

If a route has a ```debug:true``` property, the engine pauses when a request arrives. This gives you the opportunity to decide which response to send on-the-fly. The engine emits a ```debug``` event along with an ```id``` property which you can set a listener on with ```.on('debug', ...)```. You can use your engine's ```.emit()``` method to response with a ```go``` event along with the appropriate ```id``` and optionally with the name of a response. If you ommit the response name the engine will use the saved response it would use otherwise but here you have the opportunity to decide which response to send.

There is a timeout for the delayed responses, you can set it in the config with ```debugTimeout``` (in milliseconds) or it will default to 30 seconds.

## Basic example

```
{
    engineName: "test_engine",
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
This configuration sets the timeout to 10 seconds and creates two responses, ```default``` and ```other```.
If you set up your engine the following way:
```
main()

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
        console.log('err:', err)
    }
}
```


 If you make a ```GET``` request to ```http://localhost:3000```, the engine will emit a ```debug``` event which in turn will trigger a ```go``` event emitted 1 seconds later with the id of the delayed response. With the config shown above this should result in a one second delayed ```yo``` response. But if you send the ```go``` event like this:

```server.emit('go', data.id, 'other')```

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
when beeing called, should print this:
```
{
  id: ...,
  responses: { default: 'yo', other: 'yo!!!' }
}
```