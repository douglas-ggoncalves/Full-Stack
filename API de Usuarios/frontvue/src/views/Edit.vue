<template>
  <div>
    <hr>
    <h1>Edição de Usuário</h1>
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

        <p>Cargo</p>
        <div class="select">
          <select v-model="role">
            <option value="0">Usuário comum</option>
            <option value="1">Administrador</option>
          </select>
        </div>

        <hr>
        <button class="button is-success" @click="update()">
          Editar
        </button>
        <div>
          <router-link :to="{name: 'Users'}">
            <button class="button is-info mt-3">
              Cancelar
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
      email: '',
      id: 0,
      role: 0, 
      error: undefined
    }
  },
  methods: {
    update(){
      var req = {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem("token")
        }
      }
      
      axios.put("http://localhost:8686/user", {
        name: this.name,
        email: this.email,
        role: this.role,
        id: this.id
        }, req).then(() => {
        this.$router.push({name: "Users"})
      }).catch(err => {
        this.error = err.response.data.err;
      })
    } 
  },
  created(){
    var req = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem("token")
      }
    }
    axios.get("http://localhost:8686/user/"+ this.$route.params.id, req).then(res => {
      this.name = res.data.name
      this.email = res.data.email
      this.id = res.data.id
      this.role = res.data.role
    }).catch(() => {
      this.$router.push({name: "Users"})
    })
  }
}
</script>

