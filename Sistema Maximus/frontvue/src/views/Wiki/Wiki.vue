
<template>
  <div id="app" >
    <div id="wiki" class="wrapper">
      <nav id="sidebar">
        <ul class="list-unstyled components">
          <div class="sidebar-header">
            <img class="img-fluid" src="../../assets/img/logo-white.png">
            <hr>
          </div>

          <li>
              <a href="acessos">Acessos</a>
          </li>
        
          <li>
            <a href="tarefas">Checagem Fecha Mês</a>
          </li>

          <li>
            <a href="napp">Checagem Napp</a>
          </li>

          <li>
            <a href="dashboard">Dashboard</a>
          </li>

          <li>
            <a href="usuarios">Gestão de Usuários</a>
          </li>

          <li>
            <a href="implantacoes">Implantações</a>
          </li>

          <li>
            <a href="replicacoes">Replicação</a>
          </li>

          <li>
            <a href="#">Wiki</a>
          </li>

          <li>
            <a href="javascript:;" @click="logout()">Sair</a>
          </li>
        </ul>
      </nav>

      <div id="content">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="container-fluid">
            <button type="button" id="sidebarCollapse" class="btn btn-outline-dark" @click="clique()">
              <span class="navbar-toggler-icon"></span>
            </button>
          </div>
        </nav>

        <b-container class="bg-light py-3" fluid>
          <b-row class="d-flex justify-content-center">
            <b-col class="d-flex align-items-center" sm="10" vertical-align="center">
              <div>
                <h3 class="mt-3">
                  Seja bem Vindo
                </h3>
                <h6 class="m-3">
                  Esse Wiki é uma coleção de páginas interligadas e cada uma delas pode ser visitada por qualquer pessoa porém editada pelos
                  funcionários do sistema Maximus, aqui você irá encontrar tutoriais das funções do sistema
                </h6>
                <a href="cadastrar-postagem"  v-if="roleUserLogged == 'M'">
                  <b-button>
                    Cadastrar Post
                  </b-button>
                </a>
              </div>
            </b-col>
          </b-row>
        </b-container>

        <b-container fluid>
          <b-row class="d-flex justify-content-center mt-3" style="">
            <h3>O que você procura?</h3>
            <b-col sm="6" style="">
              <b-form-input type="search" v-model="value" placeholder="Digite o que você está procurando" ></b-form-input>

              <div id="elements">
                <div v-for="post in searchPost" :key="post.ID_POST">
                  <div  v-if="post.ATIVO == 1 && roleUserLogged != 'M'">
                    <div :class="{'green': post.CODMODULO == 2, 'blue': post.CODMODULO == 3, 'red': post.CODMODULO == 4}">
                      <a :href="post.SLUG">{{ post.TITULO }}</a>
                    </div>
                  </div>
                  
                  <div v-else-if="roleUserLogged == 'M'">
                    <div :class="{'green': post.CODMODULO == 2, 'blue': post.CODMODULO == 3, 'red': post.CODMODULO == 4}">
                      <a :href="post.SLUG">{{ post.TITULO }} <span v-if="post.ATIVO == 0">( Esse post está inativo / Não aparece para usuário comum )</span></a>
                    </div>
                  </div>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
import '../../assets/style/style.css'
import scrypt from "../../assets/js/scrypt";

import axios from "axios";

export default {
  data() {
    return {
      sizes: ['Small', 'Medium', 'Large', 'Extra Large'],
      roleUserLogged: '',
      serverIP: '',
      allPosts: [],
      value: ''
    }
  },
  created(){
    this.serverIP = scrypt.serverIP
    this.roleUserLogged = localStorage.getItem("roleUser")
    
    if(this.roleUserLogged == "R"){
      alert("Você não possui permissão para acessar esta página.\n\nVocê será direcionado para a página inicial.");
      this.$router.push({name: "Index"})
    }

    if(this.roleUserLogged != "N"){
      this.myFunction();
    } else{
      alert("Você não possui permissão para acessar esta página.\n\nVocê será direcionado para a página inicial.");
      this.$router.push({name: "Index"})
    }
  },
  methods: {
    clique() {
      scrypt.clique(this);
    }, 
    async myFunction(){
      await axios.get(`${this.serverIP}/posts`,)
      .then(res => {
        this.allPosts = res.data.arrayPosts
      })
      .catch(err => {
        this.err = err.response.data.err
      })
    },
    logout(){
      if(confirm("Deseja sair?")){
        localStorage.removeItem("token")
        localStorage.removeItem("roleUser")
        localStorage.removeItem("redeIdUser")
        localStorage.removeItem("loginUser")
        this.$router.push({name: "Home"})
      }
    }
  },
  computed: {
    searchPost: function(){
      if(this.value.trim() == ''){
        return this.allPosts;
      } else{
        return this.allPosts.filter(post => 
          post.TITULO.toLowerCase().match(this.value.toLowerCase())
        );
      }
    }
  }
}
</script>
