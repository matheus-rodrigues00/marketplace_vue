<template>
  <Loading v-if="is_loading" />
  <div class="col-12">
    <div class="card">
      <div class="d-flex w-100 justify-content-between">
        <h2 class="text-center m-2">Product Types</h2>
        <!-- button to create new product type -->
        <Button
          label="New Product Type"
          icon="pi pi-plus"
          class="p-button-rounded p-button-success m-2"
          @click="showNewProductTypeDialog = true"
        ></Button>
      </div>

      <!-- dialog -->
      <Dialog
        v-model:visible="showNewProductTypeDialog"
        :modal="true"
        :closable="false"
        :dismissableMask="true"
        :showHeader="false"
        :responsive="true"
        :style="{ width: '50vw' }"
      >
        <h2 class="text-center m-2">New Product Type</h2>
        <div class="card-body">
          <div class="row">
            <div class="col-12">
              <div class="p-fluid">
                <div class="p-field">
                  <label for="name">Name</label>
                  <InputText
                    id="name"
                    v-model="newProductType.name"
                    :class="{
                      'p-invalid': submitted && !newProductType.name,
                    }"
                  />
                  <small
                    v-if="submitted && !newProductType.name"
                    class="p-error"
                    >Name is required.</small
                  >
                </div>
                <div class="p-field">
                  <label for="tax_rate">Tax Rate (%)</label>
                  <InputNumber
                    id="tax_rate"
                    v-model="newProductType.tax_rate"
                    :class="{
                      'p-invalid': submitted && !newProductType.tax_rate,
                    }"
                    :max="100"
                  />
                  <small
                    v-if="submitted && !newProductType.tax_rate"
                    class="p-error"
                    >Tax Rate is required.</small
                  >
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
                      @click="saveProductType"
                    ></Button>
                    <Button
                      label="Cancel"
                      icon="pi pi-times"
                      class="p-button-rounded p-button-danger m-2"
                      @click="showNewProductTypeDialog = false"
                    ></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      <DataTable
        :value="product_types"
        :rows="10"
        paginator
        paginatorTemplate="PrevPageLink  NextPageLink"
        sortField="name"
      >
        <Column field="name" header="Name" sortable></Column>
        <Column field="tax_rate" header="Tax Rate (%)" sortable></Column>
      </DataTable>
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
  data() {
    return {
      showNewProductTypeDialog: false,
      newProductType: {
        name: "",
        tax_rate: 0,
      },
      submitted: false,
      is_loading: false,
      user: {},
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
  methods: {
    async getProductTypes() {
      await this.$http.get("/product-types").then((response) => {
        this.product_types = response.data;
      });
    },
    async saveProductType() {
      this.submitted = true;
      if (this.newProductType.name && this.newProductType.tax_rate) {
        await this.$http
          .post("/product-types", this.newProductType)
          .then((response) => {
            this.showNewProductTypeDialog = false;
            this.newProductType = {
              name: "",
              tax_rate: 0,
            };
            this.submitted = false;
          })
          .catch((error) => {
            console.log(error);
          });

        await this.getProductTypes();
      }
    },
  },
  mounted() {
    const init = async () => {
      this.is_loading = true;
      try {
        await this.$http.get("/users/me").then((response) => {
          this.user = response.data;
          console.log(this.user);
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
            return {
              ...product,
              product_type_name: product_type.name,
            };
          });
        });
      } catch (error) {
        console.log(error);
      }

      this.is_loading = false;
    };
    init();
  },
};
</script>

<style lang="scss" scoped></style>
