<template>
  <div class="row">
    <div class="col-8">
      <food v-for="card in cards" :key="card" :Image="card" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Food from "@/components/Food.vue";

let cards = [];

cards = [
  "https://picsum.photos/id/1/800",
  "https://picsum.photos/id/2/800",
  "https://picsum.photos/id/3/800",
];

export default {
  name: "HomeView",
  data: function () {
    return {
      cards: cards,
    };
  },
  components: {
    Food,
  },
};
</script>
