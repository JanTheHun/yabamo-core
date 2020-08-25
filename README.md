# yabamo-core

Core library for **Y**et **A**nother **Ba**ckend **Mo**ckup application.


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