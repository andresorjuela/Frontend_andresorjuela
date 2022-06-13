import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import VueOffline from 'vue-offline'
import VueRouter from 'vue-router'
import '@/plugins/bootstrap-vue'
import App from '@/App.vue'
import routes from '@/router'
import store from '@/store'
import { ADMIN_ROLE, USER_ROLE } from '@/mixins/auth'
import { loadAuthState } from '@/lib/jwt-helper'
Vue.use(VueOffline);
Vue.use(VueRouter);

Vue.config.productionTip = false

const router = new VueRouter({
  routes
})

const OPEN_ROUTES = ['About','Login','Password','Unauthorized','Products','Home'];
const ADMIN_ROUTES = ['AdminHome',];
const USER_ROUTES = ['Billing','Connections','Settings',];

router.beforeEach((to, from, next) => {
  loadAuthState(store); // for every route, the auth state is re-inspected and validated
  let user = store.state.user;
  let roles = user ? user.roles || [] : [];
  console.debug(`roles: ${roles.length > 0 ? roles.join(',') : '(none)'} --> requesting: ${to.name}`)
  
  // if(to.path===from.path){ 
  //   console.debug(`  The paths already match.`)
  //   next(false); 
  
  // } else  
  if(OPEN_ROUTES.includes(to.name) ){
    console.debug(`  It's an open route.`)
    next();
  
  } else if (!user || !roles){
    console.debug(`  Unauthorized. A user and role are required.`)
    next({name: "Unauthorized"});
  
  } else {
    if( ( roles.includes(ADMIN_ROLE) && ( ADMIN_ROUTES.includes(to.name) || USER_ROUTES.includes(to.name) ) )
      || ( roles.includes(USER_ROLE) && USER_ROUTES.includes(to.name) ) ){
      // role and requested route name match
      console.debug(`  The route is authorized for ${roles.join(',')}.`)
      next();
    
    } else {
      console.debug(`  The route is not authorized for ${roles.join(',')}.`)
      // unauthorized
      next({name: "Unauthorized"});
    
    }
  }
});

new Vue({
  router,
  store,
  data: {
    open_routes: OPEN_ROUTES,
    variable1: "Test variable 1"
  },
  render: h => h(App)
}).$mount('#app')
