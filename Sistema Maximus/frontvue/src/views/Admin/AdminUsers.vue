<template>
    <div class="home" id="divMainReplic">
        <div class="wrapper">
            <!-- Sidebar -->
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
                        <a href="#">Gestão de Usuários</a>
                    </li>

                    <li>
                        <a href="implantacoes">Implantações</a>
                    </li>

                    <li>
                        <a href="replicacoes">Replicação</a>
                    </li>
                
                    <li>
                        <a href="versoes">Versões</a>
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
                                    <button class="btn btn-success mt-3 d-block mx-auto">
                                        CONFIRMAR
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row d-flex justify-content-center align-items-center">
                        <div class="col-12">
                            <h3>Gestão de Usuários</h3>
                        </div>

                        <div class="col-12">
                            <button type="button" class="btn btn-outline-dark" @click="showModalNewUser()">
                                Novo usuário
                            </button>
                        </div>

                        <div class="col-12 d-flex justify-content-center mt-2">
                            <hr class="bg-dark w-100 m-1">
                        </div>

                        <div class="form-group">
                            <input type="text" class="form-control" v-model="busca" placeholder="Busca por login do usuário">
                        </div>

                        <div class="my-3">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="inlineCheckbox1" @click="checkFunction('updateRole')">
                                <label class="form-check-label" for="inlineCheckbox1">Mostrar Cargo</label>
                            </div>

                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="inlineCheckbox2"  @click="checkFunction('updateNetwork')" checked>
                                <label class="form-check-label" for="inlineCheckbox2">Mostrar Rede</label>
                            </div>

                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="inlineCheckbox3"  @click="checkFunction('updateAction')" checked>
                                <label class="form-check-label" for="inlineCheckbox3">Mostrar Ações</label>
                            </div>
                        </div>

                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">Login</th>
                                    <th scope="col" v-if="roleUsers">Cargo</th>
                                    <th scope="col" v-if="networkUsers">Rede Usuário</th>
                                    <th scope="col" v-if="actionUsers">Ações</th>
                                </tr>
                            </thead>

                            <tbody v-for="client in searchClient" :key="client.ID_USUARIO">
                                <tr v-if="roleUserLogged == 'M' || client.ID_USUARIO == idUser">
                                    <td style="font-weight: bold;">{{ client.LOGIN_USUARIO }}</td>
                                    <td v-if="roleUsers">{{ client.CARGO_USUARIO }}</td>
                                    <td v-if="networkUsers">{{ client.NOME_REDE }}</td>
                                    <td v-if="actionUsers">
                                        <button type="button" class="btn btn-outline-dark" @click="editClient(client.ID_USUARIO)">
                                            <i class="fa-solid fa-pencil"></i>
                                        </button>

                                        <button class="btn btn-outline-danger" @click="deleteUser(client.ID_USUARIO, client.LOGIN_USUARIO)">
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

        <modal name="modalNewUser" class="" id="modalStore">
            <div class="row">
                <div class="card">
                    <h4 class="card-header">Cadastrar Usuário</h4>
                    <div class="card-body">
                        <div class="col">
                            <label>Login</label>
                            <input type="text" class="form-control" placeholder="Informe o login" v-model="loginUser" required>
                        </div>
                        
                        <div class="col">
                            <label>E-mail</label>
                            <input type="email" class="form-control" placeholder="Informe seu e-mail" v-model="emailUser" required>
                        </div>

                        <div class="col">
                            <label>Senha</label>
                            <input type="password" class="form-control" placeholder="Informe a senha" v-model="passwordUser" required>
                        </div>

                        <div class="col">
                            <div class="form-group">
                                <Label for="selectedRole">Selecione um cargo</Label>
                                <select id="selectedRole" class="form-control" v-model="abbreviatedRoleUser">
                                    <option disabled value="">Escolha um cargo</option>
                                    <option v-for="user in users" v-bind:value="user.abbreviatedRoleUser" :key="user.id">
                                        {{ user.role }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="col">
                            <div class="form-group">
                                <Label for="selectedNewEmployee">Selecione se é Funcionário</Label>
                                <select id="selectedNewEmployee" class="form-control" v-model="isFuncNew">
                                    <option disabled value="">Defina se é Funcionário</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não</option>
                                </select>
                            </div>
                        </div>

                        <div class="col">
                            <div class="form-group">
                                <v-combobox
                                    class="mt-4"
                                    v-model="selected"
                                    item-text="NOME_REDE"
                                    :items="networks"
                                    label="Selecione uma ou mais Redes"
                                    multiple
                                    dense
                                ></v-combobox>
                            </div>
                        </div>

                        <div class="col text-center mt-2">
                            <button type="button" class="btn btn-outline-dark" @click="hideNewNetwork()">
                                Fechar
                            </button>
                        </div>

                        <div class="col text-center mt-2">
                            <button type="button" class="btn btn-success" @click="registerUser()">
                                Cadastrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </modal>

        <modal name="modalEditUser" id="modalStoreEdit">
            <div class="row">
                <form action="">
                    <div class="card">
                        <h4 class="card-header">Editar Usuário</h4>
                        <div class="card-body">
                            <div class="col">
                                <div class="form-group">
                                    <Label for="loginUser">Login do Usuário</Label>
                                    <input type="text" id="loginUser" class="form-control" v-model="editLoginUser" required>
                                </div>
                            </div>

                            <div class="col" v-if="relativeUser || roleUserLogged == 'M'">
                                <div class="form-group">
                                    <label for="editPasswordUser">Senha</label>
                                    <input type="password" id="editPasswordUser" class="form-control" placeholder="Informe a senha" v-model="editPasswordUser" required>
                                </div>
                            </div>

                            <div class="col" v-if="roleUserLogged == 'M'">
                                <div class="form-group">
                                    <Label for="selectedRole">Selecione um cargo</Label>
                                    <select id="selectedRole" class="form-control" v-model="editRoleUser">
                                        <option disabled value="">Escolha um cargo</option>
                                        <option v-for="user in users" v-bind:value="user.abbreviatedRoleUser" :key="user.id">
                                            {{ user.role }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div class="col" v-if="roleUserLogged == 'M'">
                                <div class="form-group">
                                    <Label for="selectedEmployee">Selecione se é Funcionário</Label>
                                    <select id="selectedEmployee" class="form-control" v-model="editIsFunc">
                                        <option disabled value="">Defina se é Funcionário</option>
                                        <option value="Sim">Sim</option>
                                        <option value="Não">Não</option>
                                    </select>
                                </div>
                            </div>

                            <div class="col" v-if="roleUserLogged == 'M'">
                                <div class="form-group" v-if="roleUserLogged == 'M'">
                                    <v-combobox
                                        class="mt-4"
                                        v-model="editRoleNetwork"
                                        item-text="NOME_REDE"
                                        :items="networks"
                                        label="Selecione uma ou mais Redes"
                                        multiple
                                        dense
                                    ></v-combobox>
                                </div>
                            </div>

                            <div class="col text-center mt-2">
                                <button type="button" class="btn btn-success" @click="editUser()">
                                    Editar Usuário
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </modal>
    </div>
</template>

<script>
import VModal from 'vue-js-modal';
import axios from 'axios';
import '../../assets/style/style.css';
import scrypt from "../../assets/js/scrypt";
import Vue from 'vue';
import Multiselect from 'vue-multiselect';

Vue.component('multiselect', Multiselect);

Vue.use(VModal, {
  dynamicDefaults: {height: 'auto'} 
})

export default {
    data(){
        return{
            serverIP: '',
            clients: [],
            busca: '',
            loginUser: '',
            emailUser: '',
            passwordUser: '',
            abbreviatedRoleUser: '',
            isFuncNew: '',
            selected: [],
            networks: [],
            editLoginUser: '',
            editRoleUser:'',
            editIsFunc:'',
            editRoleNetwork:[],
            relativeUser:'',
            roleUserLogged: '',
            redeIdUserLogged: '',
            idUser: '',
            err: '',
            success: '',
            editPasswordUser: '',
            roleUsers: false,
            networkUsers: true,
            actionUsers: true,
            users: [
                {
                    id: 1,
                    role: 'Master',
                    abbreviatedRoleUser: 'M'
                },
                {
                    id: 2,
                    role: 'Administrativo',
                    abbreviatedRoleUser: 'A'
                },
                {
                    id: 3,
                    role: 'Suporte',
                    abbreviatedRoleUser: 'S'
                },
                {
                    id: 4,
                    role: 'Representante',
                    abbreviatedRoleUser: 'R'
                },
                {
                    id: 5,
                    role: 'Napp',
                    abbreviatedRoleUser: 'N'
                },
            ]
        }
    },
    methods: {
        myFunction(){
            axios.get(`${this.serverIP}/user`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }   
            })
            .then(res => {
                this.roleUserLogged = localStorage.getItem("roleUser")
                this.redeIdUserLogged = localStorage.getItem("redeIdUser")
                if(this.redeIdUserLogged != 'null') {
                    this.redeIdUserLogged = localStorage.getItem("redeIdUser")
                    this.clients = res.data.filter(r => r.REDEID_USUARIO == this.redeIdUserLogged)
                } else{
                    this.clients = res.data
                }
            }).catch(err => {
                this.err = err.response.data.err
                this.$router.push({name: "Home"})
            })
        },
        myFunction2(){
            axios.get(`${this.serverIP}/replic`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            .then(res => {
                this.roleUserLogged = localStorage.getItem("roleUser")
                if(this.redeIdUserLogged != 'null') {
                    this.redeIdUserLogged = localStorage.getItem("redeIdUser")
                    if(this.roleUserLogged == 'M') {
                        this.networks = res.data.networks
                    }
                    else{
                        this.networks = res.data.networks.filter(r => r.id == this.redeIdUserLogged)
                    }
                } else{
                    this.networks = res.data.networks
                }
            }).catch(err => {
                this.err = err.response.data.err
            })
        },
        async registerUser(){
            if(this.loginUser.trim() == ''){
                this.err = 'O campo login é obrigatório'
            } else if(this.emailUser.trim() == ''){
                this.err = 'O campo email é obrigatório'
            } else if(this.roleUserLogged != 'M' && this.abbreviatedRoleUser == 'M'){
                this.err = 'Você não tem permissão para criar usuários com este cargo'
            } 
            else if(this.roleUserLogged != 'M' && this.abbreviatedRoleUser == 'A'){
                this.err = 'Você não tem permissão para criar usuários com este cargo'
            } 
            else if(this.isFuncNew.trim() == ''){
                this.err = 'Defina se o usuário é funcionário'
            } 
            else{
                if(this.passwordUser.trim() == ''){
                    this.err = 'O campo senha é obrigatório'
                } else if(this.passwordUser.length < 4){
                    this.err = 'A senha deve ter no mínimo 4 dígitos'
                } else {
                    if(this.abbreviatedRoleUser == ""){
                        this.err = 'O campo cargo é obrigatório'
                    } else{
                        try {
                            await axios.post(`${this.serverIP}/user`, {
                                login: this.loginUser,
                                password: this.passwordUser,
                                email: this.emailUser,
                                role: this.abbreviatedRoleUser,
                                networkId: this.selected.map(network => network.id),
                                isFuncNew: this.isFuncNew == "Sim" ? 1 : 0
                            })
                            .then(res => {
                                this.loginUser = ''
                                this.passwordUser = ''
                                this.emailUser = ''
                                this.abbreviatedRoleUser = ''
                                this.isFuncNew = ''
                                this.selected = []
                                this.clients = ''
                                this.hideNewNetwork();
                                this.myFunction();
                                this.success = res.data.success;
                            });
                        } catch(err) {
                            this.err = err.response.data.err
                        }
                    }
                }
            }
        },
        async deleteUser(id, login){
            if(this.roleUserLogged != "M"){
                this.err = "Você não possui permissão para excluir um usuário.";
            } else{
                var confirmation = await confirm("Deseja excluir " + login + ' ?');
                if(confirmation) {
                    try {
                        await axios.delete(`${this.serverIP}/user/${login}`)
                        .then(res => {
                            this.clients = this.clients.filter(client => client.LOGIN_USUARIO != login)
                            this.success = res.data.success
                        });
                    } catch(err) {
                        this.err = err.response.data.err
                    }
                }
            }
        },
        editClient(indexClient){
            var clientSelected = this.clients.filter(element => element.ID_USUARIO == indexClient)[0];

            this.editLoginUser = clientSelected.LOGIN_USUARIO
            this.editRoleUser = clientSelected.CARGO_USUARIO
            this.editIsFunc = clientSelected.IS_FUNCIONARIO == 1 ? "Sim" : "Não";
            if(clientSelected.RedesAssociadas != null && clientSelected.RedesAssociadas != ""){
                var arrayDados = clientSelected.RedesAssociadas.split(", ")
                var arrayAUX = [];

                arrayDados.forEach(element => {
                   var network =  this.networks.find(net => net.id == element)
                    arrayAUX.push(network)
                }); 
                
                this.editRoleNetwork = arrayAUX; // Exemplos de dados: [{ id: 1, NOME_REDE: 'Big Farma' }, { id: 2, NOME_REDE: 'Bom Preço' }]
            }
            else{
                this.editRoleNetwork = [];
            }

            this.idUser = clientSelected.ID_USUARIO
            this.editPasswordUser = ''
            this.relativeUser = this.idUser == localStorage.getItem("idUser") ? true : false
            this.$modal.show('modalEditUser');
        },
        async editUser() {
            if(this.editLoginUser.trim() == "" || this.editRoleUser.trim() == "") {
                this.err = 'Login ou cargo do usuário precisam ser preenchidos.'
            } else if(this.roleUserLogged != 'M' && this.editRoleUser == 'M'){
                this.err = 'Você não tem permissão para adicionar usuários com este cargo.'
            } else if(this.editIsFunc.trim() == ''){
                this.err = 'Defina se o usuário é funcionário ou não.'
            } else {
                var confirmation = await confirm("Confirma a alteração de dados ?");
                if(confirmation){
                    try {
                        //var redes = [];
                        //this.editRoleNetwork.forEach()

                        var trocaSenha = await false;
                        if(this.relativeUser && this.editPasswordUser.trim() == ""){
                            this.err = 'Preencha o campo senha';
                            return;
                        }
                        else{
                            if(this.roleUserLogged == 'M' && this.editPasswordUser.trim() != ""){
                                trocaSenha = await true;
                            }
                        }
                        if(this.relativeUser)
                            trocaSenha = await true;

                        await axios.patch(`${this.serverIP}/user`, {
                            editLoginUser: this.editLoginUser,
                            editRoleUser: this.editRoleUser,
                            editRoleNetwork: this.editRoleNetwork.map(network => network.id),
                            idUser: this.idUser,
                            passwordUser: this.editPasswordUser,
                            alterPassword: trocaSenha,
                            editIsFunc : this.editIsFunc == "Sim" ? 1 : 0
                        })
                        .then(res => {
                            this.clients = '';
                            if(this.relativeUser){
                                localStorage.removeItem("loginUser")
                                localStorage.setItem("loginUser", this.editLoginUser);

                                localStorage.removeItem("roleUser")
                                localStorage.setItem("roleUser", this.editRoleUser);

                                localStorage.removeItem("redeIdUser")
                                localStorage.setItem("redeIdUser", this.editRoleNetwork);
                            }

                            this.editLoginUser = "";
                            this.editRoleUser = "";
                            this.editRoleNetwork = [];
                            this.editPasswordUser = "";
                            
                            this.myFunction();
                            this.$modal.hide('modalEditUser');
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
        showModalNewUser () {
            if(this.roleUserLogged != "N"){
                this.$modal.show('modalNewUser');
            } else{
                alert("Você não possui permissão para acessar esta função.");
            }
        },
        closeToastErr(){
            this.err = ''
        },
        closeToastSuccess(){
            this.success = ''
        },
        hideNewNetwork(){
            this.$modal.hide('modalNewUser');
        },
        checkFunction(value){
            if(value == 'updateRole'){
                if(this.roleUsers){
                    this.roleUsers = undefined;
                } else{
                    this.roleUsers = true;
                }
            }
            
            if(value == 'updateNetwork'){
                if(this.networkUsers){
                    this.networkUsers = undefined;
                } else{
                    this.networkUsers = true;
                }
            }

            if(value == 'updateAction'){
                if(this.actionUsers){
                    this.actionUsers = undefined;
                } else{
                    this.actionUsers = true;
                }
            }
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
    created(){
        var roleUser = localStorage.getItem("roleUser");
        if(roleUser == "R"){
            alert("Você não possui permissão para acessar esta página.\n\nVocê será direcionado para a página inicial.");
            this.$router.push({name: "Index"})
        }
            
        this.serverIP = scrypt.serverIP
        this.myFunction();
        this.idUser = localStorage.getItem("idUser");
        this.myFunction2();
    },
    filters:{
        
    },
    computed: {
        searchClient: function(){
            if(this.busca.trim() == ''){
                return this.clients;
            } else{
                return this.clients.filter(client => 
                    client.LOGIN_USUARIO.toLowerCase().match(this.busca.toLowerCase())
                );
            }
        }
    }
}
</script>
