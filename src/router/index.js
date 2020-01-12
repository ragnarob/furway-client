import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Info from '../views/Info.vue'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import MyProfile from '../views/MyProfile.vue'
import Register from '../views/Register.vue'
import MyRegistration from '../views/MyRegistration.vue'
import NotFound from '../views/NotFound.vue'
import { logRoute } from '../utils'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      middleware: logRoute
    }
  },
  {
    path: '/info',
    name: 'info',
    component: Info,
    meta: {
      middleware: logRoute
    }
  },
  // {
  //   path: '/signup',
  //   name: 'signup',
  //   component: Signup
  // },
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: Login
  // },
  // {
  //   path: '/my-profile',
  //   name: 'myProfile',
  //   component: MyProfile
  // },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      middleware: logRoute
    }
  },
  // {
  //   path: '/my-registration',
  //   name: 'myRegistration',
  //   component: MyRegistration
  // },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: function () {
  //     return import(/* webpackChunkName: "about" */ '../views/Admin.vue')
  //   }
  // },
  {
    path: '*',
    name: 'notFound',
    component: NotFound,
    meta: {
      middleware: logRoute
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index]
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next

  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters)
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1)
    subsequentMiddleware({ ...context, next: nextMiddleware })
  };
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware]

    const context = {
      from,
      next,
      router,
      to,
    }
    const nextMiddleware = nextFactory(context, middleware, 1)

    return middleware[0]({ ...context, next: nextMiddleware })
  }

  return next()
})


export default router
