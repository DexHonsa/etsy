<template>
  <div id="app">
    <router-view name="header" />
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "app",
  mounted() {
    if (this.user.id == null) {
      this.$router.push("/");
    }
  },
  computed: {
    user() {
      return JSON.parse(JSON.stringify(this.$store.state.userStore.user));
    }
  },
  watch: {
    user(val) {
      if (val == {}) {
        this.$router.push("/");
      }
    }
  }
};
</script>


<style>
html,
body {
  margin: 0;
  padding: 0;
}
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
