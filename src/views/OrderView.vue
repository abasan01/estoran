<template>
  <div class="">{{ formattedOrder }}</div>
</template>

<script>
import { firebase, db } from "@/firebase.js";
import store from "@/store";

export default {
  name: "OrderView",
  data: function () {
    return {
      formattedOrder: [],
    };
  },
  mounted() {
    this.populateVariables();
  },
  methods: {
    populateVariables() {
      this.formattedOrder = store.currentOrder.join(", ");
      console.log(store.currentOrder);
    },
  },
};
</script>

<style scoped></style>
