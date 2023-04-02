<template>
  <Loading v-if="is_loading" />
  <div class="row p-3">
    <div class="col-md-12">
      <div class="card">
        <h2 class="text-center m-2">Cart</h2>
        <div class="card-body">
          <DataTable
            :value="selectedSale.products"
            :paginator="true"
            :rows="10"
          >
            <Column field="product" header="Product"></Column>
            <Column field="unit_price" header="Price"></Column>
            <Column field="quantity" header="Quantity">
              <template #body="slotProps">
                <div class="d-flex justify-content-center align-items-center">
                  <Button
                    icon="pi pi-minus"
                    class="p-button-rounded p-button-secondary m-2"
                    style="width: 1.5rem; height: 1.5rem"
                    @click="decreaseQuantity(slotProps.data)"
                  ></Button>
                  <span>{{ slotProps.data.quantity }}</span>
                  <Button
                    icon="pi pi-plus"
                    class="p-button-rounded p-button-success m-2"
                    style="width: 1.5rem; height: 1.5rem"
                    @click="increaseQuantity(slotProps.data)"
                  ></Button>
                </div>
              </template>
            </Column>

            <Column field="total" header="Total"></Column>
          </DataTable>
        </div>
      </div>
      <div class="card mt-3">
        <div class="card-body">
          <div class="row">
            <p class="m-1"><b>Subtotal:</b> {{ selectedSale.subtotal }}</p>
            <p class="m-1"><b>Tax:</b> {{ selectedSale.total_tax }}</p>
            <p class="m-1"><b>Total:</b> {{ selectedSale.total }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "primevue/card";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";

export default {
  components: {
    DataTable,
    Column,
    Card,
    Button,
    Dialog,
  },
  data() {
    return {
      is_loading: false,
      sales: [],
      selectedSaleId: null,
      selectedSale: {},
      user: {},
    };
  },
  mounted() {
    const init = async () => {
      this.is_loading = true;
      await this.$http.get("/users/me").then((response) => {
        this.user = response.data;
      });
      await this.$http.get("/sales/user/" + this.user.id).then((response) => {
        this.selectedSale = response.data[0];
        this.selectedSale.subtotal =
          Number(this.selectedSale.total) - Number(this.selectedSale.total_tax);
        this.selectedSale.products = this.selectedSale.products.map(
          (product) => {
            product.total = product.total.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            });
            product.unit_price = product.unit_price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            });

            product.tax = product.tax.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            });
            return product;
          }
        );
      });
      this.is_loading = false;
    };
    init();
  },
  methods: {
    async decreaseQuantity(product) {
      this.is_loading = true;
      const payload = {
        sale_item_id: product.sale_item_id,
        quantity: product.quantity - 1,
      };
      let sale_id;
      await this.$http.put("/sales/items", payload).then((response) => {
        sale_id = response.data.id;
      });
      product.quantity -= 1;
      await this.$http.get("/sales/" + sale_id).then((response) => {
        const selectedSale = response.data;
        selectedSale.subtotal =
          Number(selectedSale.total) - Number(selectedSale.total_tax);
        const formattedPrice = selectedSale.subtotal.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
        selectedSale.subtotal = formattedPrice;

        this.selectedSale = selectedSale;
        this.$forceUpdate();
      });
      this.is_loading = false;
    },
    async increaseQuantity(product) {
      this.is_loading = true;
      const payload = {
        sale_item_id: product.sale_item_id,
        quantity: product.quantity + 1,
      };
      let sale_id;
      await this.$http.put("/sales/items", payload).then((response) => {
        sale_id = response.data.id;
      });

      product.quantity += 1;
      await this.$http.get("/sales/" + sale_id).then((response) => {
        const selectedSale = response.data;
        selectedSale.subtotal =
          Number(selectedSale.total) - Number(selectedSale.total_tax);
        const formattedPrice = selectedSale.subtotal.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
        selectedSale.subtotal = formattedPrice;
        this.selectedSale = selectedSale;
        this.$forceUpdate();
      });
      this.is_loading = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
