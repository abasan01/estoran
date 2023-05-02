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
  const currentRoute = router.currentRoute;

  if (user) {
    console.log("Korisnik postoji", user.email);
    store.currentUser = user.email;

    if (!currentRoute.meta.needsUser) {
      router.push({ name: "home" });
    }
  } else {
    console.log("Korisnik ne postoji");
    store.currentUser = null;

    if (currentRoute.meta.needsUser) {
      router.push({ name: "login" });
    }
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
      firebase.auth().signOut();
    },
  },
};
</script>

<style lang="scss">
$primary: #003f69;
$secondary: #0062a3;
$tertiary: #fff;
@import "../scss/custom.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $tertiary;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: $tertiary;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
