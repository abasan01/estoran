<template>
  <div class="col-6 col-sm-4 col-md-3 col-lg-2">
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
      <div class="card-body row">
        <div class="col-6 bg-primary" @click="addFood()">
          <p class="card-text">Dodaj</p>
        </div>
        <div class="col-6" @click="removeFood()">
          <p class="card-text col-6">Makni</p>
        </div>
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
    numberFood(foodName) {
      for (let i = store.currentOrder.length - 1; i >= 0; i--) {
        if (store.currentOrder[i].includes(foodName)) {
          if (store.currentOrder[i] === foodName) {
            store.currentOrder[i] += " x2";
            break;
          } else {
            let amount = parseInt(store.currentOrder[i].slice(-1));
            amount += 1;
            store.currentOrder[i] = store.currentOrder[i].slice(0, -1) + amount;
            break;
          }
        }
      }
    },
    popFood(foodName) {
      for (let i = store.currentOrder.length - 1; i >= 0; i--) {
        if (store.currentOrder[i].includes(foodName)) {
          if (store.currentOrder[i] === foodName) {
            store.currentOrder.splice(i, 1);
            break;
          } else {
            let amount = parseInt(store.currentOrder[i].slice(-1));
            amount -= 1;
            if (amount == 1) {
              store.currentOrder[i] = store.currentOrder[i].slice(0, -3);
              break;
            }
            store.currentOrder[i] = store.currentOrder[i].slice(0, -1) + amount;
            break;
          }
        }
      }
    },
    addFood() {
      if (
        store.currentOrder.some((element) => element.includes(this.info.name))
      ) {
        this.numberFood(this.info.name);
      } else {
        store.currentOrder.push(this.info.name);
      }
      store.totalTime += parseInt(this.info.time);
    },

    removeFood() {
      if (
        store.currentOrder.some((element) => element.includes(this.info.name))
      ) {
        this.popFood(this.info.name);
        store.totalTime -= parseInt(this.info.time);
      } else {
        alert("Ova hrana nije na vašoj narudžbi!");
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
