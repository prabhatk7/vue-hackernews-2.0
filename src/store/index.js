import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)                                         //use Vuex in Vue

export function createStore () {                      //create and export store
  return new Vuex.Store({                              //return vuex store with following states
    state: {
      activeType: null,
      itemsPerPage: 20,
      items: {/* [id: number]: Item */},
      users: {/* [id: string]: User */},
      lists: {
        top: [/* number */],
        new: [],
        show: [],
        ask: [],
        job: []
      }
    },
    actions,                                    //return actions,mutations and getters as well
    mutations,
    getters
  })
}
