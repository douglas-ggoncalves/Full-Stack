<template>
  <div>
    <hr>
    <h1>Painel ADM</h1>
    <hr>
    <div class="columns is-centered">
      <div class="columns is-centered is-12">
        <table class="table" style="width: 100%">
          <thead>
            <tr>
              <th>Nome</th>
              <th class="is-hidden-mobile">E-mail</th>
              <th>Cargo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <th>{{ user.name }}</th>
              <th class="is-hidden-mobile">{{ user.email }}</th>
              <th>{{ user.role | processRole}}</th>
              <th>
                <router-link :to="{name: 'UserEdit', params:{id: user.id}}"><button class="button is-success mr-1">Editar</button></router-link>
                <button class="button is-danger ml-1" @click="showModalUser(user.id)">Deletar</button>
              </th>
            </tr>
          </tbody>
        </table>   

        <div class="modal" :class="{'is-active': success}">
          <div class="modal-background"></div>
          <div class="modal-content">
            <div class="card">
              <div class="card-content">
                <div class="content">
                  {{ success }}
                </div>
              </div>
              <footer class="card-footer">
                <a href="#" class="card-footer-item" @click="success = undefined">Confirmar</a>
              </footer>
            </div>
          </div>
          <button class="modal-close is-large" aria-label="close" @click="success = undefined"></button>
        </div>
        
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
        
        <div class="modal" :class="{'is-active': error}">
          <div class="modal-background"></div>
          <div class="modal-content">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  Ocorreu um erro ao tentar excluir o usuário
                </p>
              </header>
              <div class="card-content">
                <div class="content">
                  {{ error }}
                </div>
              </div>
              <footer class="card-footer">
                <a href="#" class="card-footer-item" @click="error = undefined">Confirmar</a>
              </footer>
            </div>
          </div>
          <button class="modal-close is-large" aria-label="close" @click="error = undefined"></button>
        </div>

        <div class="modal" :class="{'is-active': dangerError}">
          <div class="modal-background"></div>
          <div class="modal-content">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  Ocorreu um erro grave
                </p>
              </header>
              <div class="card-content">
                <div class="content">
                  {{ dangerError }}
                </div>
              </div>
              <footer class="card-footer">
                <a href="/" class="card-footer-item" @click="error = undefined">Voltar a tela inicial</a>
              </footer>
            </div>
          </div>
        </div>
      </div> 
    </div>

    <div class="columns is-centered">
      <div class="columns is-centered is-12">
        <router-link :to="{name: 'register'}"><button class="button is-info">Novo Usuário</button></router-link>
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
      userId: 0,
      success: undefined,
      error: undefined,
      dangerError: false
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
        this.showModal = false;
        this.success = res.data
        this.users = this.users.filter(user => user.id != this.userId);
      }).catch(err => {
        this.showModal = false
        this.error = err.response.data 
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
      this.dangerError = err.response.data
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