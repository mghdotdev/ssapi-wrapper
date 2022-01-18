# SSAPI Wrapper

Just a SearchSpring API Wrapper for JavaScript client-side or NodeJS applications...

## Install

### pnpm

```
pnpm add ssapi-wrapper
```

### npm

```
npm i ssapi-wrapper
```

## Usage

### Search

```
import * as SSAPI from 'ssapi-wrapper'

// define new client
const api = new SSAPI.Client( 'siteId', { resultsPerPage: 10 } );

// define callback for the "search" event
api.on('search', ({ detail: response }) => {
    console.log(response);
});

// execute functions and trigger search
const singleRequest = api
    .backgroundFilter( 'category', 'clothing' ) // methods can be chained in sequence to modify the state
    .query( 'shirts' )
    .sort( 'price', 'asc' )
    .filter( 'size', 'Small' )
    .filter( 'color', 'Red' )
    .page( 2 )
    .search(); // the request will only be sent once the `search` method is called

// alternatively handle the promise generated from the `search` method
const response = await singleRequest;
```

### Autocomplete

```
import * as SSAPI from 'ssapi-wrapper'

// define new client
const api = new SSAPI.Client( 'siteId', {}, { limit: 4 } );

// define callback for the "autocomplete" event
api.on('autocomplete', ({ detail: response }) => {
    console.log(response);
});

// execute functions and trigger autocomplete
const singleRequest = api
    .query( 'shirts' )
    .autocomplete(); // the request will only be sent once the `autocomplete` method is called

// alternatively handle the promise generated from the `autocomplete` method
const response = await singleRequest;
```