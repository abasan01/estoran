<template>
  <div class="bg-primary" id="app">
    <nav id="nav" class="navbar">
      <router-link to="/">Home </router-link> |
      <router-link v-if="!store.currentUser" to="/login">Login </router-link>
      <router-link v-if="store.currentUser" to="/upload">Upload </router-link>

      <a href="#" v-if="store.currentUser" @click.prevent="logout()">logout</a>

      <p v-if="currentTime == 1">Jutro, {{ store.userName }}</p>
      <p v-if="currentTime == 2">Dobar dan, {{ store.userName }}</p>
      <p v-if="currentTime == 3">Večer, {{ store.userName }}</p>
    </nav>
    <router-view />
  </div>
</template>

<script>
import store from "@/store";
import { firebase, db } from "@/firebase.js";
import router from "@/router";
import moment from "moment";

export default {
  name: "app",
  data() {
    return {
      store,
      currentTime: null,
    };
  },
  created() {
    this.userCheck();
  },
  methods: {
    userCheck() {
      firebase.auth().onAuthStateChanged((user) => {
        var doesThisWork = localStorage.getItem("user") !== null;
        const currentRoute = router.currentRoute;

        this.timeofDay();

        if (user) {
          console.log("Korisnik postoji", user.email);
          store.currentUser = user.email;
          localStorage.setItem("user", JSON.stringify(user));
          db.collection("users")
            .doc(store.currentUser)
            .get()
            .then((doc) => {
              store.userName = doc.data().name;
            })
            .catch((e) => error.log(e));

          if (!currentRoute.meta.needsUser) {
            router.push({ name: "home" });
          }
        } else {
          console.log("Korisnik ne postoji");
          store.currentUser = null;
          localStorage.removeItem("user");

          if (currentRoute.meta.needsUser) {
            router.push({ name: "login" });
          }
        }
      });
    },
    logout() {
      localStorage.removeItem("user");
      firebase.auth().signOut();
    },
    timeofDay() {
      {
        const hour = moment().hour();
        if (hour >= 6 && hour < 12) {
          this.currentTime = 1;
        } else if (hour >= 12 && hour < 19) {
          this.currentTime = 2;
        } else {
          this.currentTime = 3;
        }
      }
    },
  },
};
</script>

<style lang="scss">
$primary: #003f69;
$secondary: #0062a3;
$tertiary: #fff;

@import "../scss/custom.scss";

.order-menu {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #f1f1f1;
  padding: 20px;
  text-align: center;
}

.btn-custom {
  border-radius: 100px;
  border-color: $tertiary;
}

.btn-custom:hover {
  border-radius: 100px;
  border-color: $tertiary;
}

.clickable {
  cursor: pointer;
}

.img-flip {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $tertiary;
  overflow-x: hidden;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: $tertiary;

    &.router-link-exact-active {
      color: $secondary;
    }
  }
}
</style>
