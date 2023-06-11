<template>
  <div class="background-container">
    <img src="@/assets/BG.png" class="background-image" />
    <img
      v-show="stol1Stanje"
      src="@/assets/Stol-1.png"
      class="pos-absolute stol-1"
      @click="tableClick(1)"
      style="cursor: pointer"
    />
    <img
      v-show="!stol1Stanje"
      src="@/assets/Stol-1-no.png"
      class="pos-absolute stol-1"
    />
    <img
      v-show="stol2Stanje"
      src="@/assets/Stol-2.png"
      class="pos-absolute stol-2"
      @click="tableClick(2)"
      style="cursor: pointer"
    />
    <img
      v-show="!stol2Stanje"
      src="@/assets/Stol-2-no.png"
      class="pos-absolute stol-2"
    />
    <img
      v-show="stol3Stanje"
      src="@/assets/Stol-3.png"
      class="pos-absolute stol-3"
      @click="tableClick(3)"
      style="cursor: pointer"
    />
    <img
      v-show="!stol3Stanje"
      src="@/assets/Stol-3-no.png"
      class="pos-absolute stol-3"
    />
    <img
      v-show="stol4Stanje"
      src="@/assets/Stol-4.png"
      class="pos-absolute stol-4"
      @click="tableClick(4)"
      style="cursor: pointer"
    />
    <img
      v-show="!stol4Stanje"
      src="@/assets/Stol-4-no.png"
      class="pos-absolute stol-4"
    />
  </div>
</template>

<script>
import { firebase, db } from "@/firebase.js";
import moment from "moment";

export default {
  name: "Stolovi",
  data: function () {
    return {
      stol1Stanje: true,
      stol2Stanje: true,
      stol3Stanje: true,
      stol4Stanje: true,
    };
  },
  mounted() {
    this.getTable();
  },
  methods: {
    getTable() {
      console.log(moment().add(5, "s").format("dddd, MMMM Do YYYY, h:mm:ss a"));
      let vrijeme = moment().add(5, "s");
      console.log(vrijeme);
      if (moment(vrijeme).isAfter()) {
        console.log("test");
      }
      db.collection("tables")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (moment(data.Trajanje).isBefore()) {
              console.log("vrijeme =", data.Trajanje);
              db.collection("tables").doc(doc.id).set({ Dostupan: true });
            }
            if (doc.id == "Stol1") {
              this.stol1Stanje = data.Dostupan;
            }
            if (doc.id == "Stol2") {
              this.stol2Stanje = data.Dostupan;
            }
            if (doc.id == "Stol3") {
              this.stol3Stanje = data.Dostupan;
            }
            if (doc.id == "Stol4") {
              this.stol4Stanje = data.Dostupan;
            }
          });
        })
        .catch((error) => {
          console.error("Greška: ", error);
        });
    },

    tableClick(brojStola) {
      console.log("Stol" + brojStola);
      db.collection("tables")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (doc.id == "Stol" + brojStola) {
              db.collection("tables")
                .doc(doc.id)
                .set({ Dostupan: false, Trajanje: moment.now() })
                .then(this.getTable());
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
  max-width: 80%;
  height: 100%;
  object-fit: cover;
}

.pos-absolute {
  position: absolute;
}

.stol-1 {
  top: 25vw;
  left: 26vw;
  width: 15vw;
}

.stol-2 {
  top: 7vw;
  left: 18vw;
  width: 14vw;
}

.stol-3 {
  top: 7vw;
  left: 50vw;
  width: 30vw;
}

.stol-4 {
  top: 25vw;
  left: 68vw;
  width: 13vw;
}
</style>
