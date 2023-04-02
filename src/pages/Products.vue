<template>
  <div class="row p-3">
    <Loading v-if="is_loading" />
    <div class="col-12">
      <div class="card">
        <h2 class="text-center m-2">Products</h2>
        <DataTable :value="products" :paginator="true" :rows="10">
          <Column field="name" header="Name"></Column>
          <Column field="price" header="Price"></Column>
          <Column field="product_type_name" header="Type"></Column>
          <Column header="Quantity">
            <template #body="slotProps">
              <InputNumber
                v-model="slotProps.data.quantity"
                showButtons
                buttonLayout="vertical"
                style="width: 4rem"
                decrementButtonClassName="p-button-secondary"
                incrementButtonClassName="p-button-secondary"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
              />
            </template>
          </Column>
          <Column header="">
            <template #body="slotProps">
              <Button
                icon="pi pi-plus"
                class="p-button-success"
                @click="addToSales(slotProps)"
              />
            </template>
          </Column>
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
// sweetalert2
import Swal from "sweetalert2";

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
  methods: {
    async addToSales(rowData) {
      const item = rowData.data;
      if (!item.hasOwnProperty("quantity")) {
        item.quantity = 0;
      }
      if (item.quantity <= 0) {
        Swal.fire({
          icon: "error",
          title: "Quantity must be greater than 0",
          showConfirmButton: false,
          timer: 750,
        });
        return;
      }
      this.$http
        .post("/sales/items", {
          sale_id: this.user_sale.id,
          product_id: item.id,
          quantity: item.quantity,
        })
        .then((response) => {});
      Swal.fire({
        icon: "success",
        title: "Item successfully added to cart",
        showConfirmButton: false,
        timer: 750,
      });
    },
  },
  data() {
    return {
      is_loading: false,
      user: {},
      user_sale: {},
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
      this.is_loading = true;
      await this.$http.get("/users/me").then((response) => {
        this.user = response.data;
      });
      // user sale
      await this.$http.get("/sales/user/" + this.user.id).then((response) => {
        this.user_sale = response.data[0];
      });
      await this.$http.get("/product-types").then((response) => {
        this.product_types = response.data;
      });
      await this.$http.get("/products").then((response) => {
        this.products = response.data.map((product) => {
          const product_type = this.product_types.find(
            (product_type) => product_type.id === product.product_type_id
          );
          const tax = product.price * (product_type.tax_rate / 100);
          product.price = Number(product.price) + tax;

          const formattedPrice = product.price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          product.price = formattedPrice;
          product.quantity = 0;
          return {
            ...product,
            product_type_name: product_type.name,
          };
        });
      });
      this.is_loading = false;
    };
    init();
  },
};
</script>

<style lang="scss" scoped></style>
