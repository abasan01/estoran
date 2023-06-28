import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '@/store'
import moment from "moment";
import {
  firebase,
  db
}
from "@/firebase.js"
import {
  eventBusTables
} from "@/main";

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'home',
  component: HomeView,
  meta: {
    needsUser: true,
    needsTable: false,
    needsAdmin: false,
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
    needsUser: true,
    needsAdmin: true,
    needsTable: false,
  },
  component: () => import( /* webpackChunkName: "about" */ '../views/Upload.vue')
}, {
  path: '/order',
  name: 'order',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  meta: {
    needsUser: true,
    needsTable: true,
    needsAdmin: false,
  },
  component: () => import( /* webpackChunkName: "about" */ '../views/OrderView.vue')
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
    const isAdmin = (store.currentUser === "admin@gmail.com");
    console.log("noUser: ", noUser, "\nto.meta.needsUser: ", to.meta.needsUser, "\nto.meta.needsAdmin", to.meta.needsAdmin, "\nto.meta.needsTable", to.meta.needsTable)

    if (noUser) {
      if (to.meta.needsUser) {
        next({
          name: "login"
        });
      } else {
        next()
      }
      /*   } else if (isAdmin) {
          if ((to.meta.needsAdmin)) {
            next()
          } else {
            next({
              name: "upload"
            })
          } */
    } else if (!noUser /* && !isAdmin */ ) {
      if (store.userTable) {
        db.collection("tables")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const data = doc.data();

              console.log(doc.id)

              if (
                moment(data.Trajanje).isBefore() &&
                data.user == store.currentUser
              ) {
                db.collection("tables")
                  .doc(doc.id)
                  .set({
                    Dostupan: true,
                    Trajanje: 0,
                    user: ""
                  });
                store.userTable = 0;
                store.totalTime = 0;
              }
            });
          })
          .then(() => {
            if (!store.userTable) {
              next({
                name: "home"
              })
            } else if (to.meta.needsAdmin || !to.meta.needsTable) {
              console.log("idemo na order")
              next({
                name: "order"
              });
            } else {
              next();
            }
          })
          .catch((e) => {
            console.error(e);
          })
      } else {
        console.log("test")
        if ( /* to.meta.needsAdmin || */ to.meta.needsTable) {
          next({
            name: "home"
          });
        } else {
          next();
        }
      }
    }
  })
}, 1000);


export default router