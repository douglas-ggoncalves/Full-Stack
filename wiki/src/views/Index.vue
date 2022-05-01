
<template>
  <div id="app" style="border: 1px solid red">
    <b-container fluid  style="border: 1px solid red">
      <b-row class="mt-2">
        <b-col sm="2">
          <b-button v-b-toggle.sidebar-variant>
            <i class="fa-solid fa-bars"></i>
          </b-button>
          
        </b-col>
      </b-row>
      <b-row class="mt-5">
        <b-col class="bg-light d-flex align-items-center" sm="10" vertical-align="center" right-align>
          <div>
            <h3 class="mt-3">
              Seja bem Vindo
              <font-awesome-icon icon="fa-solid fa-bars" />
            </h3>
            <h6 class="m-3">
              Esse Wiki é uma coleção de páginas interligadas e cada uma delas pode ser visitada por qualquer pessoa porém editada pelos
              funcionários do sistema Maximus, aqui você irá encontrar tutorias das funções do sistema
            </h6>
          </div>
        </b-col>
      </b-row>
    </b-container>

    <div>
      <b-sidebar id="sidebar-variant" bg-variant="dark" text-variant="light" backdrop shadow>
        <img class="img-fluid" src="../assets/img/logo-white.png" style="height: 90px; width: 180px">

        <hr>
        <div class="mt-1">
          <b-button variant="danger">Caixa</b-button>
        </div>
        
        <div class="mt-1">
          <b-button variant="primary">Balcão</b-button>
        </div>
        
        <div class="mt-1">
          <b-button variant="success">Administrativo</b-button>
        </div>
      </b-sidebar>
    </div>
  </div>
</template>

<script>

import '../assets/css/style.css'

export default {
  data(){
    return{
      
    }
  }
}
</script>
