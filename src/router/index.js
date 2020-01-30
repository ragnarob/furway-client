import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Info from '../views/Info.vue'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import ForgottenPassword from '../views/ForgottenPassword.vue'
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
      middleware: logRoute,
    }
  },
  {
    path: '/info',
    name: 'info',
    component: Info,
    meta: {
      middleware: logRoute,
      title: 'Information'
    }
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
    meta: {
      middleware: logRoute,
      title: 'Signup'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      middleware: logRoute,
      title: 'Login'
    }
  },
  {
    path: '/forgotten-password',
    name: 'forgottenPassword',
    component: ForgottenPassword,
    meta: {
      middleware: logRoute,
      title: 'Forgotten password'
    }
  },
  {
    path: '/my-profile',
    name: 'myProfile',
    component: MyProfile,
    meta: {
      middleware: logRoute,
      title: 'My profile'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      middleware: logRoute,
      title: 'Registration'
    }
  },
  {
    path: '/my-registration',
    name: 'myRegistration',
    component: MyRegistration,
    meta: {
      middleware: logRoute,
      title: 'My registration'
    }
  },
  {
    path: '/admin',
    name: 'admin',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/Admin.vue')
    },
    meta: {
      middleware: logRoute,
      title: 'Admin'
    }
  },
  {
    path: '*',
    name: 'notFound',
    component: NotFound,
    meta: {
      middleware: logRoute,
      title: 'Not found'
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from) {
    return {x: 0, y: 0}
  }
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
  document.title = to.meta.title ? `Furway - ${to.meta.title}` : 'Furway 2020'

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
