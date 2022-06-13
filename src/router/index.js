import About from '../views/About.vue';
import AdminHome from '../views/AdminHome.vue';
import Billing from '../views/Billing.vue';
import Connections from '../views/Connections.vue';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';

import Password from '../views/Password.vue';
import Settings from '../views/Settings.vue';
import Unauthorized from '../views/Unauthorized.vue';

import AuthLayout from '../AuthLayout.vue';
// import AuthLayoutMobile from '../views/AuthLayoutMobile.vue';
import PublicLayout from '../PublicLayout.vue';

const routes = [
  // public views...
  {
    path: '/about',
    component: publicLayout(),
    children:[
      {
        path: '',
        name: 'About',
        component: About,
      },
    ] 
  },
  {
    path: '/login',
    component: publicLayout(),
    children:[
      {
        path: '',
        name: 'Login',
        component: Login,
      },
    ] 
  },
  {
    path: '/password/:token',
    component: publicLayout(),
    children:[
      {
        path: '',
        name: 'Password',
        component: Password,
      },
    ] 
  },
  {
    path: '/unauthorized',
    component: publicLayout(),
    children:[
      {
        path: '',
        name: 'Unauthorized',
        component: Unauthorized,
      },
    ] 
  },
  {
    path: '/',
    component: publicLayout(),
    children:[
      {
        path: '',
        name: 'Home',
        component: Home,
      },
    ] 
  },
  // protected views...
  {
    path: '/admin',
    component: authLayout(),
    children:[
      {
        path: '',
        name: 'AdminHome',
        component: AdminHome,
      },
    ] 
  },
  {
    path: '/billing',
    component: authLayout(),
    children:[
      {
        path: '',
        name: 'Billing',
        component: Billing,
      },
    ] 
  },
  {
    path: '/connections',
    component: authLayout(),
    children:[
      {
        path: '',
        name: 'Connections',
        component: Connections,
      },
    ]
  },
  {
    path: '/settings',
    component: authLayout(),
    children:[
      {
        path: '',
        name: 'Settings',
        component: Settings,
      },
    ]
  },
  
  
];

function isMobile(){
  // return screen.width <= 760;
  return window.matchMedia("only screen and (max-width: 760px)").matches;
}
function publicLayout(){
  if(isMobile()){
    return PublicLayout;
  } else {
    return PublicLayout;
  }
}
function authLayout(){
  if(isMobile()){
    return AuthLayout;
  } else {
    return AuthLayout;
  }
}

export default routes
