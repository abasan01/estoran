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
  eventBusAdmin
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

  meta: {
    needsUser: false,
    needsAdmin: false,
    needsTable: false,
  },
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

    })
    console.log("Stara ruta", from.name, " ->", to.name, " Korisnik: ", store.currentUser)

    eventBusAdmin.$emit("checkUser");
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
    } else if (isAdmin) {
      if (to.name == "order") {
        window.location.href = "/order";
      } else if ((!to.meta.needsAdmin)) {
        next({
          name: "upload"
        })
      } else {
        next()
      }
    } else if (!noUser) {
      if (store.userTable) {
        console.log("aaaa")
        let usercount = 0;
        db.collection("tables")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const data = doc.data();

              if (
                moment(data.Trajanje).isBefore() &&
                data.user == store.currentUser
              ) {
                usercount++;
                db.collection("tables")
                  .doc(doc.id)
                  .set({
                    Dostupan: true,
                    order: "",
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
            } else if (!usercount) {
              next();
            } else if (!to.meta.needsTable) {
              alert("Narudžba vam nije još istekla, pričekajte!")
            } else {
              next();
            }
          })
          .catch((e) => {
            console.error(e);
          })
      } else {
        if (to.meta.needsAdmin || to.meta.needsTable || !to.meta.needsUser) {
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