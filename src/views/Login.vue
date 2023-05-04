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
                  <span v-show="state">X</span>
                </button>

                <p class="lead fw-normal mb-0 me-3">Registracija</p>
                <button
                  @click="toggleSignup"
                  type="button"
                  class="btn btn-primary btn-floating mx-1 buttonSizing"
                >
                  <span v-show="!state">X</span>
                </button>
              </div>

              <!-- Name input -->
              <div v-show="!state" class="form-outline mb-4 mt-4">
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
                  @input="checkPass"
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

              <!-- Password repeat v-show signup -->
              <div v-show="!state" class="form-outline mb-3">
                <input
                  @keyup.enter="stateLS"
                  @input="checkPass"
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

              <div v-show="state" class="text-center text-lg-start mt-4 pt-2">
                <button
                  type="button"
                  @click="login()"
                  class="btn btn-primary btn-lg"
                  style="padding-left: 2.5rem; padding-right: 2.5rem"
                >
                  Ulogiraj se
                </button>
              </div>

              <div v-show="!state" class="text-center text-lg-start mt-4 pt-2">
                <button
                  type="button"
                  @click="signup()"
                  class="btn btn-primary btn-lg"
                  style="padding-left: 2.5rem; padding-right: 2.5rem"
                >
                  Registriraj se
                </button>
              </div>
            </form>
            <div v-show="errorState" class="alert alert-danger" role="alert">
              <b>
                <p>Greška: {{ errorMessage }}</p>
              </b>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="p-4 text-center border-top mobile-hidden"></div>
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
      errorMessage: "",
      errorState: false,
    };
  },
  methods: {
    checkPass() {
      if (!(this.password === this.passwordRepeat) && !this.state) {
        this.errorState = true;
        this.errorMessage = "Šifre se ne podudaraju";
      } else this.errorState = false;
    },
    stateLS() {
      if (this.state) return this.login();
      else return this.signup();
    },
    async login() {
      try {
        const result = await firebase
          .auth()
          .signInWithEmailAndPassword(this.username, this.password);
        console.log("Uspijeh! ", result);
      } catch (error) {
        this.errorState = true;
        this.errorMessage = error;
        console.error("Došlo je do greške: ", error);
      }
    },
    test() {
      db.collection("users").doc(this.username).set({
        name: this.name,
      });
    },
    async signup() {
      try {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(this.username, this.password);
        console.log("name: ", this.name, "\nusername: ", this.username);
        await db
          .collection("users")
          .doc(JSON.parse(JSON.stringify(this.username)))
          .set({
            name: this.name,
          });
      } catch (error) {
        this.errorState = true;
        this.errorMessage = error;
        console.error("Došlo je do greške: ", error);
      }
    },
    toggleLogin() {
      this.state = true;
      this.errorState = false;
    },
    toggleSignup() {
      this.state = false;
      this.errorState = false;
      this.checkPass();
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
