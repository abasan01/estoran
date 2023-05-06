import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '@/store'
import {
  firebase,
  db
} from "@/firebase.js"

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'home',
  component: HomeView,
  meta: {
    needsUser: true
  }
}, {
  path: '/login',
  name: 'login',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import( /* webpackChunkName: "about" */ '../views/Login.vue')
}, {
  path: '/upload',
  name: 'upload',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  meta: {
    needsUser: true
  },
  component: () => import( /* webpackChunkName: "about" */ '../views/Upload.vue')
}, ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

setTimeout(() => {
  router.beforeEach((to, from, next) => {
    firebase.auth().onAuthStateChanged((user) => {
      store.currentUser = user.email;
      console.log("store.currentUser:", store.currentUser)
    })
    console.log("Stara ruta", from.name, " ->", to.name, " Korisnik: ", store.currentUser)

    const noUser = store.currentUser === null;
    console.log("noUser: ", noUser, "\nto.meta.needsUser: ", to.meta.needsUser)

    if (noUser && (to.meta.needsUser)) {
      next({
        name: "login"
      });
    } else {
      next()
    }
  })
}, 1000);


export default router