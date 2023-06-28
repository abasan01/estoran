<template>
  <div class="card">
    <div class="card-header">Vaša narudžba</div>
    <div class="card-body">
      <blockquote class="blockquote mb-0">
        <p>
          Naručili ste:
          {{ orderValues }}
        </p>
        <p>
          Vaš stol:
          {{ currentTable }}
        </p>
        <footer class="blockquote-footer">{{ orderValues }}</footer>
      </blockquote>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import restrictions from "@/restrictions";
import { eventBusDiet } from "@/main";

export default {
  data: function () {
    return {
      currentTable: store.userTable,
    };
  },
  name: "Order",
  props: ["orderValues"],
  mounted() {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
