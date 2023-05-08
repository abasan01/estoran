<template>
  <div>
    <div class="col-8">
      <div>
        <multiselect v-model="selected" :options="options" :multiple="true">
        </multiselect>
      </div>
      <form @submit.prevent="postNewImage" class="mb-5">
        <croppa
          v-model="croppaImage"
          :width="350"
          :height="350"
          placeholder="Choose an image"
          :placeholder-font-size="0"
          :disabled="false"
          :prevent-white-space="true"
          :show-remove-button="true"
        >
        </croppa>
        <div class="form-group">
          <label for="foodName">Naziv hrane: </label>
          <input
            v-model="newfoodName"
            type="text"
            class="form-control ml-2"
            placeholder="Enter the image URL"
            id="foodName"
          />
        </div>
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
        <button type="submit" class="btn btn-primary ml-2">Post image</button>
      </form>
      <food v-for="card in cards" :key="card.id" :info="card" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Multiselect from "vue-multiselect";
import Croppa from "vue-croppa";
import Food from "@/components/Food.vue";
import { db, storage } from "@/firebase.js";
import store from "@/store";

export default {
  components: { Multiselect },
  name: "Upload",
  data: function () {
    return {
      croppaImage: null,
      cards: [],
      store,
      newImageDescription: false,
      newfoodName: "",
      selected: null,
      options: ["riža", "jaja", "govedina"],
    };
  },
  mounted() {
    this.getPosts();
  },
  methods: {
    getPosts() {
      console.log("test");
      db.collection("foods")
        .get()
        .then((query) => {
          this.cards = [];
          query.forEach((doc) => {
            console.log(doc.id);
            console.log(doc.data());

            const data = doc.data();

            this.cards.push({
              name: doc.id,
              url: data.url,
              ingredients: data.ingredients.join(", "),
            });
          });
        });
    },
    async postNewImage() {
      const foodName = this.newfoodName;
      const imageDescription = this.newImageDescription;
      const imageName = "images/" + foodName + ".png";

      this.croppaImage.generateBlob((blob) => {
        storage
          .ref(imageName)
          .put(blob)
          .then((result) => {
            result.ref
              .getDownloadURL()
              .then((url) => {
                db.collection("foods")
                  .doc(foodName)
                  .set({
                    ingredients: this.selected,
                    url: url,
                  })
                  .then((result) => {
                    console.log("Uspijeh: ", result);
                  })
                  .catch((e) => {
                    console.error(e);
                  });
              })
              .catch((e) => {
                console.error(e);
              });
          })
          .catch((e) => {
            console.error(e);
          });
      });

      console.log(this.selected);
    },
  },
  components: {
    Food,
  },
};
</script>
