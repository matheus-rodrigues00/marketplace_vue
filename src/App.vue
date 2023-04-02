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
  mounted() {
    this.$http.get("/users/me").then((response) => {
      this.user = response.data;
    });
  },
  data() {
    return {
      user: {},
    };
  },
  computed: {
    menuItems() {
      // check the user
      if (this.user?.id) {
        return [
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
            label: "Cart",
            icon: "pi pi-fw pi-shopping-cart",
            to: "/sales",
          },
          {
            label: "Logout",
            icon: "pi pi-fw pi-sign-out",
            // to: "/logout",
            command: () => {
              this.$http.post("/logout").then((response) => {
                localStorage.removeItem("token");
                this.$router.push("/login");
                this.user = {};
              });
            },
          },
        ];
      } else {
        return [
          {
            label: "Dashboard",
            icon: "pi pi-fw pi-home",
            to: "/",
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
        ];
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
