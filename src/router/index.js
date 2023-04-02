import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../pages/Dashboard.vue";
import ProductTypes from "../pages/ProductTypes.vue";
import Products from "../pages/Products.vue";
import Sales from "../pages/Sales.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: Dashboard,
    },
    {
      path: "/product-types",
      name: "product-types",
      component: ProductTypes,
    },
    {
      path: "/products",
      name: "products",
      component: Products,
    },
    {
      path: "/sales",
      name: "sales",
      component: Sales,
    },
  ],
});

export default router;
