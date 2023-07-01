<template>
  <div class="card" v-if="adminOrder.user">
    <div class="card-header">Narudžba korisnika: {{ adminOrder.user }}</div>
    <div class="card-body">
      <blockquote class="blockquote mb-0">
        <p>
          Naručio je:
          {{ adminOrder.currentOrder }}
        </p>
        <p>
          Stol:
          {{ adminOrder.currentTable }}
        </p>
        <footer class="blockquote-footer">
          Ima pravo na svoj stol do: {{ adminOrder.tableTime }}
        </footer>
      </blockquote>
      <div class="card-body row">
        <div class="bg-primary" @click="removeOrder()">
          <p class="card-text">Makni narudžbu</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { eventBusAdmin } from "@/main";

export default {
  data: function () {
    return {};
  },
  name: "OrderAdmin",
  props: ["adminOrder"],
  mounted() {},
  methods: {
    removeOrder() {
      console.log(this.adminOrder.name);
      db.collection("tables")
        .doc(this.adminOrder.name)
        .set({ Dostupan: true, Trajanje: 0, order: "", user: "" })
        .then(() => {
          eventBusAdmin.$emit("checkUser");
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
