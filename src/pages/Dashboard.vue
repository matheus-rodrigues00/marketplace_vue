<template>
  <div class="row p-3">
    <div class="col-md-8">
      <div class="card">
        <h2 class="text-center m-2">Products</h2>
        <DataTable :value="products" :paginator="true" :rows="10">
          <Column field="name" header="Name"></Column>
          <Column field="price" header="Price"></Column>
          <Column field="product_type_name" header="Product Type"></Column>
        </DataTable>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card">
        <h2 class="text-center m-2">Product Types</h2>
        <DataTable
          :value="product_types"
          :rows="10"
          paginator
          paginatorTemplate="  PrevPageLink  NextPageLink "
        >
          <Column field="name" header="Name"></Column>
          <Column field="tax_rate" header="Tax Rate (%)"></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "primevue/card";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

export default {
  components: {
    Card,
    Button,
    Dropdown,
    InputText,
    InputNumber,
    DataTable,
    Column,
  },
  data() {
    return {
      products: [],
      product_types: [],
      newProduct: {
        name: "",
        type: null,
        price: 0,
      },
      paginatorTemplate:
        "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport",
    };
  },
  mounted() {
    const init = async () => {
      await this.$http.get("/product-types").then((response) => {
        this.product_types = response.data;
      });
      this.$http.get("/products").then((response) => {
        this.products = response.data.map((product) => {
          const product_type = this.product_types.find(
            (product_type) => product_type.id === product.product_type_id
          );
          const tax = product.price * (product_type.tax_rate / 100);
          product.price = Number(product.price) + tax;

          // format
          const formattedPrice = product.price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          product.price = formattedPrice;
          return {
            ...product,
            product_type_name: product_type.name,
          };
        });
      });
    };
    init();
  },
};
</script>

<style lang="scss" scoped></style>
