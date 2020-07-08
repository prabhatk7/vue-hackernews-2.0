// this is aliased in webpack config based on server/client build
import { createAPI } from 'create-api'                         //import createAPI based on server or client

const logRequests = !!process.env.DEBUG_API                    

const api = createAPI({                                        //createAPI function is called, an object with version and config parameter is passed.
  version: '/v0',
  config: {
    databaseURL: 'https://hacker-news.firebaseio.com'
  }
})

// warm the front page cache every 15 min
// make sure to do this only once across all requests
if (api.onServer) {                                             //call warmCache function 
  warmCache()
}

function warmCache () { 
  fetchItems((api.cachedIds.top || []).slice(0, 30))            // fetch items in catche 
  setTimeout(warmCache, 1000 * 60 * 15)                        //call warnCache function recursively on every 15 mins
}

function fetch (child) {                                         //function for fetching cache for child node
  logRequests && console.log(`fetching ${child}...`)
  const cache = api.cachedItems                                 //cachedItems is assigned to cache 
  if (cache && cache.has(child)) {                               //if cache and its child exist
    logRequests && console.log(`cache hit for ${child}.`)       //no need to serch for child hence console log the message
    return Promise.resolve(cache.get(child))                    //return promise resolve
  } else {                                                      
    return new Promise((resolve, reject) => {                   //else return new promise
      api.child(child).once('value', snapshot => {              //api child once found 
        const val = snapshot.val()                              //put snapshot value in val
        // mark the timestamp when this item is cached
        if (val) val.__lastUpdated = Date.now()
        cache && cache.set(child, val)                         //set the value to val
        logRequests && console.log(`fetched ${child}.`)        //console log the message
        resolve(val)
      }, reject)
    })
  }
}

export function fetchIdsByType (type) {               //fetch id by type
  return api.cachedIds && api.cachedIds[type]        //if cacheId of that type already exists
    ? Promise.resolve(api.cachedIds[type])            //resolve promise and return id
    : fetch(`${type}stories`)                        //else fetch id of that type
}

export function fetchItem (id) {                   //fetch item with id
  return fetch(`item/${id}`)
}

export function fetchItems (ids) {                      //fetch multiple items with ids
  return Promise.all(ids.map(id => fetchItem(id)))
}

export function fetchUser (id) {                       //fetch user with id
  return fetch(`user/${id}`)
}

export function watchList (type, cb) {                
  let first = true
  const ref = api.child(`${type}stories`)
  const handler = snapshot => {
    if (first) {
      first = false
    } else {
      cb(snapshot.val())
    }
  }
  ref.on('value', handler)
  return () => {
    ref.off('value', handler)
  }
}
