<template>
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
                    <a href="#">Implantações</a>
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
           
            <v-container fluid>
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

                <v-dialog v-model="dialogNewNetwork" max-width="600px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" dark v-bind="attrs" v-on="on">
                            Cadastrar Rede
                        </v-btn>
                    </template>
                    <v-card ref="form">
                        <v-card-title>
                            <span class="text-h5">Cadastrar Rede</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field label="Nome da rede *" v-model="newNetwork.NOME_REDE" required></v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field label="Login do radmin" v-model="newNetwork.RADMIN_NOMEREDE"></v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field label="Senha do radmin" v-model="newNetwork.RADMIN_SENHAREDE"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-select :items="['Sim', 'Não']" v-model="newNetwork.REDE_REPLICA" label="Rede replica *" required ></v-select>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-select :items="['Sim', 'Não']" v-model="newNetwork.ISATIVA" label="Loja Ativa" required ></v-select>
                                    </v-col>
                                </v-row>
                                <span class="outlined my-3">
                                    * indica campo obrigatório de ser preenchido
                                </span>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="dialogNewNetwork = false">
                                Fechar
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="saveNetwork()">
                                Salvar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-dialog transition="dialog-bottom-transition" max-width="600" v-model="dialogTwo">
                    <template>
                        <v-card>
                            <v-toolbar :color="colorDialog" dark>Maximus Farma</v-toolbar>
                            <v-card-text class="justify-center">
                                <h3 class="pa-12">
                                    {{ msgDialog }}
                                </h3>
                            </v-card-text>
                            <v-card-actions class="justify-end">
                                <v-btn text @click="dialogTwo = false">Fechar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </template>
                </v-dialog>

                <v-dialog v-model="dialog" max-width="600px">
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">Editar Rede</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field label="Nome da rede" v-model="networkSelected.NOME_REDE" required></v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field label="Login do radmin" v-model="networkSelected.RADMIN_NOMEREDE" required></v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field label="Senha do radmin" v-model="networkSelected.RADMIN_SENHAREDE" required></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-select :items="['Sim', 'Não']" v-model="networkSelected.REDE_REPLICA" label="Rede replica" required ></v-select>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-select :items="['Sim', 'Não']" v-model="networkSelected.ISATIVA" label="Loja Ativa" required ></v-select>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="dialog = false">
                                Fechar
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="editNetwork()">
                                Salvar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                

                <v-row>
                    <v-col class="col" :cols="12">
                        <v-card>
                            <v-card-title>
                                <v-text-field v-model="dataTable.search" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details></v-text-field>
                            </v-card-title>
                            <v-data-table :no-data-text="'Não há dados'" :no-results-text="'Nenhum resultado encontrado'" 
                            :header-props="{'sortByText': 'Ordenar por'}" :footer-props="{'items-per-page-text':'Itens por página', 
                            pageText: '{0}-{1} de {2}', 'items-per-page-all-text':'Todos'}" :headers="dataTable.headers" :items="dataTable.items" 
                            :search="dataTable.search">

                                <template v-slot:[`item.RADMIN_NOMEREDE`]="{ item }">
                                    <v-tooltip :color="'rgb(0, 0, 0)'" :max-width="220" bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <span v-bind="attrs" v-on="on" style="">{{ item.RADMIN_NOMEREDE }}</span>
                                        </template> 
                                        <span>{{ item.RADMIN_NOMEREDE }}</span>
                                    </v-tooltip>
                                </template>

                                <template v-slot:[`item.RADMIN_SENHAREDE`]="{ item }">
                                    <span>{{ item.RADMIN_SENHAREDE }}</span>
                                </template>

                                <template v-slot:[`item.action`]="{ item }" class="text-end"> 
                                    <v-tooltip :color="'rgb(0, 0, 0)'" :max-width="220" bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <span v-bind="attrs" v-on="on" style="">
                                                <v-icon class="mr-2" @click="modalEdit(item)">
                                                    mdi-pencil
                                                </v-icon>
                                            </span>
                                        </template> 
                                        <span>Editar</span>
                                    </v-tooltip>

                                    <v-tooltip :color="'rgb(0, 0, 0)'" :max-width="220" bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <span v-bind="attrs" v-on="on" style="">
                                                <v-icon class="mr-2" @click="editItem(item)">
                                                    mdi-information
                                                </v-icon>
                                            </span>
                                        </template> 
                                        <span>Info</span>
                                    </v-tooltip>
                                </template>

                                <template v-slot:[`item.COMPLETED`]="{ item }">
                                    <v-simple-checkbox :ripple="false" v-model="item.COMPLETED"></v-simple-checkbox>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import '../../assets/style/style.css'
import scrypt from "../../assets/js/scrypt";
import axios from 'axios';

