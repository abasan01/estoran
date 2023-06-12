<template>
  <div class="row bg-secondary">
    <div>
      <form @submit.prevent="filterFoods" class="form-inline mb-5">
        <div class="form-group">
          <label for="imageUrl">Image URL</label>
          <input
            v-model="newImageUrl"
            type="text"
            class="form-control ml-2"
            placeholder="Enter the image URL"
            id="imageUrl"
          />
        </div>
        <label v-for="diet in diets" :key="diet.diets">
          <input type="radio" v-model="selectedDiet" :value="diet" />
          {{ diet }}
        </label>
        <p>Selected Option: {{ selectedDiet }}</p>
        <label v-for="allergy in allergies" :key="allergy.allergies">
          <input type="radio" v-model="selectedAllergy" :value="allergy" />
          {{ allergy }}
        </label>
        <p>Selected Option: {{ selectedAllergy }}</p>
        <div class="form-group">
          <label for="imageDescription">Description</label>
          <input
            v-model="newImageDescription"
            type="text"
            class="form-control ml-2"
            placeholder="Enter the image description"
            id="imageDescription"
          />
        </div>
        <button type="submit" class="btn btn-primary ml-2">Filtriraj</button>
      </form>
      <stolovi />
      <div class="row">
        <food v-for="card in cards" :key="card.id" :info="card" />
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

export default {
  name: "HomeView",
  data: function () {
    return {
      diets: [""],
      selectedDiet: "Ništa",
      filterSelect: [""],
      allergies: [""],
      selectedAllergy: "Ništa",
      cards: [],
      store,
      newImageDescription: "",
      newImageUrl: "",
    };
  },
  mounted() {
    this.getPosts();
    this.populateVariables();
    this.filterFoods();
  },
  methods: {
    populateVariables() {
      var dietsFilter = restrictions.diets.map((sviNazivi) => {
        return sviNazivi.naziv;
      });
      this.diets = dietsFilter;
      var allergiesFilter = restrictions.allergies.map((sviNazivi) => {
        return sviNazivi.naziv;
      });
      this.allergies = allergiesFilter;
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
        (diet) => diet.naziv === this.selectedDiet
      );
      console.log(nazivDijete);
      this.filterSelect = nazivDijete.kategorije;
      let kategorijeDijete = restrictions.categories
        .filter((category) => nazivDijete.kategorije.includes(category.naziv))
        .map((category) => category.sastojci)
        .flat();

      let nazivAlergije = restrictions.allergies.find(
        (allergy) => allergy.naziv === this.selectedAllergy
      );
      console.log(nazivAlergije);
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

      this.getPosts();
    },
  },
  components: {
    Food,
    Stolovi,
  },
};
</script>
