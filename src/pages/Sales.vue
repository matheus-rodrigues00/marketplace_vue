<template>
  <div class="row p-3">
    <div class="col-md-12">
      <div class="card">
        <h2 class="text-center m-2">Sales</h2>
        <DataTable
          :value="sales"
          :paginator="true"
          :rows="10"
          dataKey="id"
          @row-click="viewSale"
        >
          <Column field="id" header="ID"></Column>
          <Column field="created_at" header="Date"></Column>
          <Column field="total_price" header="Total Price"></Column>
          <Column field="items" header="Items"></Column>
        </DataTable>
      </div>
    </div>
    <Dialog
      v-model:visible="viewSaleDialogVisible"
      :header="'Sale ' + selectedSale.id"
      :closable="true"
      @hide="handleCloseDialog('viewSale')"
      :modal="true"
      :style="{ width: '80vw' }"
    >
      <div class="modal-content">
        <div class="card">
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
      </div> </Dialog
    >``
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
      sales: [],
      viewSaleDialogVisible: false,
      deleteSaleDialogVisible: false,
      editSaleDialogVisible: false,
      selectedSaleId: null,
      selectedSale: {},
    };
  },
  methods: {
    async decreaseQuantity(product) {
      const payload = {
        sale_item_id: product.sale_item_id,
        quantity: product.quantity - 1,
      };
      let sale_id;
      await this.$http.put("/sales/items", payload).then((response) => {
        sale_id = response.data.sale_id;
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
    },
    async increaseQuantity(product) {
      const payload = {
        sale_item_id: product.sale_item_id,
        quantity: product.quantity + 1,
      };
      let sale_id;
      await this.$http.put("/sales/items", payload).then((response) => {
        sale_id = response.data.sale_id;
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
    },
    async viewSale(event) {
      const sale_id = event.data.id;
      this.selectedSaleId = sale_id;
      await this.$http.get("/sales/" + sale_id).then((response) => {
        const selectedSale = response.data;
        selectedSale.subtotal =
          Number(selectedSale.total) - Number(selectedSale.total_tax);
        // format price
        const formattedPrice = selectedSale.subtotal.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
        selectedSale.subtotal = formattedPrice;

        this.selectedSale = selectedSale;
      });
      this.viewSaleDialogVisible = true;
    },
    deleteSale(saleId) {
      this.selectedSaleId = saleId;
      this.deleteSaleDialogVisible = true;
    },
    editSale(saleId) {
      this.selectedSaleId = saleId;
      this.editSaleDialogVisible = true;
    },
    handleCloseDialog(dialogName) {
      switch (dialogName) {
        case "viewSale":
          this.viewSaleDialogVisible = false;
          break;
        case "deleteSale":
          this.deleteSaleDialogVisible = false;
          break;
        case "editSale":
          this.editSaleDialogVisible = false;
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    const init = async () => {
      await this.$http.get("/sales").then((response) => {
        this.sales = response.data.map((sale) => {
          const date = new Date(sale.created_at);
          const formattedDate = date.toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });
          const formattedPrice = sale.total.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          });
          let count = 0;
          sale.sale_items.map((item) => {
            count += Number(item.quantity);
          });
          return {
            ...sale,
            created_at: formattedDate,
            total_price: formattedPrice,
            items: count,
          };
        });
      });
    };
    init();
  },
};
</script>

<style lang="scss" scoped></style>
