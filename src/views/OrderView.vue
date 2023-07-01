<template>
  <div class="bg-secondary">
    <div class="p-4">
      <order v-show="isAdmin == 2"></order>
      <div v-show="isAdmin == 1">
        <orderAdmin
          v-for="order in orders"
          :key="order.id"
          :adminOrder="order"
        ></orderAdmin>
        <div
          v-show="!emptyFlag"
          class="card text-white bg-primary mb-3 border-secondary"
        >
          <div class="card-header">
            <strong>Trenutačno nema narudžbi</strong>
          </div>
          <div class="card-body">
            <p class="card-text">Pričekajte da netko naruči</p>
          </div>
        </div>
        <p></p>
      </div>
    </div>
  </div>
</template>

<script>
import { firebase, db } from "@/firebase.js";
import store from "@/store";
import Order from "@/components/Order.vue";
import OrderAdmin from "@/components/OrderAdmin.vue";
import { eventBusAdmin } from "@/main";
import moment from "moment";

export default {
  name: "OrderView",
  data: function () {
    return {
      isAdmin: 0,
      orders: [],
      emptyFlag: 0,
    };
  },
  created() {
    eventBusAdmin.$on("checkUser", this.adminCheck);
  },
  mounted() {},
  methods: {
    adminCheck() {
      console.log("store.currentUser: ", store.currentUser);
      if (store.currentUser == "admin@gmail.com") {
        console.log("Izvodi se onaj if ludi");
        this.isAdmin = 1;
        this.orders = [];
        this.emptyFlag = 0;

        db.collection("tables")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const data = doc.data();

              this.orders.push({
                name: doc.id,
                tableTime: moment(data.Trajanje).format("k:mm:ss"),
                currentOrder: data.order,
                user: data.user,
                currentTable: doc.id.slice(-1),
              });

              if (data.order) {
                this.emptyFlag++;
              }
            });
          });
      } else this.isAdmin = 2;
    },
  },
  components: {
    Order,
    OrderAdmin,
  },
};
</script>

<style scoped></style>
