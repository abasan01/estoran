<template>
  <order :order-values="formattedOrder"></order>
</template>

<script>
import { firebase, db } from "@/firebase.js";
import store from "@/store";
import Order from "@/components/Order.vue";

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
  components: {
    Order,
  },
};
</script>

<style scoped></style>
