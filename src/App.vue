<template>
  <div id="app">
    <nav>
      <router-link to="/">Home </router-link> |
      <router-link v-if="!store.currentUser" to="/login">Login </router-link>
      <router-link v-if="!store.currentUser" to="/signup">Signup </router-link>
      <a href="#" v-if="store.currentUser" @click.prevent="logout()">logout</a>
    </nav>
    <router-view />
  </div>
</template>

<script>
import store from "@/store";
import { firebase } from "@/firebase.js";
import router from "@/router";

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("Korisnik postoji", user.email);
    store.currentUser = user.email;
  } else {
    console.log("Korisnik ne postoji");
    store.currentUser = null;

    if (router.name !== "login") router.push({ name: "login" });
  }
});

export default {
  name: "app",
  data() {
    return {
      store,
    };
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "login" });
        });
    },
  },
};
</script>

<style lang="scss">
$primary: #900;
@import "../scss/custom.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
