<template>
  <div class="row">
    <div class="col-8">
      <form @submit.prevent="postNewImage" class="form-inline mb-5">
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
import Food from "@/components/Food.vue";
import { db } from "@/firebase.js";
import store from "@/store";

export default {
  name: "HomeView",
  data: function () {
    return {
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
      db.collection("posts")
        .orderBy("postedat", "desc")
        .get()
        .then((query) => {
          this.cards = [];
          query.forEach((doc) => {
            console.log(doc.id);
            console.log(doc.data());

            const data = doc.data();

            this.cards.push({
              id: doc.id,
              url: data.url,
              time: data.postedat,
              description: data.desc,
            });
          });
        });
    },
    postNewImage() {
      console.log("OK");

      const imageUrl = this.newImageUrl;
      const imageDescription = this.newImageDescription;

      db.collection("posts")
        .add({
          url: imageUrl,
          desc: imageDescription,
          user: store.currentUser,
          postedat: Date.now(),
        })
        .then((doc) => {
          console.log("Spremljeno", doc);
          this.newImageDescription = "";
          this.newImageUrl = "";
          this.getPosts();
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
  components: {
    Food,
  },
};
</script>
