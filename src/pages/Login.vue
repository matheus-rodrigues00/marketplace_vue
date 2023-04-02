<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-6 w-100">
        <div class="card" style="width: 400px">
          <div class="card-header">{{ title }}</div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="email">{{ emailLabel }}</label>
                <input
                  type="email"
                  id="email"
                  v-model="email"
                  class="form-control"
                  required
                />
              </div>
              <div class="form-group mt-3">
                <label for="password">{{ passwordLabel }}</label>
                <input
                  type="password"
                  id="password"
                  v-model="password"
                  class="form-control"
                  required
                />
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-primary w-100 mt-3">
                  {{ submitLabel }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
export default {
  data() {
    return {
      email: "",
      password: "",
      title: "Login",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      submitLabel: "Login",
    };
  },
  methods: {
    handleSubmit() {
      this.$http
        .post("/users/login", {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          localStorage.setItem("token", response.data.token);

          Swal.fire({
            title: "Success",
            text: "You have successfully logged in",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            this.$router.push("/");
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
