<template>
  <div class="row">
    <div class="col-8">
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
      <food v-for="card in cards" :key="card.id" :info="card" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Food from "@/components/Food.vue";
import { firebase, db } from "@/firebase.js";
import store from "@/store";
import restrictions from "@/restrictions.js";

export default {
  name: "HomeView",
  data: function () {
    return {
      diets: ["Vegan", "Vegetarijanac", "Košer", "Ništa"],
      selectedDiet: null,
      filterSelect: [""],
      cards: [],
      store,
      newImageDescription: "",
      newImageUrl: "",
    };
  },
  mounted() {
    this.getPosts();
  },
  methods: {
    getPosts() {
      console.log("this.filterSelect prije get = ", this.filterSelect);

      db.collection("foods")
        .where("ingredients", "array-contains-any", this.filterSelect)
        .get()
        .then((query) => {
          const includedDocs = query.docs;

          db.collection("foods")
            .orderBy("ingredients")
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
                  ingredients: data.ingredients.join(", "),
                };
              });
            });
        });
    },
    filterFoods() {
      let pom = restrictions.diets.find(
        (diet) => diet.naziv === this.selectedDiet
      );
      this.filterSelect = pom.kategorije;
      let pom2 = restrictions.categories
        .filter((category) => pom.kategorije.includes(category.naziv))
        .map((category) => category.sastojci)
        .flat();
      this.filterSelect = this.filterSelect.concat(pom2);
      this.getPosts();
    },
  },
  components: {
    Food,
  },
};
</script>
