<template>
  <div class="bg-primary" id="app">
    <nav id="nav" class="navbar">
      <router-link to="/">Home </router-link> |
      <router-link v-if="!store.currentUser" to="/login">Login </router-link>
      <router-link v-if="store.currentUser" to="/upload">Upload </router-link>
      <router-link v-if="store.currentUser" to="/order">Order </router-link>

      <a href="#" v-if="store.currentUser" @click.prevent="logout()">logout</a>
      {{ store.userTable }}

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
  mounted() {
    this.tableCheck();
  },
  methods: {
    async tableCheck() {
      try {
        const querySnapshot = await db.collection("tables").get();

        querySnapshot.forEach(async (doc) => {
          const data = doc.data();

          if (data.user == store.currentUser) {
            store.userTable = doc.id.slice(-1);
          }
        });
      } catch (error) {
        console.error("Greška: ", error);
      }
    },
    userCheck() {
      console.log(localStorage.getItem("user"));
      firebase.auth().onAuthStateChanged((user) => {
        const currentRoute = router.currentRoute;

        this.timeofDay();

        if (user) {
          console.log("Korisnik postoji", user.email);
          store.currentUser = user.email;
          localStorage.setItem("user", JSON.stringify(user.email));
          db.collection("users")
            .doc(store.currentUser)
            .get()
            .then((doc) => {
              store.userName = doc.data().name;
            })
            .then(() => {
              db.collection("tables")
                .get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    const data = doc.data();

                    if (
                      moment(data.Trajanje).isBefore() &&
                      data.user == store.currentUser
                    ) {
                      db.collection("tables")
                        .doc(doc.id)
                        .set({ Dostupan: true, Trajanje: 0, user: "" });
                      store.userTable = 0;
                    }
                  });
                })
                .then(() => {
                  console.log("Idem routati");
                  if (!currentRoute.meta.needsUser) {
                    router.push({ name: "home" });
                  }
                  if (store.userTable && currentRoute.name != "order") {
                    router.push({ name: "order" });
                  } else if (!store.userTable && currentRoute.name != "home")
                    router.push({ name: "home" });
                });
            })
            .catch((e) => error.log(e));
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
  background-color: $tertiary;
  padding: 20px;
  text-align: center;
}

.btn-custom {
  border-radius: 100px;
  border-color: $tertiary;
  width: 45%;
  font-size: 2.5rem;
  font-weight: bold;
}

.btn-custom:hover {
  border-radius: 100px;
  border-color: $tertiary;
}

.clicked {
  -webkit-box-shadow: inset 0px 0px 30px $black;
  -moz-box-shadow: inset 0px 0px 30px $black;
  box-shadow: inset 0px 0px 30px $black;
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
