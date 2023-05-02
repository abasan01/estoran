<template>
  <div class="login bg-secondary border">
    <section class="w-100">
      <div class="container-fluid h-custom">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-md-9 col-lg-6 col-xl-6 my-lg-5 py-lg-5">
            <img
              src="@/assets/logoW.png"
              class="img-fluid"
              alt="Sample image"
            />
          </div>
          <div class="col-md-8 col-lg-6 col-xl-5 offset-xl-1 my-lg-5 py-lg-5">
            <form>
              <div
                class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start"
              >
                <p class="lead fw-normal mb-0 me-3">Ulogiravanje</p>
                <button
                  @click="toggleLogin"
                  type="button"
                  class="btn btn-primary btn-floating mx-1 me-5 buttonSizing"
                >
                  <span v-if="state">X</span>
                </button>

                <p class="lead fw-normal mb-0 me-3">Registracija</p>
                <button
                  @click="toggleSignup"
                  type="button"
                  class="btn btn-primary btn-floating mx-1 buttonSizing"
                >
                  <span v-if="!state">X</span>
                </button>
              </div>

              <!-- Name input -->
              <div v-if="!state" class="form-outline mb-4 mt-4">
                <input
                  @keyup.enter="stateLS"
                  type="text"
                  id="name"
                  v-model="name"
                  class="form-control form-control-lg"
                  placeholder="Unesite svoje ime"
                />
                <label class="form-label" for="name" style="margin-left: 0px"
                  >Ime</label
                >
                <div class="form-notch">
                  <div class="form-notch-leading" style="width: 9px"></div>
                  <div class="form-notch-middle" style="width: 88.8px"></div>
                  <div class="form-notch-trailing"></div>
                </div>
              </div>

              <!-- Email input -->
              <div class="form-outline mb-4 mt-4">
                <input
                  @keyup.enter="stateLS"
                  type="email"
                  v-model="username"
                  id="email"
                  class="form-control form-control-lg"
                  placeholder="Unesite svoju e-mail adresu"
                />
                <label class="form-label" for="email" style="margin-left: 0px"
                  >E-mail adresa</label
                >
                <div class="form-notch">
                  <div class="form-notch-leading" style="width: 9px"></div>
                  <div class="form-notch-middle" style="width: 88.8px"></div>
                  <div class="form-notch-trailing"></div>
                </div>
              </div>

              <!-- Password input -->
              <div class="form-outline mb-3">
                <input
                  @keyup.enter="stateLS"
                  type="password"
                  v-model="password"
                  id="password"
                  class="form-control form-control-lg"
                  placeholder="Unesite lozinku"
                />
                <label
                  class="form-label"
                  for="password"
                  style="margin-left: 0px"
                  >Lozinka</label
                >
              </div>

              <!-- Password repeat v-if signup -->
              <div v-if="!state" class="form-outline mb-3">
                <input
                  @keyup.enter="stateLS"
                  type="password"
                  v-model="passwordRepeat"
                  id="passwordRepeat"
                  class="form-control form-control-lg"
                  placeholder="Ponovite lozinku"
                />
                <label
                  class="form-label"
                  for="passwordRepeat"
                  style="margin-left: 0px"
                  >Lozinka</label
                >
                <div class="form-notch">
                  <div class="form-notch-leading" style="width: 9px"></div>
                  <div class="form-notch-middle" style="width: 64px"></div>
                  <div class="form-notch-trailing"></div>
                </div>
              </div>

              <div v-if="state" class="text-center text-lg-start mt-4 pt-2">
                <button
                  type="button"
                  @click="login()"
                  class="btn btn-primary btn-lg"
                  style="padding-left: 2.5rem; padding-right: 2.5rem"
                >
                  Ulogiraj se
                </button>
              </div>

              <div v-if="!state" class="text-center text-lg-start mt-4 pt-2">
                <button
                  type="button"
                  @click="signup()"
                  class="btn btn-primary btn-lg"
                  style="padding-left: 2.5rem; padding-right: 2.5rem"
                >
                  Registriraj se
                </button>
              </div>
              <div class="text-center text-lg-start mt-4 pt-2">
                <button
                  type="button"
                  @click="test()"
                  class="btn btn-primary btn-lg"
                  style="padding-left: 2.5rem; padding-right: 2.5rem"
                >
                  test
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <div class="p-4 text-center border-top mobile-hidden">
      <a
        class="btn btn-link px-3"
        data-mdb-toggle="collapse"
        href="#example1"
        role="button"
        aria-expanded="false"
        aria-controls="example1"
        data-ripple-color="hsl(0, 0%, 67%)"
      >
        <i class="fas fa-code me-md-2"></i>
        <span class="d-none d-md-inline-block"> Show code </span>
      </a>

      <a class="btn btn-link px-3" data-ripple-color="hsl(0, 0%, 67%)">
        <i class="fas fa-file-code me-md-2 pe-none"></i>
        <span class="d-none d-md-inline-block export-to-snippet pe-none">
          Edit in sandbox
        </span>
      </a>
    </div>
  </div>
</template>

<script>
import { firebase, db } from "@/firebase.js";
import { doc, setDoc } from "firebase/firestore";

export default {
  name: "Login",
  data() {
    return {
      name: "",
      username: "",
      password: "",
      passwordRepeat: "",
      state: true,
    };
  },
  methods: {
    stateLS() {
      console.log("test");
      if (this.state) return this.login();
      else return this.signup();
    },
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.username, this.password)
        .then((result) => {
          console.log("Uspijeh! aaa", result);
        })
        .catch(function (error) {
          console.error("Došlo je do greške: ", error);
        });
    },
    test() {
      db.collection("users").doc(this.username).set({
        name: this.name,
      });
    },
    signup() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.username, this.password)
        .then(() => {
          console.log("name: ", this.name, "\nusername: ", this.username);

          db.collection("users")
            .doc(JSON.parse(JSON.stringify(this.username)))
            .set({
              name: this.name,
            });
          alert("Uspijeh!");
        })
        .catch(function (error) {
          console.error("Došlo je do greške: ", error);
        });
    },
    toggleLogin() {
      this.state = true;
    },
    toggleSignup() {
      this.state = false;
    },
  },
};
</script>

<style scoped>
.buttonSizing {
  width: 38px;
  height: 38px;
}
</style>
