<template>
  <div id="app" class="home">
    <div class="container">
      <div class="vm--overlay" style="z-index: 9999" @click="closeToastSuccess()" v-if="success != ''">
        <div class="position-fixed top-50 start-50 translate-middle p-3">
          <div id="liveToast" class="toast show" role="alert" aria-live="assertive" aria-atomic="true" style="">
            <div class="toast-header">
              <img src="../assets/img/icone_maximus_gestao.png" style="height: 30px" class="rounded img-fluid me-2" alt="...">
              
              <strong class="me-auto">Maximus Gestão</strong>
              <button type="button" class="btn-close" @click="closeToastSuccess()"></button>
            </div>
            <div class="toast-body bg-light">
              {{ success }}

              <button class="btn btn-success mt-3 d-block mx-auto">
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
              <img src="../assets/img/icone_maximus_gestao.png" style="height: 30px" class="rounded img-fluid me-2" alt="...">
              
              <strong class="me-auto">Maximus Gestão</strong>
              <button type="button" class="btn-close" @click="closeToastErr()"></button>
            </div>
            <div class="toast-body text-white bg-primary">
              {{ err }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="vm--overlay" style="z-index: 9999" v-if="divForRecoveryPassword != ''">
        <div class="position-fixed top-50 start-50 translate-middle p-3">
          <div id="liveToast" class="toast show" role="alert" aria-live="assertive" aria-atomic="true" style="">
            <div class="toast-header">
              <img src="../assets/img/icone_maximus_gestao.png" style="height: 30px" class="rounded img-fluid me-2" alt="...">
              
              <strong class="me-auto">Maximus Gestão</strong>
              <button type="button" class="btn-close" @click="closeToastForRecovery()"></button>
            </div>
            <div class="toast-body bg-white">
              <div class="mt-3">
                <input id="inputNewPassword" type="password" class="form-control" placeholder="Digite sua nova senha" autocomplete="on" v-model="newPassword" @keydown="clearInputsRecovery()">
              </div>

              <div class="mt-3">
                <input id="inputNewPassword2" type="password" class="form-control" placeholder="Digite sua senha novamente" autocomplete="on" v-model="newPassword2"
                @keydown="clearInputsRecovery()">
                <div class="invalid-feedback" v-if="true">
                  {{ errForRecover }}
                </div>
              </div>

              <div class="mt-2">
                <button class="btn btn-success mt-1" @click="checkAndRecoverPassword()">
                  Alterar senha
                </button>
              </div>

              <div>
                <button class="btn btn-secondary mt-1" @click="closeToastForRecovery()">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row d-flex justify-content-center" id="divLogin" v-if="divForRecoveryPassword == ''">
        <div class="bg-dark text-center col-8 col-md-6 col-lg-4 py-4">
          <div class="m-auto pb-3">
            <img class="img-fluid" src="../assets/img/logo-white.png" />
          </div>

          <div class="col-12 col-lg-9 mx-auto">
              <div class="mt-4">
                <input id="inputLogin" type="text" class="form-control" placeholder="Digite seu usuário" v-model="login" @keydown="clear()">
              </div>

              <div class="mt-4">
                <input id="inputPassword" type="password" class="form-control" placeholder="Digite sua senha" autocomplete="on" v-model="password"
                @keydown="clear()">
                <div class="invalid-feedback" v-if="errLogin">
                  {{ errLogin }}
                </div>
              </div>

              <div class="row d-flex justify-content-center mt-3">
                <button type="button" class="btn btn-outline-light" @click="log()">
                  Entrar
                </button>
              </div>

              <div class="row d-flex justify-content-center">
                <button type="button" class="btn btn-link" @click="recoverPassword()">
                  Esqueci minha senha
                </button>
              </div>
          </div>
        </div>
      </div>

      <modal name="modalRecovery">
        <div class="container">
          <div class="row d-flex justify-content-center">
            <div class="col-12 col-lg-10 col-xl-8">
              <h4 class="mt-2">Recuperar Senha</h4>
              <hr>
              <Label for="inputRecover">Informe o seu e-mail</Label>
              <input type="email" id="inputRecover" class="form-control w-100" v-model="emailForRecovery" required @keydown="clearInputsRecover()">
              <div class="invalid-feedback" v-if="errEmail">
                {{ errEmail }}
              </div>

              <button type="button" class="btn btn-success mt-2" @click="recoverPasswordUser()">
                Recuperar Senha
              </button>
            </div>
          </div>
        </div>
      </modal>

      <modal name="modalRecovery2">
        <div class="container d-flex align-items-center h-100">
          <div class="row d-flex justify-content-center">
              <div class="col-12 col-lg-10 col-xl-8">
                <h5>Um e-mail foi enviado para {{ emailForRecovery }} com as instruções para a recuperação de senha</h5>

                <div>
                  <button type="button" class="btn btn-success" @click="closeRecovery2()">
                    Confirmar
                  </button>
                </div>
            </div>
          </div>
        </div>
      </modal>
      
      <modal class="mx-5 mx-md-0" name="divForRecoveryPassword">
        <div class="row d-flex align-items-center justify-content-center mx-auto my-auto h-100">
          <div>
            <div>
              <input type="password" placeholder="Digite sua nova senha">
            </div>
            
            <div>
              <input type="password" placeholder="Repita sua nova senha">
            </div>

            <div class="row d-flex justify-content-center mt-3">
              <div class="col">
                <button type="button" class="btn btn-success" @click="criarEssaFuncao()">
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import scrypt from "../assets/js/scrypt";
import Vue from 'vue'
import VModal from 'vue-js-modal'

Vue.use(VModal, {
  dynamicDefaults: {height: 'auto'} 
})

export default {
   data(){
    return {
      login: '',
      password: '',
      err: '',
      success:'',
      serverIP: '',
      emailForRecovery: '',
      codeForRecovery: '',
      divForRecoveryPassword: '',
      newPassword: '',
      newPassword2: '',
      errForRecover: '',
      errEmail: '',
      errLogin: ''
    }
  }, methods: {
    async log(){
      if(this.login.trim() == '' || this.password.trim() == ''){
        this.err = `Usuário e/ou senha inválidos`
        document.getElementById('inputLogin').classList.add("is-invalid")
        document.getElementById('inputPassword').classList.add("is-invalid")
      } else {
        await axios.post(`http://${this.serverIP}/login`, {
          login: this.login,
          password: this.password
        })
        .then(res => {
          console.log('erooou 1')
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("roleUser", res.data.user.CARGO_USUARIO);
          localStorage.setItem("redeIdUser", res.data.user.REDEID_USUARIO);
          localStorage.setItem("loginUser", res.data.user.LOGIN_USUARIO);

          this.$router.push({name: "Index"})
        }).catch(err => {
          console.log('erooou 2 ' + err)
          this.errLogin = err.response.data.err
          this.err = `${err.response.data.err}`
          document.getElementById('inputLogin').classList.add("is-invalid")
          document.getElementById('inputPassword').classList.add("is-invalid")
          if(err.response){
            this.err = `${err.response.data.err}`
          } else{
            this.err = `${err}`
          }
        })
      }
    }, 
    async recoverPasswordUser(){
      if(this.emailForRecovery.trim() == ''){
        this.err = 'Email precisa ser preenchido'
      } else{
        await axios.post(`http://${this.serverIP}/password`, {
          email: this.emailForRecovery
        })
        .then(() =>{
          this.$modal.hide('modalRecovery');
          this.$modal.show('modalRecovery2');
        }).catch(err => {
          this.errEmail = err.response.data.err
          this.err = err.response.data.err
          document.getElementById('inputRecover').classList.add("is-invalid");
        })
      }
    },
    clear(){
      this.errLogin = '';
      this.err = '';
      document.getElementById('inputLogin').classList.remove("is-invalid");
      document.getElementById('inputPassword').classList.remove("is-invalid");
    },
    clearInputsRecover(){
      this.errEmail = ''
      document.getElementById('inputRecover').classList.remove("is-invalid");
    }
    ,
    closeToast(){
      this.err = '';
    },
    closeToastForRecovery(){
      this.divForRecoveryPassword = ''
    },
    clearInputsRecovery(){
      document.getElementById('inputNewPassword').classList.remove("is-invalid");
      document.getElementById('inputNewPassword2').classList.remove("is-invalid");
    },
    recoverPassword(){
      this.$modal.show('modalRecovery');
    },
    closeRecovery2(){
      this.$modal.hide('modalRecovery2');
      this.emailForRecovery = ''
    },
    closeToastErr(){
      this.err = ''
    },
    closeToastSuccess(){
      this.success = ''
    },
    async checkAndRecoverPassword(){
      if(this.newPassword != this.newPassword2){
        this.errForRecover = 'As senhas devem ser iguais'
        document.getElementById('inputNewPassword').classList.add("is-invalid");
        document.getElementById('inputNewPassword2').classList.add("is-invalid");
      } else if(this.newPassword.length < 4 || this.newPassword2.length < 4){
        this.errForRecover = 'A senha deve ter no mínimo 4 dígitos'
        document.getElementById('inputNewPassword').classList.add("is-invalid");
        document.getElementById('inputNewPassword2').classList.add("is-invalid");
      } else{
        await axios.patch(`http://${this.serverIP}/token`, {
          token: this.divForRecoveryPassword,
          password: this.newPassword
        }).then(res => {
          this.divForRecoveryPassword = ''
          this.success = res.data.success
        }).catch(err => {
          this.err = err.response.data
        })
      }
    }
  }, 
  async created(){
    this.serverIP = scrypt.serverIP

    if(this.$route.params.token != undefined){
      await axios.post(`http://${this.serverIP}/token`, {
        token: this.$route.params.token
      }).then(() => {
        this.divForRecoveryPassword = this.$route.params.token
      }).catch(err => {
        console.log("deu erro aqui")
        console.log(err)
        console.log(err.response.data.err)
      })
    }
  }
};
</script>

<style scoped>
#app {
  display: flex !important;
  align-items: center !important;
  min-height: 100vh !important;
  background: linear-gradient(to bottom, #2b88dc 0%, #31374f 100%) !important;
}

html, body, template {
  min-height: 100vh !important;
}

button {
  cursor: pointer;
}

.btn.btn-link{
  text-decoration: none !important;
}

.toast{
  border: none;
}
</style>