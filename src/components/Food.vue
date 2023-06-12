<template>
  <div class="col-3" @click="orderFood()" style="cursor: pointer">
    <div class="card m-1">
      {{ info.name }}
      <img :src="info.url" class="card-img-top" alt="..." />

      <div class="card-body">
        <p class="card-text">
          Sastojci: {{ info.ingredients }}
          <br />
          Trajanje: {{ info.time }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";

export default {
  name: "Food",
  props: ["info"],

  methods: {
    orderFood() {
      store.totalTime += parseInt(this.info.time);
      console.log(store.totalTime);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
