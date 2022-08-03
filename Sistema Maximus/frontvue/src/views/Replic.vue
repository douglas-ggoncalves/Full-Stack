<template>
  <div class="home" id="divMainReplic">
    <div class="wrapper">
      <!-- Sidebar -->
      <nav id="sidebar">
        <ul class="list-unstyled components">
          <div class="sidebar-header">
            <img class="img-fluid" src="../assets/img/logo-white.png">
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

          <div class="container">
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

            <div class="row d-flex justify-content-center align-items-center">
              <div class="col-12">
                <h3>Replicações</h3>
              </div>

              <div class="col-12">
                <button type="button" class="btn btn-outline-dark" @click="showNewNetwork()" v-if="roleUserLogged == 'M'">
                  Nova Rede
                </button>

                <button type="button" class="btn btn-outline-dark" @click="showNewStore()" v-if="roleUserLogged == 'M'">
                  Nova Loja
                </button>

                <button class="btn btn-outline-success" type="button" @click="initVerify()">
                  Iniciar verificação
                </button>

                <button class="btn btn-outline-dark" @click="initVerify()">
                  <i class="fa-solid fa-repeat"></i>
                </button>
              </div>

              <div class="col-md-6 mt-2" v-if="roleUserLogged == 'M'">
                <multiselect v-model="value" :options="networks" :multiple="true" :selectLabel="'Selecionar esta rede'" :selectedLabel="'Rede selecionada'" :deselectLabel="'Remover rede'" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Filtrar redes" label="NOME_REDE" track-by="NOME_REDE" :preselect-first="false">
                  <template slot="selection" slot-scope="{ values, isOpen }"><span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} redes selecionadas</span>
                    
                  </template>
                  <span slot="noResult">
                    Sua pesquisa não retornou nenhum resultado
                  </span>
                </multiselect>
              </div>

              <div class="col-12 d-flex justify-content-center mt-2">
                <hr class="bg-dark w-100 m-1">
              </div>
            </div>
          </div>

          <div class="card" style="width: 100%;" v-if="!err">
            <div v-show="showData" v-for="network in networks" :key="network.id">
              <div v-for="(peguei, index) in value" :key="index"> 
                <table class="table table-bordered table-dark" v-if="network.id == value[index].id">
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col" style="width: 60%">{{ network.NOME_REDE }}</th>
                      <th scope="col"></th>
                    </tr>

                    <tr>
                      <th scope="col">Loja Origem</th>
                      <th scope="col" style="width: 60%">Comandos Pendentes</th>
                      <th scope="col">Ações</th>
                    </tr>
                  </thead>
                  
                  <tbody v-for="(poke, index) in data" :key="index">
                    <tr v-if="poke.err" v-show="network.id == poke.REDEID">
                      <td>{{ poke.NOME_LOJA }}</td>
                      <td>{{ poke.err }} com a loja {{ poke.NUMERO_LOJA }}</td>
                      <td>
                        <a v-bind:href="`https://api.whatsapp.com/send?phone=5562999770941&text=Olá! gostaria que alguém verificasse a replicação da ${network.NOME_REDE} ${poke.NOME_LOJA}`" class="btn btn-outline-light" v-if="roleUserLogged == 'A'" target="_blank">
                          <i class="fa-solid fa-headset"></i>
                        </a>

                        <button type="button" class="btn btn-outline-light" @click="example(poke.ID_LOJA)" v-if="roleUserLogged == 'M'">
                          <i class="fa-solid fa-screwdriver-wrench"></i>
                        </button>

                        <button class="btn btn-outline-danger" @click="deleteStore(data[index].ID_LOJA)" v-if="roleUserLogged == 'M'">
                          <i class="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>

                    <tr v-if="!poke.err" v-show="network.id == poke.REDEID">
                      <td>{{ poke.NOME_LOJA }}</td>
                      <td>
                        <div v-for="(arr, id) in data[index].result" :key="id">
                          <span v-if="!data[index].result[id].semComandos">
                            Loja Destino: {{ data[index].result[id].IDLojaDestino }} - Quantidade de Comandos: {{ data[index].result[id].QuantidadesDeComandos }}
                          </span>

                          <span v-else>
                            Não existem comandos pendentes
                          </span>
                        </div>
                      </td>

                      <td>
                        <a v-bind:href="`https://api.whatsapp.com/send?phone=5562999770941&text=Olá! gostaria que alguém verificasse a replicação da ${network.NOME_REDE} ${poke.NOME_LOJA}`" class="btn btn-outline-light" v-if="roleUserLogged == 'A'" target="_blank">
                          <i class="fa-solid fa-headset"></i>
                        </a>

                        <button type="button" class="btn btn-outline-light" @click="example(data[index].ID_LOJA)" v-if="roleUserLogged == 'M'">
                          <i class="fa-solid fa-screwdriver-wrench"></i>
                        </button>

                        <button class="btn btn-outline-danger" @click="deleteStore(data[index].ID_LOJA)" v-if="roleUserLogged == 'M'">
                          <i class="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    </div>

    <modal name="modalNetwork">
      <div class="row">
          <div class="card">
            <h4 class="card-header">Cadastrar Rede</h4>
            <div class="card-body">
              <div class="col">
                <label>Nome Da Rede</label>
                <input type="text" id="inputNameNetwork" class="form-control" placeholder="Digite o nome da rede" v-model="network" @keydown="clear()" required>
                <div class="invalid-feedback">
                  Nome da rede não pode ser vazio
                </div>
              </div>

              <div class="col text-center mt-2">
                <button type="button" class="btn btn-outline-dark" @click="hideNewNetwork()">
                  Fechar
                </button>
              </div>

              <div class="col text-center mt-1">
                <button type="button" class="btn btn-success" @click="registerNetwork()">
                  Cadastrar
                </button>
              </div>
            </div>
        </div>
      </div>
    </modal>

    <modal name="modalStore" id="modalStore">
      <div class="row d-flex justify-content-center">
        <div class="card">
          <h4 class="card-header">Cadastrar Loja</h4>
          <div class="card-body">
            <div class="col">
              <div class="form-group">
                <Label for="storeNumber">Número da loja</Label>
                <input type="number" class="form-control" placeholder="Informe o número da loja" v-model="numberStoreNewStore" @change="updateStoreName()" required>
              </div>
            </div>

            <div class="col">
              <div class="form-group">
                <Label for="storeName">Nome da loja</Label>
                <input type="text" class="form-control" placeholder="Informe o nome da loja" v-model="nameStore" required>
              </div>
            </div>

            <div class="col">
              <div class="form-group">
                <Label for="storeIP">IP da loja</Label>
                <input type="text" class="form-control" placeholder="Informe o IP da loja" v-model="ipStore" required>
              </div>
            </div>

            <div class="col">
              <div class="form-group">
                <Label for="selectedStore">Selecione uma rede</Label>
                <select id="selectedStore" class="form-control" v-model="selected">
                  <option disabled value="">Escolha uma rede</option>
                  <option v-for="option in networks" v-bind:value="option.id" :key="option.id">
                    {{ option.NOME_REDE }}
                  </option>
                </select>
              </div>
            </div>

            <div class="col">
              <div class="form-group">
                <Label for="doorIP">Porta referente ao IP</Label>
                <input type="text" id="doorIP" class="form-control" v-model="doorIP" placeholder="Informe a porta da loja" required readonly>
              </div>
            </div>
      
            <div class="col">
              <div class="form-group">
                <Label for="login">Login do banco</Label>
                <input type="text" id="login" class="form-control" v-model="login" placeholder="Informe o login do banco" required readonly>
              </div>
            </div>

            <div class="col">
              <div class="form-group">
                <Label for="password">Senha do banco</Label>
                <input type="password" id="passwordBank" class="form-control" v-model="password" placeholder="Informe a senha do banco" required readonly>
              </div>
            </div>

            <div class="col text-center mt-2">
              <button type="button" class="btn btn-outline-dark" @click="hideNewStore()">
                Fechar
              </button>
            </div>

            <div class="col text-center mt-1">
              <button type="button" class="btn btn-success" @click="registerStore()">
                Cadastrar Loja
              </button>
            </div>
            
            <div class="col mt-1">
              <div class="text-center">
                <button type="button" class="btn btn-outline-danger" @click="defaults()">
                  Alterar valores padrões
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>

    <modal name="MyComponent" id="modalStoreEdit">
      <div class="row">
        <div class="card">
          <h4 class="card-header">Editar Loja</h4>
          <div class="card-body">
            <div class="col">
              <div class="form-group">
                <Label for="storeNumber">Número da loja</Label>
                <input type="number" class="form-control" placeholder="Informe o número da loja" v-model="editNumberStoreNewStore" @change="editUpdateStoreName()" required>
              </div>
            </div>

            <div class="col">
              <div class="form-group">
                <Label for="storeName">Nome da loja</Label>
                <input type="text" class="form-control" placeholder="Informe o nome da loja" v-model="editNameStore" required>
              </div>
            </div>

            <div class="col">
              <div class="form-group">
                <Label for="storeIP">IP da loja</Label>
                <input type="text" class="form-control" placeholder="Informe o IP da loja" v-model="editIpStore" required>
              </div>
            </div>

            <div class="col">
              <div class="form-group">
                <Label for="selectedStore">Selecione uma rede</Label>
                <select id="selectedStore" class="form-control" v-model="editSelected">
                  <option disabled value="">Escolha uma rede</option>
                  <option v-for="option in networks" v-bind:value="option.id" :key="option.id">
                    {{ option.NOME_REDE }}
                  </option>
                </select>
              </div>
            </div>

            <div class="col">
              <div class="form-group">
                <Label for="doorIP">Porta referente ao IP</Label>
                <input type="text" id="doorIP" class="form-control" v-model="editDoorIP" placeholder="Informe a porta da loja" required>
              </div>
            </div>
      
            <div class="col">
              <div class="form-group">
                <Label for="login">Login do banco</Label>
                <input type="text" id="login" class="form-control" v-model="editLogin" placeholder="Informe o login do banco" required>
              </div>
            </div>

            <div class="col text-center mt-2">
              <button type="button" class="btn btn-primary" @click="editStore()">
                Editar Loja
              </button>
            </div>
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import VModal from 'vue-js-modal'
import axios from 'axios';
import Vue from 'vue'
import '../assets/style/style.css'
import scrypt from "../assets/js/scrypt";
import Multiselect from 'vue-multiselect'

