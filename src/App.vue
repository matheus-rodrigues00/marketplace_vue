<template>
  <header>
    <Menubar :model="menuItems" />
  </header>

  <RouterView />
</template>

<script>
import Menubar from "primevue/menubar";
import { RouterLink, RouterView } from "vue-router";
export default {
  components: {
    Menubar,
    RouterLink,
    RouterView,
  },
  mounted() {},
  data() {
    return {
      user: {},
      menuItems: [
        {
          label: "Dashboard",
          icon: "pi pi-fw pi-home",
          to: "/",
        },
        {
          label: "Products",
          icon: "pi pi-fw pi-list",
          to: "/products",
        },
        {
          label: "Product Types",
          icon: "pi pi-fw pi-tags",
          to: "/product-types",
        },
        {
          label: "Sales",
          icon: "pi pi-fw pi-shopping-cart",
          to: "/sales",
        },
        {
          label: "Login",
          icon: "pi pi-fw pi-sign-in",
          to: "/login",
        },
        {
          label: "Register",
          icon: "pi pi-fw pi-user-plus",
          to: "/register",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
