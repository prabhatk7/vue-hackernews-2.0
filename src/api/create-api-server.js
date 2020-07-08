import Firebase from 'firebase'
import LRU from 'lru-cache'

export function createAPI ({ config, version }) {                                     //this createAPI fun for server side
  let api
  // this piece of code may run multiple times in development mode,
  // so we attach the instantiated API to `process` to avoid duplications
  if (process.__API__) {
    api = process.__API__                       //if api exist then no initialization
  } else {
    Firebase.initializeApp(config)
    api = process.__API__ = Firebase.database().ref(version)       //else initialize api with new API

    api.onServer = true                                           //set api.onServer true

    // fetched item cache
    api.cachedItems = LRU({                                       
      max: 1000,
      maxAge: 1000 * 60 * 15 // 15 min cache
    })

    // cache the latest story ids
    api.cachedIds = {}                                               //initialize api.cachedIds as empty object
    ;['top', 'new', 'show', 'ask', 'job'].forEach(type => {          //for each word/type in the array a function is called
      api.child(`${type}stories`).on('value', snapshot => {          //for each type a snapshot value is stored
        api.cachedIds[type] = snapshot.val()
      })
    })
  }
  return api                                                       //return api
}
