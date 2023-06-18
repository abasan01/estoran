<template>
  <div class="row bg-secondary">
    <div class="col-1">
      <img
        v-show="pageOrder > 0"
        @click="subtractFn()"
        class="clickable"
        src="@/assets/arrow.png"
        style="width: 90px"
      />
    </div>
    <div class="col-1 offset-10">
      <img
        v-show="pageOrder < 3"
        @click="addFn()"
        src="@/assets/arrow.png"
        class="clickable img-flip"
        style="width: 90px"
      />
    </div>
    <div class="container">
      <div v-show="pageOrder == 0">
        <ButtonDiets
          v-for="dietInFor in diets"
          :key="dietInFor"
          :value="dietInFor"
        />
        <p>Selected Option: {{ store.selectedDiet }}</p>
      </div>

      <div v-show="pageOrder == 1">
        <ButtonAllergies
          v-for="allergyInFor in allergies"
          :key="allergyInFor"
          :value="allergyInFor"
        />
        <p>Selected Option: {{ store.selectedAllergy }}</p>
      </div>

      <div class="row" v-show="pageOrder == 2" @click="updateOrder()">
        <food v-for="card in cards" :key="card.id" :info="card" />
      </div>
      <div v-show="store.totalTime" class="order-menu bg-primary">
        <p>
          Ukupno Trajanje pripreme vaše narudžbe: <br />{{ store.totalTime }}
        </p>
        <p>Vaša narudžba: <br />{{ formattedOrder }}</p>
      </div>

      <div v-show="pageOrder == 3">
        <stolovi />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Food from "@/components/Food.vue";
import Stolovi from "@/components/Stolovi.vue";
import { firebase, db } from "@/firebase.js";
import store from "@/store";
import restrictions from "@/restrictions.js";
import ButtonDiets from "@/components/Button-diets.vue";
import ButtonAllergies from "@/components/Button-allergies.vue";
import { eventBusTables } from "@/main";

export default {
  name: "HomeView",
  data: function () {
    return {
      filterSelect: [""],
      cards: [],
      store,
      newImageDescription: "",
      newImageUrl: "",
      pageOrder: 0,
      allergies: null,
      diets: null,
      formattedOrder: [],
    };
  },
  mounted() {
    this.populateAllergies();
    this.populateDiets();
  },
  methods: {
    updateOrder() {
      this.formattedOrder = store.currentOrder.join(", ");
    },
    populateDiets() {
      var dietsFilter = restrictions.diets.map((sviNazivi) => {
        return sviNazivi.naziv;
      });
      this.diets = dietsFilter;
      return this.diets;
    },
    populateAllergies() {
      var allergiesFilter = restrictions.allergies.map((sviNazivi) => {
        return sviNazivi.naziv;
      });
      this.allergies = allergiesFilter;
      return this.allergies;
    },
    addFn() {
      this.pageOrder = this.pageOrder + 1;
      if (this.pageOrder == 2) this.filterFoods();
      if (this.pageOrder == 2) this.getPosts();
      if (this.pageOrder == 3) eventBusTables.$emit("getTables");
    },
    subtractFn() {
      this.pageOrder = this.pageOrder - 1;
    },
    getPosts() {
      db.collection("foods")
        .where("ingredients", "array-contains-any", this.filterSelect)
        .get()
        .then((query) => {
          const includedDocs = query.docs;

          db.collection("foods")
            .orderBy(firebase.firestore.FieldPath.documentId())
            .get()
            .then((queryAll) => {
              const allDocs = queryAll.docs;

              const filteredDocs = allDocs.filter((doc) => {
                return !includedDocs.some(
                  (includedDoc) => includedDoc.id === doc.id
                );
              });

              this.filterSelect = [""];

              this.cards = filteredDocs.map((doc) => {
                const data = doc.data();
                return {
                  name: doc.id,
                  url: data.url,
                  time: data.time,
                  ingredients: data.ingredients.join(", "),
                };
              });
            });
        });
    },
    capitalizeString(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    filterFoods() {
      let nazivDijete = restrictions.diets.find(
        (diet) => diet.naziv === this.store.selectedDiet
      );
      this.filterSelect = nazivDijete.kategorije;
      let kategorijeDijete = restrictions.categories
        .filter((category) => nazivDijete.kategorije.includes(category.naziv))
        .map((category) => category.sastojci)
        .flat();

      let nazivAlergije = restrictions.allergies.find(
        (allergy) => allergy.naziv === this.store.selectedAllergy
      );
      this.filterSelect = nazivAlergije.kategorije;
      let kategorijeAlergije = restrictions.categories
        .filter((category) => nazivAlergije.kategorije.includes(category.naziv))
        .map((category) => category.sastojci)
        .flat();

      this.filterSelect = this.filterSelect.concat(kategorijeDijete);
      this.filterSelect = this.filterSelect.concat(kategorijeAlergije);

      this.filterSelect = this.filterSelect.map((string) =>
        this.capitalizeString(string)
      );
    },
  },
  components: {
    Food,
    Stolovi,
    ButtonDiets,
    ButtonAllergies,
  },
};
</script>
