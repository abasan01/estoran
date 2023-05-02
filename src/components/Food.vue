<template>
  <div class="card p-0">
    <img :src="info.url" class="card-img-top" alt="..." />
    <div class="card-body">
      <p class="card-text">
        {{ info.desc }}
      </p>
      {{ postedFromNow }}
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "Food",
  props: ["info"],
  computed: {
    postedFromNow() {
      return moment(this.info.time).fromNow();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
