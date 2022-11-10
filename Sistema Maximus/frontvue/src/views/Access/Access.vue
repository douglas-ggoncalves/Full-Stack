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
                                    <v-icon small class="mr-2" @click="editItem(item)">
                                        mdi-pencil
                                    </v-icon>
                                </template>

                                <template v-slot:[`item.COMPLETED`]="{ item }">
                                    <v-simple-checkbox v-model="item.COMPLETED"></v-simple-checkbox>
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
//import Vue from 'vue'
import '../../assets/style/style.css'
import scrypt from "../../assets/js/scrypt";
import axios from 'axios';

export default {
    data(){
        return {
            err: '',
            dataTable: {
                serverIP: '',
                roleUserLogged: '',
                search: '',
                headers: [
                    { text: 'Nome Rede Radmin', align: 'center', value: 'RADMIN_NOMEREDE',},
                    { text: 'Senha Rede Radmin', align: 'center', value: 'RADMIN_SENHAREDE'},
                    { text: 'Anydesk', align: 'center', value: 'ANYDESK'},
                    { text: 'Ações', align: 'center', value: 'action', sortable: false },
                    { text: 'Concluído', align: 'center', value: 'COMPLETED'},
                ],
                items: [
                    { ID_LOJA: 0, RADMIN_NOMEREDE: 'Big Farma', RADMIN_SENHAREDE: 'd120588', ANYDESK: '123456621', COMPLETED: true},
                    { ID_LOJA: 1, RADMIN_NOMEREDE: 'Bom Preço', RADMIN_SENHAREDE: 'Maximus', ANYDESK: '123456622', COMPLETED: false},
                    { ID_LOJA: 2, RADMIN_NOMEREDE: 'Drogaria Canaã', RADMIN_SENHAREDE: 'segredo!2019', ANYDESK: '123456623', COMPLETED: true},
                    { ID_LOJA: 3, RADMIN_NOMEREDE: 'Drogaria Cidadã', RADMIN_SENHAREDE: '1234', ANYDESK: '123456624', COMPLETED: true},
                ],
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
                console.log(res.data.networks)
            }).catch(err => {
                this.err = err.response.data.err
            })
        },
        closeToastErr(){
            this.err = ''
        },
        clique() {
            scrypt.clique(this);
        }
    },
    filters: {
       
    },
   
    
}
</script>