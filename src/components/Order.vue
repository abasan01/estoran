<template>
  <div class="card color-tertiary bg-primary m-1">
    <div class="card-header">Vaša narudžba</div>
    <div class="card-body">
      <blockquote class="blockquote mb-0">
        <p>
          Naručili ste:
          {{ currentOrder }}
        </p>
        <p>
          Vaš stol:
          {{ currentTable }}
        </p>
        <footer class="blockquote-footer">
          Imate pravo na vaš stol do: {{ tableTime }}
        </footer>

        <button type="button" class="btn btn-light m-1" @click="goToHome()">
          Vratite se na home ukoliko vam je istekao stol
        </button>
      </blockquote>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import { db } from "@/firebase";
import moment from "moment";
import VueRouter from "vue-router";

export default {
  data: function () {
    return {
      currentTable: 0,
      tableTime: "",
      currentOrder: "",
    };
  },
  name: "Order",
  props: ["orderValues"],
  mounted() {
    db.collection("tables")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.user == store.currentUser) {
            this.tableTime = moment(data.Trajanje).format("k:mm:ss");
            this.currentTable = doc.id.slice(-1);
            this.currentOrder = data.order;
          }
        });
      });
  },
  methods: {
    goToHome() {
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
