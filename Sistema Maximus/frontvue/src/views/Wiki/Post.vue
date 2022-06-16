
<template>
  <div class="home" id="divMainReplic">
    <div class="wrapper">
      <nav id="sidebar">
        <ul class="list-unstyled components">
          <div class="sidebar-header">
            <img class="img-fluid" src="../../assets/img/logo-white.png">
            <hr>
          </div>

          <li v-if="roleUserLogged == 'M' || roleUserLogged == 'A'">
            <a href="usuarios">Gestão de Usuários</a>
          </li>

          <li>
            <a href="replicacoes">Replicação</a>
          </li>

          <li>
            <a href="wiki">Wiki</a>
          </li>
          
          <li>
            <a href="javascript:;" @click="logout()">Sair</a>
          </li>
        </ul>
      </nav>

      <div class="container-fluid" id="content">
        <nav class="navbar navbar-expand-lg navbar-light">
          <div class="container-fluid">
            <button type="button" id="sidebarCollapse" class="btn btn-outline-dark" @click="clique()">
              <span class="navbar-toggler-icon"></span>
            </button>
          </div>
        </nav>

        <div class="container" v-if="!editMode">
          <div class="row d-flex justify-content-center my-3">
            <h2>{{ title }}</h2>
            <hr style="width: 50%">
          </div>
          
          <div class="row">
              <div class="ql-editor">
                <span v-html="desc">

                </span>
              </div>

              <div>
                <b-button variant="outline-secondary" @click="editMode=true" v-if="roleUserLogged == 'M'">Editar</b-button>
              </div>
          </div>
        </div>

        <div class="container" v-if="editMode">
          <div class="row d-flex justify-content-center mt-3 mb-5">
            <h2>Edição de postagem</h2>
            <hr style="width: 50%">
          </div>

          <div class="row d-flex justify-content-center mt-3">
            <div class="col-12">
              <input id="inputTitle" type="text" class="form-control" v-model="title" placeholder="Informe o título do post" @keydown="clearErrTitle()">
              <div class="invalid-feedback" v-if="errTitle">
                {{ errTitle }}
              </div>
            </div>
          </div>

          <div class="row d-flex justify-content-center mt-3">
            <div class="col-12">
              <vue-editor v-model="desc" />

              <div id="divErrDesc" style="margin-top: 0.25rem; font-size: 0.875em; color: #dc3545;" v-if="errDesc">
                {{ errDesc }}
              </div>
            </div>
          </div>

          <div class="row d-flex justify-content-center mt-3">
            <div class="col-12 col-md-10 col-lg-6">
              <multiselect v-model="moduleSelect" :preselect-first="true" deselect-label="Remover opção" selectLabel="Selecionar essa opção" selectedLabel="Opção selecionada" 
              placeholder="Selecionar módulo" :options="modules" :searchable="false" :allow-empty="true"
              label="DESC_MODULE" track-by="DESC_MODULE" :taggable="true" @tag="addTag">
                {{ modules }}
              </multiselect>

              <div style="height: 1rem">

              </div>

              <multiselect v-model="arrayOptionSelect" deselect-label="Remover opção" selectLabel="Selecionar essa opção" selectedLabel="Opção selecionada" 
              placeholder="Selecionar opção" :options="array" :searchable="false" :allow-empty="true"
              label="DESC" track-by="ID">
                {{ array }}
              </multiselect>
            </div>
          </div>

          <div class="row d-flex justify-content-center mt-3">
            <div class="col-6">
              <b-button-group>
                <b-button v-b-tooltip.hover.v-secondary.top="'Selecione essa opção para gravar as alterações'" variant="outline-secondary" @click="updatePost()">
                  <i class="fa-solid fa-floppy-disk"></i>
                  Salvar
                </b-button>

                <b-button v-b-tooltip.hover.v-danger.top="'Apagar postagem'" variant="outline-danger" @click="deletePost()">Apagar</b-button>

                <b-button v-b-tooltip.hover.v-secondary.top="'Voltar para a postagem'" variant="outline-secondary" @click="editMode=false">Voltar</b-button>
              </b-button-group>
            </div>
          </div>

          <div class="vm--overlay" style="z-index: 9999" @click="closeToastSuccess()" v-if="success != ''">
            <div class="position-fixed top-50 start-50 translate-middle p-3">
              <div id="liveToast" class="toast show" role="alert" aria-live="assertive" aria-atomic="true" style="">
                <div class="toast-header">
                  <img src="../../assets/img/icone_maximus_gestao.png" style="height: 30px" class="rounded img-fluid me-2" alt="...">
                  
                  <strong class="me-auto">Maximus Gestão</strong>
                  <button type="button" class="btn-close" @click="closeToastSuccess()"></button>
                </div>
                <div class="toast-body bg-light">
                  {{ success }}

                  <button class="btn btn-success mt-3 d-block mx-auto" @click="closeToastSuccess()">
                    CONFIRMAR
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="vm--overlay" style="z-index: 9999" @click="closeToastErr()" v-if="err != ''">
            <div class="position-fixed top-0 start-50 translate-middle-x p-3">
              <div id="liveToast" class="toast show" role="alert" aria-live="assertive" aria-atomic="true" style="">
                <div class="toast-header">
                  <img src="../../assets/img/icone_maximus_gestao.png" style="height: 30px" class="rounded img-fluid me-2" alt="...">
                  
                  <strong class="me-auto">Maximus Gestão</strong>
                  <button type="button" class="btn-close" @click="closeToastErr()"></button>
                </div>
                <div class="toast-body text-white bg-primary">
                  {{ err }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue2-editor/dist/vue2-editor.umd.min.js"></script>
<script>

import '../../assets/style/style.css'
import Multiselect from 'vue-multiselect'
import Vue from 'vue'
import axios from 'axios'
import scrypt from "../../assets/js/scrypt";
import Vue2Editor from "vue2-editor";

Vue.use(Vue2Editor);
Vue.component('multiselect', Multiselect)

export default {
  
  data() {
    return {
      title: '',
      errTitle: '',
      errDesc: '',
      idPost: '',
      modules: [
        {
          ID_MODULE: 1,
          DESC_MODULE: 'Maximus Lite'
        },
        {
          ID_MODULE: 2,
          DESC_MODULE: 'Maximus Administrativo'
        },
        {
          ID_MODULE: 3,
          DESC_MODULE: 'Maximus Balcão'
        },
        {
          ID_MODULE: 4,
          DESC_MODULE: 'Maximus Caixa'
        }
      ],
      moduleSelect: [
        {
          ID_MODULE: 0,
          DESC_MODULE: ''
        }
      ],
      array: [
        {
          ID: 0,
          DESC: 'Inativo'
        },
        {
          ID: 1,
          DESC: 'Ativo'
        }
      ],
      arrayOptionSelect: [
        {
          ID: 0,
          DESC: ''
        }
      ],
      desc: '',
      roleUserLogged: '',
      err: '',
      success: '',
      serverIP: '',
      editMode: false
    }
  },
  created(){
    this.serverIP = scrypt.serverIP
    this.verifySlug(this.$route.params.slug);
    this.myFunction();
  },
  methods: {
    addTag (newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }
      this.modules.push(tag)
      this.moduleSelect.push(tag)
    },
    clique() {
      scrypt.clique(this);
    }, 
    myFunction(){
      this.roleUserLogged = localStorage.getItem("roleUser")
    },
    logout(){
      if(confirm("Deseja sair?")){
        localStorage.removeItem("token")
        localStorage.removeItem("roleUser")
        localStorage.removeItem("redeIdUser")
        localStorage.removeItem("loginUser")
        this.$router.push({name: "Home"})
      }
    },
    closeToastErr(){
      this.err = ''
    },
    closeToastSuccess(){
        this.success = ''
        this.$router.push({path: `${this.slug}`})
        window.location.reload()
    },
    updatePost(){
      if(this.title.trim() == ''){
        this.err = 'Título não pode ser vazio'
        document.getElementById("inputTitle").classList.add("is-invalid")
        this.errTitle = 'Informe um título'
      } else if(this.desc.trim() == ''){
        this.err = 'Descrição não pode ser vazia'
        this.errDesc = 'Informe uma descrição no campo logo a cima'
      } else if(this.moduleSelect.ID_MODULE == undefined){
        this.err = 'Selecione um módulo'
      } else {
        axios.patch(`http://${this.serverIP}/post`,{
          idPost: this.idPost,
          title: this.title,
          desc: this.desc, 
          status: this.arrayOptionSelect.ID,
          moduleId: this.moduleSelect.ID_MODULE
        }).then(res => {
          this.slug = res.data.slug;
          this.success = res.data.success;
        }).catch(err => {
          this.err = err.response.data.err
        })
      }
    },
    async verifySlug(slug){
      await axios.get(`http://${this.serverIP}/post`,{
        params:{
          slug: slug
        }
      }).then(res => {
        this.idPost = res.data.post.ID_POST
        this.title = res.data.post.TITULO;
        this.desc = res.data.post.DESCRICAO;
        if(res.data.post.CODMODULO == 1){
          this.moduleSelect = ({ID_MODULE: 1, DESC_MODULE: 'Maximus Lite'})
        } else if(res.data.post.CODMODULO == 2){
          this.moduleSelect = ({ID_MODULE: 2, DESC_MODULE: 'Maximus Administrativo'})
        } else if(res.data.post.CODMODULO == 3){
          this.moduleSelect = ({ID_MODULE: 3, DESC_MODULE: 'Maximus Balcão'})
        } else if(res.data.post.CODMODULO == 4){
          this.moduleSelect = ({ID_MODULE: 4, DESC_MODULE: 'Maximus Caixa'})
        }

        if(res.data.post.ATIVO == 0){
          this.arrayOptionSelect = ({ID: 0, DESC: 'Inativo'})
        } else if(res.data.post.ATIVO == 1){
          this.arrayOptionSelect = ({ID: 1, DESC: 'Ativo'})
        }
      }).catch(err => {
        this.$router.push({name: "Wiki"})
      })
    },
    async deletePost(){
      var confirmation = await confirm("Deseja excluir este post?");
        if(confirmation) {
          try {
            await axios.delete(`http://${this.serverIP}/post/${this.$route.params.slug}`)
            .then(res => {
              this.success = res.data.success;
            });
          } catch(err) {
            this.err = err.response.data.err
          }
        }
    },
    clearErrTitle(){
      this.errTitle = '';
      document.getElementById('inputTitle').classList.remove("is-invalid");
    },
    clearErrDesc(){
      this.errDesc = '';
    }
  }
}
</script>