Vue.component('multiselect', Multiselect)

Vue.use(VModal, {
  dynamicDefaults: {height: 'auto'} 
})

export default {
  created(){
    this.serverIP = scrypt.serverIP
    //this.verifyAuth();
    this.myFunction();
  },
  data() {
    return {
      value: [],
      numberStoreNewStore: '',
      nameStore: '',
      ipStore: '',
      network: '',
      selected: '',
      login: 'sa',
      doorIP: '3739',
      password: 'd120588$788455',
      buttonIdClicked: '',
      editNumberStoreNewStore: '',
      editNameStore: '',
      editIpStore: '',
      editSelected: '',
      editDoorIP: '',
      editLogin: '',
      selectNetwork: '',
      err: '',
      success: '',
      data: [],
      networks: [],
      lojas: [],
      showData: false,
      redeIdUserLogged: '',
      roleUserLogged: '',
      serverIP: ''
    }
  },
  methods: {
    myFunction(){
      axios.get(`http://${this.serverIP}/replic`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      })
      .then(res => {
        this.networks = res.data.networks
        this.lojas = res.data.stores
        for (var x=0;  x < this.networks.length; x++) {
          for(var i=0; i < this.lojas.length; i++ ){
            if(x+1 == this.lojas[i].id){
              this.data.push(this.lojas[i]);
            }
          }
        }

        this.redeIdUserLogged = localStorage.getItem("redeIdUser")
        this.roleUserLogged = localStorage.getItem("roleUser")
        if(this.redeIdUserLogged != 'null') {
          this.value.push({"id": this.redeIdUserLogged});
          this.initVerify();
        }
      }).catch(err => {
        this.err = err.response.data.err
      })
    }, 
    async initVerify(){
      if(this.value.length == 0){
        this.err = 'Informe uma rede para iniciar a verificação'
      } else{
        for(var e=0; e < this.data.length; e++) { // for para deixar array vazio antes de fazer novas consultas
          for(var i = 0; i< this.value.length; i++){
            if(this.data[e].result){
              this.data[e].result = []
            }

            if(this.data[e].err){
              this.data[e].err = ''
            }
          }}

        for(var y=0; y < this.data.length; y++) {
          for(var x = 0; x< this.value.length; x++){
            if(this.data[y].REDEID == this.value[x].id){
              this.showData = true;
              try {
                await axios.post(`http://${this.serverIP}/replic`, {array: this.data[y]})
                .then(res => {
                  Vue.set(this.data, y, res.data.newArray)
                });
              } catch(err) {
                Vue.set(this.data, y, err.response.data.newArray)
              }
            }
          }
        }
      }
    }, 
    async registerNetwork(){
      if(this.network.trim() == ""){
        this.err = 'Nome da rede não pode ser vazio'
        document.getElementById('inputNameNetwork').classList.add("is-invalid")
      } else{
        var confirmation = await confirm("Deseja cadastrar a rede com o nome " + this.network +' ?');
        if(confirmation) {
          try {
            await axios.post(`http://${this.serverIP}/network`, {
              network: this.network
            })
            .then(res => {
              this.network = ''
              this.networks = [];
              this.lojas = [];
              this.data = [];
              this.myFunction();
              this.success = res.data.success
            });
          } catch(err) {
            this.err = err.response.data.err
          }
        }
      }
    },
    async registerStore() {
      if(this.numberStoreNewStore.trim() == "" 
        || this.nameStore.trim() == ""
        || this.ipStore.trim() == ""
        || this.selected == ""
        || this.doorIP.trim() == ""
        || this.login.trim() == ""
        || this.password.trim() == ""
      )
      {
        this.err = "Todos os dados devem ser preenchidos" 
      } else {
        var confirmation = await confirm("Confirma a criação desta loja ?");
        if(confirmation){
          try {
            await axios.post(`http://${this.serverIP}/store`, {
              numberStoreNewStore: this.numberStoreNewStore,
              nameStore: this.nameStore,
              ipStore: this.ipStore,
              selected: this.selected,
              doorIP: this.doorIP,
              login: this.login,
              password: this.password
            })
            .then(res => {
              this.numberStoreNewStore = '',
              this.nameStore = '',
              this.ipStore = '',
              this.selected = '',
              this.doorIP = '3739',
              this.login = 'sa',
              this.password = 'd120588$788455'
              this.networks = [];
              this.lojas = [];
              this.data = [];
              this.myFunction();
              this.success = res.data.success
            });
          } catch(err) {
            this.err = err.response.data.err
          }
        }
      }
    },
    clique() {
      scrypt.clique(this);
    },
    async reloadPage() {
      window.location.reload(true);
    },
    showNewNetwork () {
      this.err = ''
      this.$modal.show('modalNetwork');
    },
    hideNewNetwork () {
      this.$modal.hide('modalNetwork');
    },
    hideNewStore () {
      this.$modal.hide('modalStore');
    },
    showNewStore(){
      this.err = ''
      this.$modal.show('modalStore');
    },
    example(message){
      this.buttonIdClicked = message - 1

      this.editNumberStoreNewStore = this.data[this.buttonIdClicked].NUMERO_LOJA.toString()
      this.editNameStore = this.data[this.buttonIdClicked].NOME_LOJA
      this.editIpStore = this.data[this.buttonIdClicked].IP_LOJA
      this.editSelected = this.data[this.buttonIdClicked].REDEID
      this.editDoorIP = this.data[this.buttonIdClicked].PORTA_LOJA
      this.editLogin = this.data[this.buttonIdClicked].LOGIN_LOJA
      this.$modal.show('MyComponent');
    },
    updateStoreName(){
      if(this.numberStoreNewStore == '0'){
        this.nameStore = 'Integração';
      } else if(this.numberStoreNewStore > 0) {
        this.nameStore = 'Loja ' + this.numberStoreNewStore;
      } 
       else if(this.numberStoreNewStore < 0){
        this.nameStore = 'Número da loja inválido'
      }
    }, 
    editUpdateStoreName(){
      if(this.editNumberStoreNewStore == '0'){
        this.editNameStore = 'Integração';
      } else if(this.editNumberStoreNewStore > 0) {
        this.editNameStore = 'Loja ' + this.editNumberStoreNewStore;
      } 
       else if(this.editNumberStoreNewStore < 0){
        this.editNameStore = 'Número da loja inválido'
      }
    }, 
    defaults() {
      document.getElementById("login").removeAttribute("readonly");
      document.getElementById("doorIP").removeAttribute("readonly");
      document.getElementById("passwordBank").removeAttribute("readonly");
    },
    async editStore() {
      if(this.editNameStore.trim() == ""
        || this.editIpStore.trim() == ""
        || this.editSelected == ""
        || this.editLogin.trim() == ""
      )
      {
        this.err = 'Todos os dados devem ser preenchidos'
      } else if(this.editNumberStoreNewStore < 0||  this.editDoorIP.length < 4){
        this.err = 'Número ou ip da loja estão incorretos'
      }  else {
        var confirmation = await confirm("Confirma a alteração de dados ?");
        if(confirmation){
          try {
            await axios.patch(`http://${this.serverIP}/store`, {
              editNumberStoreNewStore: this.editNumberStoreNewStore,
              editNameStore: this.editNameStore,
              editIpStore: this.editIpStore,
              editSelected: this.editSelected,
              editDoorIP: this.editDoorIP,
              editLogin: this.editLogin,
              idStore: this.buttonIdClicked
            })
            .then(res => {
              this.editNumberStoreNewStore = '',
              this.editNameStore = '',
              this.editIpStore = '',
              this.editSelected = '',
              this.editDoorIP = '',
              this.editLogin = ''
              this.networks = [];
              this.lojas = [];
              this.data = [];
              this.myFunction();
              this.$modal.hide('MyComponent');
              this.success = res.data.success
            });
          } catch(err) {
            this.err = err.response.data.err
          }
        }
      }
    },
    async deleteStore(id){
      var confirmation = await confirm("Deseja excluir " + this.data[id-1].NOME_LOJA +' da rede ' + this.data[id-1].NOME_REDE + ' ?');
      if(confirmation) {
        try {
          await axios.delete(`http://${this.serverIP}/store/${id}`)
          .then(res => {
            this.data[id-1] = []
            this.success = res.data.success
          });
          } catch(err) {
            this.err = err.response.data.err
          }
      }
    }, 
    clear(){
      document.getElementById('inputNameNetwork').classList.remove("is-invalid");
    },
    closeToastErr(){
      this.err = ''
    },
    closeToastSuccess(){
      this.success = ''
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
  }
}
</script> 

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
.toast{
  border: none;
}

.toast-body{
  font-size: 1.08rem;
}
</style>