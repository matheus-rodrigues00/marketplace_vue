<template>
  <h1>Products</h1>
</template>

<script>
export default {
  mounted() {
    this.$http.get("/products").then((response) => {
      console.log(response);
    });
  },
};
</script>

<style lang="scss" scoped></style>
