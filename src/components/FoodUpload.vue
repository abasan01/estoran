<template>
  <div class="col-6 col-md-3 col-lg-2">
    <div class="card color-tertiary bg-primary m-1">
      {{ info.name }}
      <img :src="info.url" class="card-img-top" alt="..." />

      <div class="card-body">
        <p class="card-text">
          Sastojci: {{ info.ingredients }}
          <br />
          Trajanje: {{ info.time }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FoodUpload",
  props: ["info"],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
