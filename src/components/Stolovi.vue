<template>
  <div class="background-container">
    <img src="@/assets/BG.png" class="background-image" />
    <img
      v-show="stol1Stanje"
      src="@/assets/Stol-1.png"
      class="clickable pos-absolute stol-1"
      @click="tableClick(1)"
    />
    <p
      v-show="Boolean(this.stol1Trajanje)"
      class="pos-absolute stol-1"
      style="z-index: 999"
    >
      {{ stol1Trajanje }}
    </p>
    <img
      v-show="!stol1Stanje"
      src="@/assets/Stol-1-no.png"
      class="pos-absolute stol-1"
    />
    <img
      v-show="stol2Stanje"
      src="@/assets/Stol-2.png"
      class="clickable pos-absolute stol-2"
      @click="tableClick(2)"
    />
    <p
      v-show="Boolean(this.stol2Trajanje)"
      class="pos-absolute stol-2"
      style="z-index: 999"
    >
      {{ stol2Trajanje }}
    </p>
    <img
      v-show="!stol2Stanje"
      src="@/assets/Stol-2-no.png"
      class="pos-absolute stol-2"
    />
    <img
      v-show="stol3Stanje"
      src="@/assets/Stol-3.png"
      class="clickable pos-absolute stol-3"
      @click="tableClick(3)"
    />
    <p
      v-show="Boolean(this.stol3Trajanje)"
      class="pos-absolute stol-3"
      style="z-index: 999"
    >
      {{ stol3Trajanje }}
    </p>
    <img
      v-show="!stol3Stanje"
      src="@/assets/Stol-3-no.png"
      class="pos-absolute stol-3"
    />
    <img
      v-show="stol4Stanje"
      src="@/assets/Stol-4.png"
      class="clickable pos-absolute stol-4"
      @click="tableClick(4)"
    />
    <p
      v-show="Boolean(this.stol4Trajanje)"
      class="pos-absolute stol-4"
      style="z-index: 999"
    >
      {{ stol4Trajanje }}
    </p>
    <img
      v-show="!stol4Stanje"
      src="@/assets/Stol-4-no.png"
      class="pos-absolute stol-4"
    />

    <button @click="getTable()">Reload</button>

    <template>
      <div class="row justify-content-center">
        <button
          @click="ConfirmTable()"
          type="button"
          class="btn btn-primary btn-custom m-2"
        >
          Potvrdi stol i narudžbu
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import { firebase, db } from "@/firebase.js";
import moment from "moment";
import store from "@/store";
import { eventBusTables } from "@/main";
import router from "@/router";

moment.locale("hr");
moment.updateLocale("hr", {
  relativeTime: {
    s: (number) => number + " sekundi",
    ss: "%d sekundi",
    m: "jednu minutu",
  },
});

export default {
  name: "Stolovi",
  data: function () {
    return {
      stol1Stanje: true,
      stol2Stanje: true,
      stol3Stanje: true,
      stol4Stanje: true,
      stol1Trajanje: "",
      stol2Trajanje: "",
      stol3Trajanje: "",
      stol4Trajanje: "",
      lastClicked: 0,
    };
  },
  created() {
    eventBusTables.$on("getTables", this.getTable);
  },
  destroyed() {
    eventBusTables.$off("getTables", this.getTable);
  },
  mounted() {
    this.getTable();
  },
  methods: {
    ifsforGet(data, doc) {
      if (doc.id == "Stol1") {
        this.stol1Stanje = data.Dostupan;
        if (data.Trajanje) {
          this.stol1Trajanje = moment(data.Trajanje).fromNow();
        } else this.stol1Trajanje = "";
      }
      if (doc.id == "Stol2") {
        this.stol2Stanje = data.Dostupan;
        if (data.Trajanje) {
          this.stol2Trajanje = moment(data.Trajanje).fromNow();
        } else this.stol2Trajanje = "";
      }
      if (doc.id == "Stol3") {
        this.stol3Stanje = data.Dostupan;
        if (data.Trajanje) {
          this.stol3Trajanje = moment(data.Trajanje).fromNow();
        } else this.stol3Trajanje = "";
      }
      if (doc.id == "Stol4") {
        this.stol4Stanje = data.Dostupan;
        if (data.Trajanje) {
          this.stol4Trajanje = moment(data.Trajanje).fromNow();
        } else this.stol4Trajanje = "";
      }
    },
    async getTable() {
      try {
        const querySnapshot = await db.collection("tables").get();

        querySnapshot.forEach(async (doc) => {
          const data = doc.data();
          this.ifsforGet(data, doc);

          if (moment(data.Trajanje).isBefore()) {
            await db
              .collection("tables")
              .doc(doc.id)
              .set({ Dostupan: true, Trajanje: 0, user: "" });

            const QuerySnapshot2 = await db.collection("tables").get();

            QuerySnapshot2.forEach((Doc2) => {
              const Data2 = Doc2.data();
              this.ifsforGet(Data2, Doc2);
            });
          }
        });
      } catch (error) {
        console.error("Greška: ", error);
      }
    },
    ConfirmTable() {
      let usercount = 0;

      db.collection("tables")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data();

            if (moment(data.Trajanje).isBefore()) {
              db.collection("tables")
                .doc(doc.id)
                .set({ Dostupan: true, Trajanje: 0, user: "" });
            }
            if (data.user == store.currentUser) usercount++;

            console.log(usercount);
          });
        })
        .then(() => {
          if (usercount > 1) {
            alert("Već imate jedan stol zauzet!");
            return;
          }
          db.collection("tables")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                console.log("test");
                if (doc.id == "Stol" + this.lastClicked) {
                  db.collection("tables")
                    .doc(doc.id)
                    .set({
                      Dostupan: false,
                      Trajanje: moment().add(store.totalTime, "s").valueOf(),
                      user: store.currentUser,
                    })
                    .then(() => {
                      this.lastClicked = store.userTable;
                      eventBusTables.$emit("getTables");
                      router.push({ name: "order" });
                    });
                }
              });
            })
            .catch((error) => {
              console.error("Greška: ", error);
            });
        })
        .catch((error) => {
          console.error("Greška: ", error);
        });
    },
    tableClick(brojStola) {
      this.lastClicked = brojStola;
      this.getTable();
      db.collection("tables")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.id == "Stol" + brojStola) {
              db.collection("tables").doc(doc.id).set({
                Dostupan: false,
                Trajanje: 0,
                user: store.currentUser,
              });
            }
          });
        })
        .catch((error) => {
          console.error("Greška: ", error);
        });
    },
  },
};
</script>

<style scoped lang="scss">
.background-container {
  position: relative;
  width: 100%;
}

.background-image {
  position: relative;
  top: 0;
  left: 0;
  max-width: 70%;
  height: 100%;
  object-fit: cover;
}

.pos-absolute {
  position: absolute;
}

.stol-1 {
  top: 21vw;
  left: 30vw;
  width: 11vw;
}

.stol-2 {
  top: 5vw;
  left: 18vw;
  width: 12vw;
}

.stol-3 {
  top: 5vw;
  left: 41vw;
  width: 27vw;
}

.stol-4 {
  top: 22vw;
  left: 55vw;
  width: 14vw;
}
</style>
