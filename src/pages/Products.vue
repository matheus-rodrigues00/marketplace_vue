<template>
  <div class="row p-3">
    <Loading v-if="is_loading" />
    <div class="col-12">
      <div class="card">
        <div class="d-flex w-100 justify-content-between">
          <h2 class="text-center m-2">Products</h2>
          <Button
            label="New Product"
            icon="pi pi-plus"
            class="p-button-rounded p-button-success m-2"
            @click="showNewProductDialog = true"
          ></Button>
        </div>

        <!-- dialog -->
        <Dialog
          v-model:visible="showNewProductDialog"
          :modal="true"
          :closable="false"
          :dismissableMask="true"
          :showHeader="false"
          :responsive="true"
          :style="{ width: '50vw' }"
        >
          <h2 class="text-center m-2">New Product</h2>
          <div class="card-body">
            <div class="row">
              <div class="col-12">
                <div class="p-fluid">
                  <div class="p-field">
                    <label for="name">Name</label>
                    <InputText
                      id="name"
                      v-model="newProduct.name"
                      :class="{
                        'p-invalid': submitted && !newProduct.name,
                      }"
                    />
                    <small v-if="submitted && !newProduct.name" class="p-error"
                      >Name is required.</small
                    >
                  </div>
                  <div class="p-field">
                    <label for="price">Price</label>
                    <InputNumber
                      id="price"
                      v-model="newProduct.price"
                      :class="{
                        'p-invalid': submitted && !newProduct.price,
                      }"
                      inputId="withoutgrouping"
                      :useGrouping="false"
                    />
                    <small v-if="submitted && !newProduct.price" class="p-error"
                      >Price is required.</small
                    >
                  </div>
                  <div class="p-field">
                    <label for="type">Type</label>
                    <Dropdown
                      id="type"
                      v-model="newProduct.product_type_id"
                      :options="product_types"
                      optionLabel="name"
                      optionValue="id"
                      :class="{
                        'p-invalid': submitted && !newProduct.product_type_id,
                      }"
                    />
                    <small
                      v-if="submitted && !newProduct.product_type_id"
                      class="p-error"
                      >Type is required.</small
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="p-fluid">
                <div class="p-field">
                  <Button
                    label="Save"
                    icon="pi pi-check"
                    class="p-button-rounded p-button-success m-2"
                    @click="saveProduct"
                  ></Button>
                  <Button
                    label="Cancel"
                    icon="pi pi-times"
                    class="p-button-rounded p-button-danger m-2"
                    @click="showNewProductDialog = false"
                  ></Button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>

        <DataTable
          :value="products"
          :paginator="true"
          :rows="10"
          stripedRows
          sortField="name"
        >
          <Column
            field="name"
            header="Name"
            sortable
            style="max-width: 200px"
          ></Column>
          <Column field="price" header="Price" sortable></Column>
          <Column field="product_type_name" header="Type" sortable></Column>
          <Column header="Quantity" style="max-width: 100px">
            <template #body="slotProps">
              <!-- style="width: 4rem" -->
              <InputNumber
                v-model="slotProps.data.quantity"
                showButtons
                buttonLayout="horizontal"
                style="max-width: 100px"
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
                size="large"
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
import Dialog from "primevue/dialog";
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
    Dialog,
  },
  methods: {
    getProducts() {
      this.$http.get("/products").then((response) => {
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
    },
    async saveProduct() {
      this.submitted = true;
      if (
        this.newProduct.name &&
        this.newProduct.price &&
        this.newProduct.product_type_id
      ) {
        await this.$http.post("/products", this.newProduct).then((response) => {
          this.showNewProductDialog = false;
          this.newProduct = {
            name: "",
            product_type_id: null,
            price: 0,
          };
          this.submitted = false;
        });

        Swal.fire({
          icon: "success",
          title: "Product successfully added",
          showConfirmButton: false,
          timer: 750,
        });

        await this.$http.get("/products").then((response) => {
          this.products = response.data;
        });
      }
      this.submitted = false;
    },
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
      showNewProductDialog: false,
      newProduct: {
        name: "",
        type: null,
        price: 0,
        product_type_id: null,
      },
      submitted: false,
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

<style lang="scss" scoped>
::v-deep .p-inputnumber-buttons-horizontal .p-inputnumber-input {
  width: 50px !important;
}
.p-inputnumber-buttons-horizontal .p-inputnumber-input {
  width: 50px !important;
}
</style>
