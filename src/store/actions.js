import {                            //import from api
  fetchUser,
  fetchItems,
  fetchIdsByType
} from '../api'

export default {                                                         //object with functions is exported
  // ensure data for rendering given list type
  FETCH_LIST_DATA: ({ commit, dispatch, state }, { type }) => {          //for fetching list data
    commit('SET_ACTIVE_TYPE', { type })                                  //set active type as type
    return fetchIdsByType(type)                                         //fetchIds by type and return
      .then(ids => commit('SET_LIST', { type, ids }))                   //then set list 
      .then(() => dispatch('ENSURE_ACTIVE_ITEMS'))                       //then dispatch
  },

  // ensure all active items are fetched
  ENSURE_ACTIVE_ITEMS: ({ dispatch, getters }) => {                       //fetchfor all active Ids
    return dispatch('FETCH_ITEMS', {
      ids: getters.activeIds
    })
  },

  FETCH_ITEMS: ({ commit, state }, { ids }) => {                                 //fetch items by Ids
    // on the client, the store itself serves as a cache.
    // only fetch items that we do not already have, or has expired (3 minutes)
    const now = Date.now()
    ids = ids.filter(id => {
      const item = state.items[id]
      if (!item) {
        return true
      }
      if (now - item.__lastUpdated > 1000 * 60 * 3) {
        return true
      }
      return false
    })
    if (ids.length) {
      return fetchItems(ids).then(items => commit('SET_ITEMS', { items }))         //return fetch items and then set items
    } else {
      return Promise.resolve()                                        
    }
  },

  FETCH_USER: ({ commit, state }, { id }) => {                                 //fetchUser by ids
    return state.users[id]
      ? Promise.resolve(state.users[id])
      : fetchUser(id).then(user => commit('SET_USER', { id, user }))
  }
}
