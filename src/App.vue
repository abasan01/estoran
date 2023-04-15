<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/login">Login</router-link>
      {{ searchText }}
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      searchText: "Primjer",
    };
  },
};
</script>

<style lang="scss">
$primary: #900;
@import "../scss/custom.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
