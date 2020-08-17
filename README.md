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

// ..and use it with a callback or as a Promise

// callback
server.start(config, (result, error) => {
    if (error) {
        //...
    }
})

// Promise
server.start(config)
    .then(result => {

    })
    .catch(error => {
        
    })
```