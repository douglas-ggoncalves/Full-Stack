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
                <button type="button" class="btn btn-outline-dark" @click="showNewNetwork()" v-if="roleUserLogged == 'M' || roleUserLogged == 'A' || roleUserLogged == 'S'">
                  Nova Rede
                </button>

                <button type="button" class="btn btn-outline-dark" @click="showNewStore()" v-if="roleUserLogged == 'M' || roleUserLogged == 'A' || roleUserLogged == 'S'">
                  Nova Loja
                </button>

                <button class="btn btn-outline-success" type="button" @click="initVerify()">
                  Iniciar verificação
                </button>

                <button class="btn btn-outline-dark" @click="initVerify()">
                  <i class="fa-solid fa-repeat"></i>
                </button>
              </div>
              
              <div class="col-md-6 mt-2" v-if="roleUserLogged == 'M' || roleUserLogged == 'A' || roleUserLogged == 'S' || roleUserLogged == 'R'">
                <multiselect v-model="value" @select="eventSelect" @remove="eventSelect" :options="networks" :multiple="true" :selectLabel="'Selecionar esta rede'" :selectedLabel="'Rede selecionada'" :deselectLabel="'Remover rede'" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Filtrar redes" label="NOME_REDE" track-by="NOME_REDE" :preselect-first="false">
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

          <div class="card" style="width: 100%;" v-if="!err && showData"> <!-- É aqui que estava travando -->
            <div v-show="showData" v-for="network in networks" :key="network.id">
              <div v-for="(peguei, index) in value" :key="index"> 
                <table class="table table-bordered table-dark" v-if="network.id == value[index].id && network.id != 0">
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
                        <a v-bind:href="`https://api.whatsapp.com/send?phone=5562999770941&text=Olá! gostaria que alguém verificasse a replicação da ${network.NOME_REDE} ${poke.NOME_LOJA}`" class="btn btn-outline-light" v-if="roleUserLogged == 'M' || roleUserLogged == 'A' || roleUserLogged == 'S'" target="_blank">
                          <i class="fa-solid fa-headset"></i>
                        </a>

                        <button type="button" class="btn btn-outline-light" @click="example(poke.ID_LOJA)" v-if="roleUserLogged == 'M' || roleUserLogged == 'A' || roleUserLogged == 'S'">
                          <i class="fa-solid fa-screwdriver-wrench"></i>
                        </button>

                        <button class="btn btn-outline-danger" @click="deleteStore(data[index].ID_LOJA)" v-if="roleUserLogged == 'M' || roleUserLogged == 'A' || roleUserLogged == 'S'">
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
                        <a v-bind:href="`https://api.whatsapp.com/send?phone=5562999770941&text=Olá! gostaria que alguém verificasse a replicação da ${network.NOME_REDE} ${poke.NOME_LOJA}`" class="btn btn-outline-light" v-if="roleUserLogged == 'M' || roleUserLogged == 'A' || roleUserLogged == 'S'" target="_blank">
                          <i class="fa-solid fa-headset"></i>
                        </a>

                        <button type="button" class="btn btn-outline-light" @click="example(data[index].ID_LOJA)" v-if="roleUserLogged == 'M' || roleUserLogged == 'A' || roleUserLogged == 'S'">
                          <i class="fa-solid fa-screwdriver-wrench"></i>
                        </button>

                        <button class="btn btn-outline-danger" @click="deleteStore(data[index].ID_LOJA)" v-if="roleUserLogged == 'M' || roleUserLogged == 'A' || roleUserLogged == 'S'">
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

    <modal name="modalNetwork" id="modalNetwork">
      <div class="row">
          <div class="card">
            <h4 class="card-header">Cadastrar Rede</h4>
            <div class="card-body">
              <div class="col">
                <label>Nome Da Rede *</label>
                <input type="text" id="inputNameNetwork" class="form-control" placeholder="Digite o nome da rede" v-model="network" @keydown="clear()" required>
                <div class="invalid-feedback">
                  Nome da rede não pode ser vazio
                </div>
              </div>

              <div class="col">
                <label>Login do Radmin</label>
                <input type="text" class="form-control" placeholder="Digite o Login do Radmin" v-model="loginRadmin" @keydown="clear()" required>
              </div>
              
              <div class="col">
                <label>Senha do Radmin</label>
                <input type="text" class="form-control" placeholder="Digite a senha do Radmin" v-model="passwordRadmin" @keydown="clear()" required>
              </div>

              <div class="col">
                <div class="form-group">
                  <Label for="selectedReplic">Rede Replica *</Label>
                  <select id="selectedReplic" class="form-control" v-model="selectedReplic">
                    <option disabled value="">Escolha uma Opção</option>
                    <option v-for="(option, index) in ['Sim','Não']" v-bind:value="option" :key="index">
                      {{ option }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="col">
                <div class="form-group">
                  <Label for="verFechaMes">Verifica Fecha Mês *</Label>
                  <select id="verFechaMes" class="form-control" v-model="selectedFechaMes">
                    <option disabled value="">Escolha uma Opção</option>
                    <option v-for="(option, index) in ['Sim','Não']" v-bind:value="option" :key="index">
                      {{ option }}
                    </option>
                  </select>
                </div>
              </div>
              
              <div class="col">
                <div class="form-group">
                  <Label for="selectedAtive">Rede Ativa</Label>
                  <select id="selectedAtive" class="form-control" v-model="selectedAtive">
                    <option disabled value="">Escolha uma Opção</option>
                    <option v-for="(option, index) in ['Sim','Não']" v-bind:value="option" :key="index">
                      {{ option }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="col text-end mt-2">
                <button type="button" class="btn btn-outline-dark" @click="hideNewNetwork()">
                  Fechar
                </button>

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
                <Label for="integrationStore">Defina se esta é a loja de integração da rede.</Label>
                <select id="integrationStore" class="form-control" v-model="integrationStore">
                  <option disabled>Selecione uma Opção</option>
                  <option v-for="option in [{ value: 1, description: 'Sim'}, { value: 0, description: 'Não' }]" v-bind:value="option.value" :key="option.value">
                    {{ option.description }}
                  </option>
                </select>
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

            <!-- <div class="col-5 d-flex">
              <div class="form-group">
                <Label for="acessRustDesk">Acesso RustDesk</Label>
                <input type="text" id="acessRustDesk" class="form-control" v-model="acessRustDesk" placeholder="Informe o Acesso do RustDesk">
              </div>
            </div>
            
            <div class="col-5 d-flex">
              <div class="form-group">
                <Label for="passwordRustkDest">Senha RustDesk</Label>
                <input type="password" id="passwordRustkDest" class="form-control" v-model="passwordRustkDest" placeholder="Informe a senha do RustDesk">
              </div>
            </div> -->

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
            
            <div class="col text-end mt-2">
              <button type="button" class="btn btn-outline-dark" @click="hideNewStore()">
                Fechar
              </button>

              <button type="button" class="btn btn-success" @click="registerStore()">
                Cadastrar Loja
              </button>

              <button type="button" class="btn btn-outline-danger" @click="defaults()">
                Alterar valores padrões
              </button>
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
                <Label for="integrationStore">Defina se esta é a loja de integração da rede.</Label>
                <select id="integrationStore" class="form-control" v-model="integrationSelected">
                  <option disabled>Selecione uma Opção</option>
                  <option v-for="option in [{ value: 1, description: 'Sim'}, { value: 0, description: 'Não' }]" v-bind:value="option.value" :key="option.value">
                    {{ option.description }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="col">
              <div class="form-group">
                <Label for="storeName">Acesso RustDesk</Label>
                <input type="text" class="form-control" placeholder="Informe o Acesso RustDesk" v-model="editAcessRush" required>
              </div>
            </div>
            
            <div class="col">
              <div class="form-group">
                <Label for="storeName">Senha RustDesk</Label>
                <input type="text" class="form-control" placeholder="Informe a senha RustDesk" v-model="editPAssRush" required>
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
import Vue from 'vue';
import axios from 'axios';
import VModal from 'vue-js-modal';
import '../assets/style/style.css';
import scrypt from "../assets/js/scrypt";
import Multiselect from 'vue-multiselect';
import SocketioService from '../../services/socketio.service.js';

Vue.component('multiselect', Multiselect)

Vue.use(VModal, {
  dynamicDefaults: {height: 'auto'} 
})

export default {
  created(){
    this.serverIP = scrypt.serverIP
    this.roleUserLogged = localStorage.getItem("roleUser")

    if(this.roleUserLogged != "N"){
      this.myFunction();
    } else{
      alert("Você não possui permissão para acessar esta página.\n\nVocê será direcionado para a página inicial.");
      this.$router.push({name: "Index"})
    }
  },
  data() {
    return {
      value: [],
      numberStoreNewStore: '',
      nameStore: '',
      integrationStore: '0',
      ipStore: '',
      network: '',
      loginRadmin: '',
      passwordRadmin: '',
      acessRustDesk: '',
      passwordRustkDest: '',
      selected: '',
      login: 'sa',
      doorIP: '3739',
      password: 'd120588$788455',
      buttonIdClicked: '',
      editNumberStoreNewStore: '',
      editNameStore: '',
      selectedReplic: '',
      selectedFechaMes: '',
      selectedAtive: '',
      editAcessRush: '',
      editPAssRush: '',
      editIpStore: '',
      editSelected: '',
      integrationSelected: '',
      editDoorIP: '',
      editLogin: '',
      selectNetwork: '',
      err: '',
      success: '',
      data: [],
      networks: [],
      lojas: [],
      showData: false,
      redeIdUserLogged: [],
      roleUserLogged: '',
      serverIP: ''
    }
  },
  methods: {
    myFunction(){
      axios.get(`${this.serverIP}/replic`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      })
      .then(res => {
        this.networks = res.data.networks
        this.lojas = res.data.stores

        this.networks.forEach((rede) => {
          this.lojas.forEach((loja, index) => {
            if(rede.id == loja.id){
              this.data.push(this.lojas[index]);
            }
          });
        });

        /*for (var x=0;  x < this.networks.length; x++) {
          for(var i=0; i < this.lojas.length; i++ ){
            if(x+1 == this.lojas[i].id){
              //console.log("this.lojas[i]  " + JSON.stringify(this.lojas[i]))
              this.data.push(this.lojas[i]);
            }
          }
        }*/

        this.redeIdUserLogged = localStorage.getItem("redeIdUser")
        this.roleUserLogged = localStorage.getItem("roleUser")
        if(this.redeIdUserLogged != 'null') {
          const userNetworkIds = this.redeIdUserLogged.split(',').map(id => parseInt(id.trim()));
          
          this.networks = this.networks.filter(network => userNetworkIds.includes(network.id));
          this.networks.unshift({ NOME_REDE: 'Selecionar tudo', id: 0 });
          this.value = this.networks.filter(element => element.id !== 0);
        } else{
          this.networks.unshift({NOME_REDE: 'Selecionar tudo', id: 0})
          this.value = this.networks;
          this.value = this.value.filter(element => element.id != 0)
        }
      }).catch(err => {
        this.err = err.response.data.err
      })

    }, 
    async saveUserClick(){
      try {
        var idUser = localStorage.getItem("idUser")

        await axios.post(`${this.serverIP}/dataReplic`, {
          id: idUser
        })
        .then(() => {
          
        });
      } catch(err) {
        alert("Ocorreu um erro na inserção da informação de checagem da replicação. " + err.response.data.err);
      }
    },

    async initVerify(){
      if(this.value.length == 0){
        this.err = 'Informe uma rede para iniciar a verificação'
      } else{
        this.saveUserClick();

        SocketioService.refreshDashboard(localStorage.getItem("loginUser"));

        this.value = this.value.filter(element => element.id != 0)

        for(var e=0; e < this.data.length; e++) { // for para deixar array vazio antes de fazer novas consultas
          for(var i = 0; i < this.value.length; i++){
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
                await axios.post(`${this.serverIP}/replic`, {array: this.data[y]})
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
      } else if(this.selectedReplic.trim() == ""){
        this.err = 'Informe se a Rede replica'
      } else if(this.selectedFechaMes.trim() == ""){
        this.err = 'Informe se a loja irá utilizar a verificação do fecha mês'
      } 
      else{
        var confirmation = await confirm("Deseja cadastrar a rede com o nome " + this.network +' ?');
        if(confirmation) {
          try {
            await axios.post(`${this.serverIP}/network`, {
              NOME_REDE: this.network,
              RADMIN_NOMEREDE: this.loginRadmin,
              RADMIN_SENHAREDE: this.passwordRadmin,
              REDE_REPLICA: this.selectedReplic == "Sim" ? 1 : 0,
              UTILIZA_FECHA_MES: this.selectedFechaMes == "Sim" ? 1 : 0,
              ISATIVA: this.selectedAtive == "Sim" ? 1 : 0
            })
            .then(res => {
              this.network = ''
              this.loginRadmin = ''
              this.passwordRadmin = ''
              this.selectedReplic = ''
              this.selectedFechaMes = ''
              this.selectedAtive = ''
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
    eventSelect(event){
      if(event.NOME_REDE == "Selecionar tudo"){
        // se tiver algum elemento não selecionado selecionar tudo, caso contrário deixar array vazio
        if(this.value.length > 0){
          if(this.value.length == this.networks.length){ 
            this.value.splice(0); // função para deixar o array vazio
          } 
          else{
            this.value.splice(0);
            for(var y = 1; y < this.networks.length; y++){
              this.value.push({NOME_REDE: this.networks[y].NOME_REDE, id: this.networks[y].id})
            }
            this.value = this.networks;
            this.value = this.value.filter(element => element.id != 0)
          }
        }
         else{
          for(var x = 1; x < this.networks.length; x++){
            this.value.push({NOME_REDE: this.networks[x].NOME_REDE, id: this.networks[x].id})
          }
         this.value = this.value.filter(element => element.id != 0)
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
            await axios.post(`${this.serverIP}/store`, {
              NUMERO_LOJA: this.numberStoreNewStore,
              NOME_LOJA: this.nameStore,
              IP_LOJA: this.ipStore,
              REDEID: this.selected,
              PORTA_LOJA: this.doorIP,
              LOGIN_LOJA: this.login,
              SENHA_LOJA: this.password,
              RAZAO_LOJA: '',
              CNPJ_LOJA: '',
              SISTEMA_LOJA: 0,
              ENDERECO_LOJA: '',
              ACESSOREMOTO: this.acessRustDesk,
              SENHAACESSOREMOTO: this.passwordRustkDest,
              INTEGRACAO_LOJA: this.integrationStore
            })
            .then(res => {
              this.numberStoreNewStore = '',
              this.nameStore = '',
              this.integrationStore = '0',
              this.ipStore = '',
              this.selected = '',
              this.acessRustDesk = '',
              this.passwordRustkDest = '',
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
    example(idElement){
      var myElement = this.data.filter(element => element.ID_LOJA == idElement)[0];
      console.log(JSON.stringify(myElement))
      this.buttonIdClicked = myElement.ID_LOJA
      this.editNumberStoreNewStore = myElement.NUMERO_LOJA.toString()
      this.editNameStore = myElement.NOME_LOJA
      this.editAcessRush = myElement.ACESSOREMOTO
      this.editPAssRush = myElement.SENHAACESSOREMOTO
      this.editIpStore = myElement.IP_LOJA
      this.editSelected = myElement.REDEID
      this.integrationSelected = myElement.INTEGRACAO_LOJA ? 1 : 0
      this.editDoorIP = myElement.PORTA_LOJA
      this.editLogin = myElement.LOGIN_LOJA
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
            await axios.put(`${this.serverIP}/store`, {
              editNumberStoreNewStore: this.editNumberStoreNewStore,
              editNameStore: this.editNameStore,
              editIpStore: this.editIpStore,
              editSelected: this.editSelected,
              INTEGRACAO_LOJA: this.integrationSelected,
              editDoorIP: this.editDoorIP,
              editLogin: this.editLogin,
              idStore: this.buttonIdClicked,
              ACESSOREMOTO: this.editAcessRush,
              SENHAACESSOREMOTO: this.editPAssRush,
            })
            .then(res => {
              this.editNumberStoreNewStore = '',
              this.editNameStore = '',
              this.editIpStore = '',
              this.editSelected = '',
              this.editDoorIP = '',
              this.editLogin = ''
              this.editAcessRush = ''
              this.editPAssRush = ''
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
    var myElement = this.data.filter(element => element.ID_LOJA == id)[0];
      var confirmation = await confirm("Deseja excluir " + myElement.NOME_LOJA +' da rede ' + myElement.NOME_REDE + ' ?');
      if(confirmation) {
        try {
          await axios.delete(`${this.serverIP}/store/${id}`)
          .then(res => {
            this.data = this.data.filter(element => element.ID_LOJA != id)
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
        localStorage.removeItem("idUser")
        this.$router.push({name: "Home"})
      }
    } 
  },
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

@font-face {
    font-family: 'Extreme';
    src: url('/fonts/Extreme-Regular.woff2') format('woff2'),
        url('/fonts/Extreme-Regular.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: fallback;
}
/* import '../assets/style/style.css' */
</style>