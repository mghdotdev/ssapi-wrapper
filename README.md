# SSAPI Wrapper

Just a SearchSpring API Wrapper for JavaScript client-side or NodeJS applications...

## Install

```
npm i --save ssapi-wrapper
```

## Usage

```
import * as SSAPI from 'ssapi-wrapper'

// define new client
const api = new SSAPI.Client( 'siteId', { resultsPerPage: 10 } );

// define callback for the "search" event
api.on( 'search', ( data ) => { console.log( data ); } );

// execute functions and trigger search
const singleResponse = api
    .backgroundFilter( 'category', 'clothing' ) // methods can be chained in sequence to modify the 
    .query( 'shirts' ) state
    .sort( 'price', 'asc' )
    .filter( 'size', 'Small' )
    .filter( 'color', 'Red' )
    .page( 2 )
    .search(); // the request will only be sent once the `search` method is called

// alternatively handle the promise generated from the `search` method
singleResponse.then( ( data ) => { console.log( data ); } );
```