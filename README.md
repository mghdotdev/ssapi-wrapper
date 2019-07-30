# SSAPI Wrapper

Just a SearchSpring API Wrapper for JavaScript client-side or NodeJS applications...

## Install

```
npm i --save ssapi-wrapper
```

## Usage

```
import * as SSAPI from 'ssapi-wrapper'

const api = new SSAPI.Client( 'siteId', { resultsPerPage: 10 } );

api.on( 'search', ( data ) => { console.log( data ); } );

api
    .query( 'shirts' )
    .sort( 'price', 'asc' )
    .filter( 'size', '10 Feet' )
    .page( 2 )
    .search();
```