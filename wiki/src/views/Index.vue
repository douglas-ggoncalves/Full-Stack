
<template>
  <div id="app">
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

    <b-container class="bg-light" fluid>
      <b-row class="d-flex justify-content-left pt-2">
        <b-col cols="2">
          <b-button v-b-toggle.sidebar-variant>
            <i class="fa-solid fa-bars"></i>
          </b-button>
        </b-col>
      </b-row>
      
      <b-row class="d-flex justify-content-center mt-5">
        <b-col class="d-flex align-items-center" sm="10" vertical-align="center" right-align>
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

    <b-container fluid>
      <b-row class="d-flex justify-content-center mt-5">
        <h3>O que você procura?</h3>

        <b-col sm="6">
          <b-form-input  placeholder="Digite o que você está procurando" list="my-list-id"></b-form-input>

          <datalist id="my-list-id">
            <option>Manual Option</option>
            <option v-for="(size, index) in sizes" :key="index">{{ size }}</option>
          </datalist>
        </b-col>
      </b-row>

      <b-row class="d-flex justify-content-center mt-5">
        <b-col cols="12">
          <b-button-group>
            <b-button v-b-tooltip.hover.v-primary.left="'Tutoriais do módulo Balcão'" variant="outline-primary">Balcão</b-button>
            <b-button v-b-tooltip.hover.v-success.top="'Tutoriais do módulo Administrativo'" variant="outline-success">Administrativo</b-button>
            <b-button v-b-tooltip.hover.v-danger.right="'Tutoriais do módulo Caixa'" variant="outline-danger">Caixa</b-button>
          </b-button-group>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<script>

import '../assets/css/style.css'

export default {
  data() {
    return {
      sizes: ['Small', 'Medium', 'Large', 'Extra Large']
    }
  }
}
</script>
