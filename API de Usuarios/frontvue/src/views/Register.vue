<template>
  <div>
    <hr>
    <h2>Registro de Usuário</h2>
    <hr>
    <div class="columns is-centered">
      <div class="column is-half">
        <div v-if="error != undefined">
          <div class="notification is-danger">
            <p>{{ error }}</p>
          </div>
        </div>

        <p>Nome</p>
        <input type="text" placeholder="Nome do usuário" class="input" v-model="name"/>
        
        <p>Email</p>
        <input type="email" placeholder="Email do usuário" class="input" v-model="email"/>

        <p>Senha</p>
        <input type="password" placeholder="******" class="input" v-model="password"/>

        <p>Cargo</p>
        <div class="select">
          <select v-model="role">
            <option value="0" selected>Usuário comum</option>
            <option value="1">Administrador</option>
          </select>
        </div>

        <hr>
        <button class="button is-success" @click="register()">
          Cadastrar
        </button>
        <div>
          <router-link :to="{name: 'Login'}">
            <button class="button is-info mt-3">
              Login
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      name: '',
      password: '',
      email: '',
      role: 0,
      error: undefined
    }
  },
  methods: {
    register(){
      axios.post("http://localhost:8686/user", {
        name: this.name,
        password: this.password,
        email: this.email,
        role: this.role
      }).then(() => {
        this.$router.push({name: "Users"})
      }).catch(err => {
        this.error = err.response.data.err;
      })
    } 
  }
}
</script>