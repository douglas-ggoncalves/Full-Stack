<template>
  <div>
    <h2>Login</h2>
    <hr>
    <div class="columns is-centered">
      <div class="column is-half">
        <div v-if="error != undefined">
          <div class="notification is-danger">
            <p>{{ error }}</p>
          </div>
        </div>

        <p>Email</p>
        <input type="email" placeholder="Email do usuário" class="input" v-model="email"/>

        <p>Senha</p>
        <input type="password" placeholder="******" class="input" v-model="password"/>

        <hr>
        <button class="button is-success" @click="login()">
          Entrar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      password: '',
      email: '',
      error: undefined
    }
  },
  methods: {
    login(){
      axios.post("http://localhost:8686/login", {
        password: this.password,
        email: this.email
      }).then(res => {
        localStorage.setItem("token", res.data.token);
        this.$router.push({name: "Home"})
      }).catch(err => {
        this.error = err.response.data.err;
      })
    } 
  }
}
</script>

<style scoped>

</style>

