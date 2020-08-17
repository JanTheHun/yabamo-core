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

```
// provide a config in JSON
const config = {
    port: 3000,
    routes: [
        {
            path: '/',
            responses: {
                'default': 'yo'
            }
        }
    ]
}

// use the synchronous version if you want

server.createSync(config)

// ..or use in async way with callback

server.create(config, (result, error) => {
    if (error) {
        // reason of error in 'error'
    } else {
        // ..
    }
})

// ..or as a Promise
server.create(config)
    .then(result => {
        // ..
    })
    .catch(error => {
        // reason of error in 'error'
    })

// finally, start the engine

server.start()
    .then(result => {
        // ..
    }).catch(error => {
        // reason of error in 'error'
    })
```