export default {
    data(){
        return {
            err: '', 
            dialog: false,
            dialogTwo: false,
            msgDialog: '',
            colorDialog: 'success', /* success,  primary*/
            dialogNewNetwork: false,
            dataTable: {
                serverIP: '',
                roleUserLogged: '',
                search: '',
                headers: [
                    { text: 'Nome Rede Radmin', align: 'center', value: 'RADMIN_NOMEREDE',},
                    { text: 'Senha Rede Radmin', align: 'center', value: 'RADMIN_SENHAREDE'},
                    { text: 'Ações', align: 'center', value: 'action', sortable: false },
                    { text: 'Concluído', align: 'center', value: 'COMPLETED'},
                ],
                items: [
                    //{ id: 0, NOME_REDE: 'Big Farma', RADMIN_NOMEREDE: 'Big Farma', RADMIN_SENHAREDE: 'd120588', REDE_REPLICA: 'SIM', ISATIVA: 'NÃO', COMPLETED: true},
                    //{ id: 1, NOME_REDE: 'Bom Preço', RADMIN_NOMEREDE: 'Bom Preço', RADMIN_SENHAREDE: 'Maximus', REDE_REPLICA: 'SIM', ISATIVA: 'NÃO',COMPLETED: false},
                    //{ id: 2, NOME_REDE: 'Drogaria Canaã', RADMIN_NOMEREDE: 'Drogaria Canaã', RADMIN_SENHAREDE: 'segredo!2019', REDE_REPLICA: 'SIM', ISATIVA: 'NÃO', COMPLETED: true},
                ],
            },
            networkSelected: {
                id: '',
                NOME_REDE: '',
                RADMIN_NOMEREDE: '',
                RADMIN_SENHAREDE: '',
                REDE_REPLICA: '',
                ISATIVA: '',
            },
            newNetwork: {
                id: '',
                NOME_REDE: '',
                RADMIN_NOMEREDE: '',
                RADMIN_SENHAREDE: '',
                REDE_REPLICA: '',
                ISATIVA: '',
            },
        }
    },
    created(){
        this.serverIP = scrypt.serverIP
        this.myFunction();
    },
    methods: {
        myFunction(){
            this.roleUserLogged = localStorage.getItem("roleUser")

            axios.get(`${this.serverIP}/networks`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then(res => {
                for(var y=0; y < res.data.networks.length; y++) {
                    var element = res.data.networks[y];
                    Vue.set(this.dataTable.items, y, {id: element.id, NOME_REDE: element.NOME_REDE, RADMIN_NOMEREDE: element.RADMIN_NOMEREDE, RADMIN_SENHAREDE: element.RADMIN_SENHAREDE, REDE_REPLICA: element.REDE_REPLICA == 1 ? "Sim" : "Não", ISATIVA: element.ISATIVA == 1 ? "Sim" : "Não"})
                }
            }).catch(err => {
                this.err = err.response.data.err
            })
        },
        modalEdit(item){
            this.networkSelected.id = item.id
            this.networkSelected.NOME_REDE = item.NOME_REDE
            this.networkSelected.RADMIN_NOMEREDE = item.RADMIN_NOMEREDE
            this.networkSelected.RADMIN_SENHAREDE = item.RADMIN_SENHAREDE
            this.networkSelected.REDE_REPLICA = 'Sim'
            this.networkSelected.ISATIVA = 'Sim'
            this.dialog = true;
        },
        editNetwork(){
            if(this.networkSelected.id == null || this.networkSelected.id == ""){
                this.err = "Ocorreu um erro, o identificador único da rede não foi selecionada."
            } else if(this.networkSelected.NOME_REDE == null || this.networkSelected.NOME_REDE == ""){
                this.err = "Nome da rede não pode estar vazio."
            }
            else {
                axios.patch(`${this.serverIP}/network`, {
                    id: this.networkSelected.id,
                    NOME_REDE: this.networkSelected.NOME_REDE,
                    RADMIN_NOMEREDE: this.networkSelected.RADMIN_NOMEREDE,
                    RADMIN_SENHAREDE: this.networkSelected.RADMIN_SENHAREDE,
                    REDE_REPLICA: this.networkSelected.REDE_REPLICA == "Sim" ? 1 : 0,
                    ISATIVA: this.networkSelected.ISATIVA == "Sim" ? 1 : 0
                }).then(res => {
                    this.dialogTwo = true
                    this.dialog = ""
                    this.myFunction();
                    this.msgDialog = res.data.success
                    this.networkSelected.id = "";
                    this.networkSelected.NOME_REDE = "";
                    this.networkSelected.RADMIN_NOMEREDE = "";
                    this.networkSelected.RADMIN_SENHAREDE = "";
                    this.networkSelected.REDE_REPLICA = "";
                    this.networkSelected.ISATIVA = "";
                }).catch(err => {
                    this.err = err.response.data.err
                })
            }
        },
        saveNetwork(){
            if(this.newNetwork.NOME_REDE.trim() == ""){
                this.err = 'Nome da rede não pode ser vazio'
            } else if(this.newNetwork.REDE_REPLICA.trim() == ""){
                this.err = 'Informe se a loja replica ou não'
            }
            else{
                var confirmation = confirm("Confirma gravação de " + this.newNetwork.NOME_REDE +' ?');
                if(confirmation) {
                    axios.post(`${this.serverIP}/network`, {
                        NOME_REDE: this.newNetwork.NOME_REDE,
                        RADMIN_NOMEREDE: this.newNetwork.RADMIN_NOMEREDE,
                        RADMIN_SENHAREDE: this.newNetwork.RADMIN_SENHAREDE,
                        REDE_REPLICA: this.newNetwork.REDE_REPLICA == "Sim" ? 1 : 0,
                        ISATIVA: this.newNetwork.ISATIVA == "Sim" ? 1 : 0
                    }).then(res => {
                        this.err = res.data.success
                        this.newNetwork.RADMIN_NOMEREDE = ""
                        this.newNetwork.RADMIN_SENHAREDE = ""
                        this.newNetwork.REDE_REPLICA = ""
                        this.newNetwork.ISATIVA = ""
                    }).catch(err => {
                        this.msgDialog = err.response.data.err
                        this.colorDialog = 'danger'
                        this.dialogTwo = true
                    })
                }   
            }
        },
        closeToastErr(){
            this.err = ''
        },
        clique() {
            scrypt.clique(this);
        }
    },
    
}
</script>