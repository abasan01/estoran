<template>
  <div class="bg-secondary">
    <div class="p-4">
      <form @submit.prevent="postNewImage" class="mb-5 row">
        <div class="col-12 col-lg-5 offset-lg-1">
          <croppa
            class="m-2"
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
        </div>

        <div class="col-12 col-lg-5">
          <div class="form-group m-2">
            <label for="foodName">Naziv hrane: </label>
            <input
              v-model="newfoodName"
              type="text"
              class="form-control m-2"
              placeholder="Naziv hrane"
              id="foodName"
              :title="'Unesite naziv hrane'"
            />

            <div class="m-2">
              <label for="foodName">Sastojci hrane: </label>
              <multiselect
                v-model="selected"
                :options="options"
                :multiple="true"
                :placeholder="'Odaberite sastojke'"
                :title="'Unesite sastojke hrane'"
                :selectLabel="'Stisnite enter da dodate sastojak'"
                :selectedLabel="'Odabrano'"
                :deselectLabel="'Stisnite enter da maknete sastojak'"
              >
                <template v-slot:noResult>
                  <div class="no-results-message">Sastojak nije nađen</div>
                </template>
              </multiselect>
            </div>
            <label for="quantity">Trajanje:</label>
            <input
              class="m-2"
              v-model="newfoodTime"
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              max="45"
              :title="'Unesite trajanje između 1 minute i 45 minuta'"
            />
          </div>
          <div v-show="errorState" class="alert alert-danger" role="alert">
            <b>
              <p>Greška: {{ errorMessage }}</p>
            </b>
          </div>

          <button type="submit" class="btn btn-primary ml-2">Post image</button>
        </div>
      </form>

      <div class="row p-2">
        <FoodUpload v-for="card in cards" :key="card.id" :info="card" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Multiselect from "vue-multiselect";
import Croppa from "vue-croppa";
import FoodUpload from "@/components/FoodUpload.vue";
import { firebase, db, storage } from "@/firebase.js";
import store from "@/store";
import restrictions from "@/restrictions";

export default {
  components: { Multiselect },
  name: "Upload",
  data: function () {
    return {
      croppaImage: null,
      cards: [],
      store,
      newfoodTime: null,
      newfoodName: "",
      selected: null,
      options: [],
      errorMessage: "",
      errorState: false,
    };
  },
  mounted() {
    this.getPosts();
    this.getOptions();
  },
  methods: {
    getPosts() {
      db.collection("foods")
        .orderBy(firebase.firestore.FieldPath.documentId())
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
              time: data.time,
              ingredients: data.ingredients.join(", "),
            });
          });
        });
    },
    getOptions() {
      this.options = restrictions.categories
        .map((category) => category.sastojci)
        .flat();
    },
    async postNewImage() {
      if (this.selected == null) {
        this.errorMessage = "Unesite sastojke!";
        this.errorState = true;
        return;
      }
      console.log(this.croppaImage.hasImage());
      if (!this.croppaImage.hasImage()) {
        console.log("test");
        this.errorMessage = "Unesite sliku!";
        this.errorState = true;
        return;
      }
      if (this.newfoodTime == null) {
        this.errorMessage = "Unesite trajanje pripremanja hrane!";
        this.errorState = true;
        return;
      }
      if (this.newfoodName == "") {
        this.errorMessage = "Unesite naziv hrane!";
        this.errorState = true;
        return;
      }

      const foodName = this.newfoodName;
      const foodTime = this.newfoodTime;
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
                    time: foodTime,
                    url: url,
                  })
                  .then((result) => {
                    console.log("Uspijeh: ", result);
                    this.selected = null;
                    this.newfoodName = "";
                    this.newfoodTime = null;
                    this.croppaImage.remove();
                    this.getPosts();
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
    FoodUpload,
  },
};
</script>
