import Vue from 'vue'                                                    //import Vue 
import Router from 'vue-router'                                          //import Router

Vue.use(Router)                                                          //use router plugin in Vue

// route-level code splitting
const createListView = id => () => import('../views/CreateListView').then(m => m.default(id))         //import when required by calling a function
const ItemView = () => import('../views/ItemView.vue')
const UserView = () => import('../views/UserView.vue')

export function createRouter () {                                              //export createRouter function
  return new Router({                                                          //return new router object
    mode: 'history',                                                        
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      { path: '/top/:page(\\d+)?', component: createListView('top') },
      { path: '/new/:page(\\d+)?', component: createListView('new') },
      { path: '/show/:page(\\d+)?', component: createListView('show') },
      { path: '/ask/:page(\\d+)?', component: createListView('ask') },
      { path: '/job/:page(\\d+)?', component: createListView('job') },
      { path: '/item/:id(\\d+)', component: ItemView },
      { path: '/user/:id', component: UserView },
      { path: '/', redirect: '/top' }
    ]
  })
}
