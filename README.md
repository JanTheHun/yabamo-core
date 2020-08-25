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

server.create(config, (result, error) => {
    if (error) {
        // reason of error in 'error'
    } else {
        // ..
    }
})

// ..or use it as a Promise
server.create(config)
    .then(result => {
        // ..
    })
    .catch(error => {
        // reason of error
    })

// finally, start the engine

server.start()
    .then(result => {
        // ..
    }).catch(error => {
        // reason of error
    })
```

### Basic working example with async-await
```
// create an async function so that you can use await inside

async function main() {
    try {
        let creation = await server.create(config)
        console.log(creation)
        let starting = await server.start()
        console.log(starting)
    } catch (err) {
        console.log('err:', err)
    }
}

// ..and run it
main()
```