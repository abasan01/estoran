<template>
  <div class="card color-tertiary bg-primary m-1" v-if="adminOrder.user">
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
        <button type="button" class="btn btn-light m-1" @click="removeOrder()">
          Makni narudžbu
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { eventBusAdmin, eventBusTables } from "@/main";
import moment from "moment";

export default {
  data: function () {
    return {};
  },
  name: "OrderAdmin",
  props: ["adminOrder"],
  mounted() {
    db.collection("tables")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (moment(data.Trajanje).isBefore()) {
            db.collection("tables")
              .doc(doc.id)
              .set({ Dostupan: true, order: "", Trajanje: 0, user: "" });
          }
        });
      });
  },
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
