<template>
  <div>
    <h1>Painel ADM</h1>
    <hr>
    <div class="columns is-centered">
      <div class="columns is-centered is-12">
        <table class="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Cargo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <th>{{ user.name }}</th>
              <th>{{ user.email }}</th>
              <th>{{ user.role | processRole}}</th>
              <th>
                <button class="button is-success">Editar</button>
                <button class="button is-danger" @click="showModalUser(user.id)">Deletar</button>
              </th>
            </tr>
          </tbody>
        </table>   

        <div class="modal" :class="{'is-active': showModal}">
          <div class="modal-background"></div>
          <div class="modal-content">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  Você deseja excluir este usuário?
                </p>
              </header>
              <div class="card-content">
                <div class="content">
                  Essa ação é irreversível
                </div>
              </div>
              <footer class="card-footer">
                <a href="#" class="card-footer-item" @click="hideModal()">Cancelar</a>
                <a href="#" class="card-footer-item" @click="deleteUser()">Deletar Usuário</a>
              </footer>
            </div>
          </div>
          <button class="modal-close is-large" aria-label="close" @click="hideModal()"></button>
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data(){
    return{
      users: [],
      showModal: false,
      userId: 0
    }
  },
  methods:{
    hideModal(){
      this.showModal = false;
    }, 
    showModalUser(id){
      this.userId = id
      this.showModal = true;
    },
    deleteUser(){
      var req = {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem("token")
        }
      }
      
      axios.delete("http://localhost:8686/user/"+this.userId, req).then(res => {
        console.log(res)
        this.showModal = false;
        this.users = this.users.filter(user => user.id != this.userId);
      }).catch(err => {
        console.log(err)
      })
    }
  },

  created () {
    var req = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem("token")
      }
    }
    axios.get("http://localhost:8686/user", req).then(res => {
      this.users = res.data.users
    }).catch(err => {
      console.log(err)
    })
  }, filters: {
    processRole: function(value){
      if(value == 0){
        return 'Usuário comum'
      } else if(value == 1){
        return 'Admin'
      }
    }
  }
}
</script>