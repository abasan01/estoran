<template>
  <div class="card p-0">
    <img :src="Image" class="card-img-top" alt="..." />
    <div class="card-body">
      <p class="card-text">
        Some quick example text to build on the card title and make up the bulk
        of the card's content.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Food",
  props: ["Image"],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
