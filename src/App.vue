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
  data() {
    return {
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
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
