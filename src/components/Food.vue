<template>
  <div class="card p-0">
    {{ info.name }}
    <img :src="info.url" class="card-img-top" alt="..." />

    <div class="card-body">
      <p class="card-text">
        {{ info.ingredients }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Food",
  props: ["info"],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
