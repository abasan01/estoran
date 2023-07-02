<template>
  <div class="pb-5" id="app">
    <nav id="nav" class="bg-primary navbar navbar-expand-lg py-1 px-5">
      <button
        class="navbar-toggler custom-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarTogglerDemo01"
        aria-controls="navbarTogglerDemo01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
        <img src="@/assets/logo.png" style="width: 90px" />
        <router-link
          v-if="!store.userTable && store.currentUser != 'admin@gmail.com'"
          to="/"
          class="nav-link"
          >Home
        </router-link>
        <router-link v-if="!store.currentUser" to="/login" class="nav-link"
          >Login
        </router-link>
        <router-link
          v-if="store.currentUser == 'admin@gmail.com'"
          to="/upload"
          class="nav-link"
          >Upload
        </router-link>
        <router-link
          v-if="store.currentUser == 'admin@gmail.com' || store.userTable"
          to="/order"
          class="nav-link"
          >Order</router-link
        >
        <a
          class="nav-link"
          href="#"
          v-if="store.currentUser"
          @click.prevent="logout()"
          >Logout</a
        >
        <span
          class="nav-link nav-link-span"
          v-if="currentTime == 1 && store.currentUser"
        >
          Jutro, {{ store.userName }}
        </span>
        <span
          class="nav-link nav-link-span"
          v-if="currentTime == 2 && store.currentUser"
        >
          Dobar dan, {{ store.userName }}
        </span>
        <span
          class="nav-link nav-link-span"
          v-if="currentTime == 3 && store.currentUser"
          >Večer, {{ store.userName }}</span
        >
      </div>
    </nav>
    <router-view />

    <div
      class="m-t4 p-4 text-center border-top mobile-hidden bg-primary"
      style="position: fixed; bottom: 0; width: 101%; padding: 5px"
    >
      <p class="m-0">Andrija Bašan, 2023.</p>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import { firebase, db } from "@/firebase.js";
import router from "@/router";
import moment from "moment";
import { eventBusAdmin } from "@/main";

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
          eventBusAdmin.$emit("checkUser");
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

                    if (data.user == store.currentUser) {
                      store.userTable = doc.id.slice(-1);
                    }
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
                  const isAdmin = store.currentUser == "admin@gmail.com";
                  console.log("isAdmin: ", isAdmin);
                  console.log(currentRoute.meta);
                  if (isAdmin) {
                    if (
                      !currentRoute.meta.needsAdmin &&
                      !currentRoute.meta.needsTable
                    ) {
                      router.push({ name: "upload" });
                    }
                  } else {
                    if (!currentRoute.meta.needsUser) {
                      router.push({ name: "home" });
                    }
                    if (store.userTable && currentRoute.name != "order") {
                      window.location.href = "/order";
                    } else if (!store.userTable && currentRoute.name != "home")
                      router.push({ name: "home" });
                  }
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
:root {
  --bs-nav-link-font-size: 30px;
  --bs-nav-link-font-weight: bold;
  --bs-nav-link-color: #e8f6ff;
}

.nav-link-span {
  color: #fff !important;
}

.navbar-expand-lg {
  justify-content: space-between;
}
.navbar-collapse {
  justify-content: space-between;
}

.custom-toggler .navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(255,255,255, 1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 8h24M4 16h24M4 24h24'/%3E%3C/svg%3E");
}

.custom-toggler.navbar-toggler {
  border-color: rgb(255, 255, 255);
}

$primary: #003f69;
$secondary: #0062a3;
$tertiary: #fff;

@import "../scss/custom.scss";

body {
  background-color: $secondary;
  overflow-x: hidden;
}

.color-tertiary {
  color: $tertiary;
}

.order-menu {
  z-index: 999;
  opacity: 0.85;
  position: fixed;
  left: 0;
  bottom: 45px;
  width: 102%;
  background-color: $tertiary;
  padding: 15px;
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

.router-link-exact-active {
  color: $tertiary;
}
</style>
