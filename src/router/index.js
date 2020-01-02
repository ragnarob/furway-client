import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import MyProfile from '../views/MyProfile.vue'
import Register from '../views/Register.vue'
import MyRegistration from '../views/MyRegistration.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/my-profile',
    name: 'myProfile',
    component: MyProfile
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/my-registration',
    name: 'myRegistration',
    component: MyRegistration
  },
  {
    path: '/admin',
    name: 'admin',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/Admin.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
