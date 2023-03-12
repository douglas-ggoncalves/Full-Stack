<template>
    <div id="napp">
        <div class="wrapper">
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
                        <a href="#">Checagem Napp</a>
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
                <div class="vm--overlay" style="z-index: 9999" @click="err = ''" v-if="err != ''">
                    <div class="position-fixed top-0 start-50 translate-middle-x p-3">
                        <div id="liveToast" class="toast show" role="alert" aria-live="assertive" aria-atomic="true" style="">
                            <div class="toast-header">
                                <img src="../../assets/img/icone_maximus_gestao.png" style="height: 30px" class="rounded img-fluid me-2" alt="...">
                                
                                <strong class="me-auto">Maximus Gestão</strong>
                                <button type="button" class="btn-close" @click="err = ''"></button>
                            </div>
                            <div class="toast-body text-white bg-primary">
                                {{ err }}
                            </div>
                        </div>
                    </div>
                </div>
                
                <nav class="navbar navbar-expand-lg navbar-light">
                    <div class="container-fluid">
                        <button type="button" id="sidebarCollapse" class="btn btn-outline-dark" @click="clique()">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                    </div>
                </nav>

                <v-container fluid>
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
                                    <template v-slot:[`item.RAZAO_LOJA`]="{ item }">
                                        <v-tooltip :color="'rgb(0, 0, 0)'" :max-width="220" bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <span v-bind="attrs" v-on="on" style="">{{ item.RAZAO_LOJA }}</span>
                                            </template> 
                                            <span>{{ item.RAZAO_LOJA }}</span>
                                        </v-tooltip>
                                    </template>

                                    <template v-slot:[`item.DATAVENDA_LOJA`]="{ item }">
                                        <span>{{ new Date(item.DATAVENDA_LOJA).toLocaleString("pt-BR") }}</span>
                                    </template>

                                    <template v-slot:[`item.DATACATALOGO_LOJA`]="{ item }">
                                        <span>{{ new Date(item.DATACATALOGO_LOJA).toLocaleString("pt-BR") }}</span>
                                    </template>

                                    <template v-slot:[`item.DIAS_SEM_ENVIO`]="{ item }">
                                        <span>{{ item.DIAS_SEM_ENVIO }}</span>
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
                                                    <v-icon class="mr-2" @click="infoNetwork(item)"> 
                                                        mdi-information
                                                    </v-icon>
                                                </span>
                                            </template> 
                                            <span>Info</span>
                                        </v-tooltip>
                                    </template>
                                </v-data-table>
                            </v-card>
                        </v-col>
                    </v-row>

                    <v-row id="rowDataDash">
                        <div>
                            <v-col class="col" :cols="4">
                                <div id="partVendas">
                                    <h4>Quantidade de Vendas Enviadas</h4>
                                    <h4 class="text-h2">{{ countVendas }}</h4>
                                </div>
                            </v-col>
                            
                            <v-col class="col" :cols="4">
                                <div id="partCatalog">
                                    <h4>Quantidade de Catálogos Enviados</h4>
                                    <h4 class="text-h2">{{ countCatalog }}</h4>
                                </div>
                            </v-col>
                        </div>

                    </v-row>

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
                                <span class="text-h5">Editar Loja</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-text-field label="Razão Social" v-model="networkSelected.RAZAO_SOCIAL" readonly></v-text-field>
                                        </v-col>

                                        <v-col cols="12">
                                            <v-text-field label="CNPJ" v-model="networkSelected.CNPJ" readonly></v-text-field>

                                            <span>
                                                CNPJ Formatado: {{ networkSelected.CNPJ | toCNPJ }}
                                            </span>
                                        </v-col>

                                        <v-col cols="12" sm="6" class="mt-2">
                                            <v-select :items="['Sim', 'Não']" v-model="networkSelected.STATUS_LOJA" label="Loja Ativa" required ></v-select>
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

                    <v-dialog v-model="dialogInfoStore" max-width="600px">
                        <v-card>
                            <v-card-title class="pb-0">
                                <span class="text-h5 mx-auto">Info Loja</span>
                            </v-card-title>
                            <v-divider class="mx-auto" style="width: 70%"></v-divider>

                            <v-card-text v-for="(item, index) in itemsFiltered" :key="index">
                                <v-timeline align-top dense>
                                    <v-timeline-item :color="item.DataVendaEnviada != null && item.DataCatalogoEnviado != null ? 'success' : 'red lighten-1'" small>
                                        <v-row class="pt-1">
                                            <v-col class="pt-0" cols="3">
                                                <strong>{{ item.DataVendaEnviada != null ? new Date(item.DataVendaEnviada).toLocaleString("pt-BR") : new Date(item.DataCatalogoEnviado).toLocaleString("pt-BR") }} </strong>
                                            </v-col>

                                            <v-col class="pt-0">
                                                <strong>{{ item.MsgVendas }}</strong> <br>
                                                <strong>{{ item.MsgCatalogo }}</strong>
                                                <div class="text-caption">
                                                    {{ item.DataVendaEnviada != null && item.DataCatalogoEnviado != null ? 'Sucesso.' : 'Ocorreu um Erro.' }}
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-timeline-item>
                                </v-timeline>
                            </v-card-text>
                            
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="dialogInfoStore = false">
                                    Fechar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <br><br>
                </v-container>
            </div>
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
            roleUserLogged: '',
            dialogInfoStore: false,
            dialog: false,
            err: '',
            dialogTwo: false,
            msgDialog: '',
            colorDialog: 'success',
            countCatalog: 0,
            countVendas: 0,
            itemsDetailed: [],
            itemsFiltered: [],
            countCatalogStore: 0,
            countVendasStore: 0,
            dataTable: {
                serverIP: '',
                search: '',
                headers: [
                    { text: 'Razão Social', align: 'center', value: 'RAZAO_LOJA',},
                    { text: 'CNPJ', align: 'center', value: 'CNPJ_LOJA'},
                    { text: 'CNPJFormatado', align: ' d-none', value: 'CNPJ_FORMATADO'},
                    { text: 'Data Venda', align: 'center', value: 'DATAVENDA_LOJA' },
                    { text: 'Data Catálogo', align: 'center', value: 'DATACATALOGO_LOJA' },
                    { text: 'Dias Sem Envio', align: 'center', value: 'DIAS_SEM_ENVIO' },
                    { text: 'Ações', align: 'center', value: 'action', sortable: false }
                ],
                items: [
                    
                ],
            },
            networkSelected: {
                RAZAO_SOCIAL: '',
                CNPJ: '',
                STATUS_LOJA: '',
            },
        }
    },
    created(){
        this.serverIP = scrypt.serverIP
        this.myFunction();
    },
    methods: {
        clique() {
            scrypt.clique(this);
        }, 
        editNetwork(){
            axios.patch(`${this.serverIP}/napp`, {
                CNPJ: this.networkSelected.CNPJ,
                STATUS_LOJA: this.networkSelected.STATUS_LOJA == "Sim" ? 1 : 0
            }).then(res => {
                this.dialogTwo = true
                this.dialog = ""
                this.dataTable.items = [];
                this.myFunction();
                this.msgDialog = res.data.success
                this.networkSelected.RAZAO_SOCIAL = "";
                this.networkSelected.CNPJ = "";
                this.networkSelected.STATUS_LOJA = "";
            }).catch(err => {
                this.err = err.response.data.err
            })
        },
        modalEdit(item){
            this.networkSelected.RAZAO_SOCIAL = item.RAZAO_LOJA;
            this.networkSelected.CNPJ = item.CNPJ_LOJA;
            this.networkSelected.STATUS_LOJA = item.STATUS_LOJA == 1 ? "Sim" : "Não";
            this.dialog = true;
        },
        infoNetwork(item){
            this.itemsFiltered = this.itemsDetailed.filter(element => element.CNPJ == item.CNPJ_LOJA)
            this.countCatalogStore = this.itemsFiltered.filter(element => element.DataCatalogoEnviado != null).length
            this.countVendasStore = this.itemsFiltered.filter(element => element.DataVendaEnviada != null).length
            this.dialogInfoStore = true
        },
        myFunction(){
            this.roleUserLogged = localStorage.getItem("roleUser");

            axios.get(`${this.serverIP}/napp`, {})
                .then(res => {
                    for(var y=0; y < res.data.dataNapp.length; y++) {
                        Vue.set(this.dataTable.items, y, {"RAZAO_LOJA" : res.data.dataNapp[y].RazaoSocial, "CNPJ_LOJA" : res.data.dataNapp[y].CNPJ, "CNPJ_FORMATADO" : this.toCNPJ(res.data.dataNapp[y].CNPJ), "DATAVENDA_LOJA" : res.data.dataNapp[y].DataVendaEnviada.replace("Z", ""), "DATACATALOGO_LOJA" : res.data.dataNapp[y].DataCatalogoEnviado.replace("Z", ""), "DIAS_SEM_ENVIO" : res.data.dataNapp[y].DiasSemEnvio, "STATUS_LOJA": res.data.dataNapp[y].Status})
                    }
                    this.countVendas = res.data.dataNapp[0].TotalVendasEnviadas;
                    this.countCatalog = res.data.dataNapp[0].TotalCatalogosEnviados;

                }).catch(err => {
                    this.err = err.response.data.err
                }
            )

            axios.get(`${this.serverIP}/nappDetailed`, {})
                .then(res => {
                    for(var y=0; y < res.data.dataNapp.length; y++) {
                        Vue.set(this.itemsDetailed, y, {"CNPJ" : res.data.dataNapp[y].CNPJ, "RazaoSocial" : res.data.dataNapp[y].RazaoSocial, "DataVendaEnviada" : res.data.dataNapp[y].DataVendaEnviada != null ? res.data.dataNapp[y].DataVendaEnviada.replace("Z", "") : null, "DataCatalogoEnviado" : res.data.dataNapp[y].DataCatalogoEnviado != null ? res.data.dataNapp[y].DataCatalogoEnviado.replace("Z", "") : null, "MsgCatalogo" : res.data.dataNapp[y].MsgCatalogo, "MsgVendas": res.data.dataNapp[y].MsgVendas})
                    }
                }).catch(err => {
                    this.err = err.response.data.err
                }
            )
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
        },
        toCNPJ(val){
            return val.substr(0, 18).replace(/\D/g, '').replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5")
       }
    },
    filters: {
       toCNPJ(val){
            return val.substr(0, 18).replace(/\D/g, '').replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5")
       }
    }
}
</script>
