<template>
    <div id="dashboard">
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
                        <a href="tarefas">Checagem Fecha Mês</a>
                    </li>

                    <li>
                        <a href="napp">Checagem Napp</a>
                    </li>

                    <li>
                        <a href="#">Dashboard</a>
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

                <v-snackbar style="z-index: 99999" v-model="snackbar" timeout="3000" :color="snackbarColor" absolute top right elevation="24">
                    <strong>{{ snackbarText }}</strong>

                    <template v-slot:action="{ attrs }">
                        <v-btn color="White" text v-bind="attrs" @click="snackbar = false">Fechar</v-btn>
                    </template>
                </v-snackbar>

                <v-row>
                    <v-dialog v-model="this.error" persistent transition="dialog-bottom-transition" max-width="600" style="z-index: 10000;">
                        <v-card>
                            <v-toolbar color="error" dark>Ocorreu um erro</v-toolbar>
                            <v-card-text>
                                <div class="text-h4 pa-12">{{ msgError }}</div>
                            </v-card-text>
                            <v-card-actions class="justify-end">
                                <v-btn color="error" block @click="error = false">Fechar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    
                    <v-col class="col" :cols="12" :md="8" :lg="9">
                        <v-card>
                            <v-card-title>
                                Checagens
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search2" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details></v-text-field>
                            </v-card-title>

                            <v-data-table :no-data-text="'Não há dados'" :no-results-text="'Nenhum resultado encontrado'" 
                                :header-props="{'sortByText': 'Ordenar por'}" :footer-props="{'items-per-page-text':'Itens por página', 
                                pageText: '{0}-{1} de {2}', 'items-per-page-all-text':'Todos'}" :headers="headers" :items="items" 
                                :search="search2" :custom-filter="filterData">

                                <template v-slot:[`item.USUARIO_ID`]="{ item }">
                                    <span>{{ item.USUARIO_ID }}</span>
                                </template>

                                <template v-slot:[`item.LOGIN_USUARIO`]="{ item }">
                                    <v-tooltip :color="'rgb(0, 0, 0)'" :max-width="220" bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <span v-bind="attrs" v-on="on" style="">{{ item.LOGIN_USUARIO }}</span>
                                        </template> 
                                        <span>{{ item.LOGIN_USUARIO }}</span>
                                    </v-tooltip>
                                </template>

                                <template v-slot:[`item.DataChecagem`]="{ item }">
                                    <span>{{ new Date(item.DataChecagem).toLocaleString("pt-BR") }}</span>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-col>

                    <v-col class="col" :cols="12" :md="4" :lg="3">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <div class="elements" v-bind="attrs" v-on="on">
                                    <a class="totalAcomp" :href="`#`">
                                        <div class="left">
                                            <span>Acompanhamentos</span>
                                            <input type="text" class="d-none" id="inputTextDashboard">

                                            <div @click="syncInfoDashboard()" class="d-none" id= "syncInfoDashboard"/>
                                            <br>
                                            <span class="value">Quantidade de Checagens: {{ items.length }}</span>
                                        </div>
                                        
                                        <div class="right">
                                            <span>
                                                <v-icon class="iGreen">mdi-arrow-up</v-icon>
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            </template>
                            <span>Quantidade de Checagens Feitas</span>
                        </v-tooltip>

                        <v-row>
                            <v-col :cols="12">
                                <v-menu style="z-index: 13" ref="menuFilterInit" v-model="menuFilterInit" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="dateFilterFormattedInit" readonly :prepend-inner-icon="'mdi-calendar'" label="Período Inicial" 
                                        hint="informe a data desejada" v-bind="attrs" @blur="dateFilterInit = parseDate(dateFilterFormattedInit)" v-on="on" ></v-text-field>
                                    </template>
                                    
                                    <v-date-picker v-model="dateFilterInit" no-title @input="menuFilterInit = false" locale="pt"></v-date-picker>
                                </v-menu>
                            </v-col>

                            <v-col :cols="12">
                                <v-menu style="z-index: 13" ref="menuFilterFinal" v-model="menuFilterFinal" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="dateFilterFormattedFinal" readonly :prepend-inner-icon="'mdi-calendar'" label="Período Final" 
                                        hint="informe a data desejada" v-bind="attrs" @blur="dateFilterFinal = parseDate(dateFilterFormattedFinal)" v-on="on" ></v-text-field>
                                    </template>
                                    
                                    <v-date-picker v-model="dateFilterFinal" no-title @input="menuFilterFinal = false" locale="pt"></v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                        
                        <v-btn class="ma-1" color="success" @click="filterByDate()">
                            Filtrar
                        </v-btn>
                        
                        <v-btn class="ma-1" color="primary" @click="clearDateFilter()">
                            Limpar Filtro
                        </v-btn>
                    </v-col>
                </v-row>

                <v-row class="datasDash">
                    <v-col class="dash" :cols="12" :md="6" :lg="4">
                        <h4>Acompanhamentos por Usuário</h4>
                        <div id="first">
                            <div v-if="items != null && items.length == 0 && message == ''">
                                <v-icon>mdi-chart-donut</v-icon>
                                <br>
                                <h5>Não foram encontrados dados no período..</h5>
                            </div>
                            
                            <div v-if="items != null && items.length == 0 && message != ''">
                                <v-icon>mdi-chart-donut</v-icon>
                                <br>
                                <h5>{{ message }}</h5>
                            </div>
                            
                            <div v-if="items != null && items.length > 0 && message != ''">
                                <v-icon>mdi-chart-donut</v-icon>
                                <br>
                                <h5>{{ message }}</h5>
                            </div>

                            <div class="divDash" v-if="items != null && items.length > 0 && message == ''">
                                <apexchart class="" height="350" id="apexDonutRec" type="donut" :options="optionsDonut" :series="seriesDonut"></apexchart>
                            </div>
                        </div>
                    </v-col>

                    <v-col class="dash" :cols="12" :md="6" :lg="5">
                        <h4>Acompanhamentos por Ano</h4>
                        
                        <div id="first">
                            <div v-if="allItems != null && allItems.length == 0">
                                <v-icon>mdi-chart-donut</v-icon>
                                <br>
                                <h5>Não foram encontrados dados no período..</h5>
                            </div>

                            <div class="divDash" v-else>
                                <v-select style="z-index: 12;" v-model="yearSelected" :items="arrayYears" menu-props="auto" label="Select" hide-details :prepend-inner-icon="'mdi-calendar-range'" single-line/>
                                <apexchart type="line"  height="350" :options="optionsLine" :series="seriesLine"></apexchart>
                            </div>
                        </div>
                    </v-col>

                    <v-col class="dash" :cols="12" :lg="3">
                        <h4>Dados Gerais</h4>
                        <v-row class="mt-0">
                            <v-col class="pt-0" :cols="12" :md="6" :lg="12">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <div class="elements" v-bind="attrs" v-on="on">
                                            <span>
                                                <div class="left">
                                                    <span style="font-weight: bold;">Quantidade de Checagens</span>
                                                    <br>
                                                    <span v-if="items != null">{{ totalCheckReplic }}</span>
                                                    <span v-if="items == null">0</span>
                                                </div>
                                                
                                                <div class="right">
                                                    <span>
                                                        <v-icon class="iGreen">mdi-arrow-up</v-icon>
                                                    </span>
                                                </div>
                                            </span>
                                        </div>
                                    </template>
                                    <span>Quantidade total de Checagens Feitas</span>
                                </v-tooltip>
                            </v-col>

                            <v-col class="pt-0" :cols="12" :md="6" :lg="12">
                                <div id="arrayMov">
                                    <span>
                                        <h3>
                                            Últimas replicações checadas
                                        </h3>

                                        <div style="text-align: center" v-if="allItems2 != null && allItems2.length == 0">
                                            <v-icon>mdi-chart-donut</v-icon>
                                            <br>
                                            <h5>Não foram encontrados dados no período..</h5>
                                        </div>

                                        <div v-if="allItems2 != null && allItems2[allItems2.length -1]" class="data">
                                            <div>
                                                <div class="divLeft">
                                                    <v-tooltip :color="'rgb(0, 0, 0)'" :max-width="220" bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <span v-bind="attrs" v-on="on">{{ allItems2[allItems2.length -1].LOGIN_USUARIO }}</span> <br>
                                                        </template>
                                                        <span>{{ allItems2[allItems2.length -1].LOGIN_USUARIO }}</span>
                                                    </v-tooltip>
                                                    <span>{{ new Date(allItems2[allItems2.length -1].DataChecagem).toLocaleString("pt-BR") }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div v-if="allItems2 != null && allItems2[allItems2.length -2]" class="data">
                                            <div>
                                                <div class="divLeft">
                                                    <v-tooltip :color="'rgb(0, 0, 0)'" :max-width="220" bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <span v-bind="attrs" v-on="on">{{ allItems2[allItems2.length -2].LOGIN_USUARIO }}</span> <br>
                                                        </template>
                                                        <span>{{ allItems2[allItems2.length -2].LOGIN_USUARIO }}</span>
                                                    </v-tooltip>
                                                    <span>{{ new Date(allItems2[allItems2.length -2].DataChecagem).toLocaleString("pt-BR") }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div v-if="allItems2 != null && allItems2[allItems2.length -3]" class="data">
                                            <div>
                                                <div class="divLeft">
                                                    <v-tooltip :color="'rgb(0, 0, 0)'" :max-width="220" bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <span v-bind="attrs" v-on="on">{{ allItems2[allItems2.length -3].LOGIN_USUARIO }}</span> <br>
                                                        </template>
                                                        <span>{{ allItems2[allItems2.length -3].LOGIN_USUARIO }}</span>
                                                    </v-tooltip>
                                                    <span>{{ new Date(allItems2[allItems2.length -3].DataChecagem).toLocaleString("pt-BR") }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </span>
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </div>
        </div>
  </div>
</template>

<script>
import Vue from 'vue'
import '../../assets/style/style.css'
import axios from 'axios';
import scrypt from "../../assets/js/scrypt";
import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
export default {
    data(){
        return {
            yearSelected: '',
            arrayYears: [],
            search2: '',
            roleUserLogged: '',
            menuFilterInit: false,
            dateFilterFormattedInit: '',
            dateFilterInit: '',
            dateFilterFinal: '',
            snackbar: false,
            snackbarText: '',
            snackbarColor: 'deep-purple accent-4',
            error: false,
            msgError: '',
            message: '', 
            dateFilterFormattedFinal: '',
            menuFilterFinal: false,
            totalCheckReplic: 0,
            allItems: [],
            allItems2: [],
            headers: [
                { text: 'ID Usuário', align: 'start', value: 'USUARIO_ID'},
                { text: 'Login Usuário', value: 'LOGIN_USUARIO'},
                { text: 'Data Checagem', value: 'DataChecagem' }
            ],
            items: [],
            serverIP: '',
            optionsLine: {
                width: '100%',
                tooltip: {
                    enabled: true,
                    y: {
                        formatter: function (val) {
                            return val;
                        },
                        title: {
                            formatter : function(){
                                return 'Total:'
                            } 
                        }
                    }
                },
                chart: {
                    defaultLocale: 'pt-br',
                    locales: [{
                        name: 'pt-br',
                        options: {
                            toolbar: {
                                selectionZoom: 'Selecionar Zoom',
                                zoomIn: 'Mais Zoom',
                                zoomOut: 'Reduzir Zoom',
                                pan: 'Panorâmico',
                                reset: 'Resetar Zoom',
                            }
                        }
                    }],
                    toolbar: {
                        export: {
                            csv: {
                                filename: 'Acompanhamentos por ano',
                                columnDelimiter: ';',
                                headerCategory: 'Mês',
                            },
                            svg:{
                                filename: 'Acompanhamentos por ano',
                            },
                            png:{
                                filename: 'Acompanhamentos por ano',
                            }
                        }
                    },
                },
                markers: {
                    size: [4,7],
                },
                xaxis: {
                    categories: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                }
            },
            seriesLine: [{
                name: 'Total',
                data: []
            }],
            optionsDonut: {
                colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#9C27B0', '#2E93fA', '#66DA26', '#546E7A', '#986CDF', '#FF9800', '#29D9D5', '#FFC107', '#FF0000', '#000000'],
                chart: {
                    width: '100%',
                },
                tooltip: {
                    enabled: true,
                    y: {
                        formatter: function (val) {
                            return "Replicações Checadas: " + val
                        }
                    }
                },
                show: true,
                showForZeroSeries: false,
                formatter: function (val) {
                    return val + "%"
                },
                legend:{
                    position: 'bottom'
                },
                labels: []
            },
            seriesDonut: [],

        }
    },
    created(){
        this.roleUserLogged = localStorage.getItem("roleUser")
        if(this.roleUserLogged != "M"){
            alert("Você não possui permissão para acessar esta página.\n\nVocê será direcionado para a página inicial.");
            this.$router.push({name: "Index"})
        }

        this.serverIP = scrypt.serverIP
        this.myFunction();
        if(this.allItems != null){
            this.createArrayData();
            this.initConfig();
        }
    },
    filters: {
        toDate(value){
            return value.substr(0, 10)
        }
    },
    methods: {
        initConfig(){
            var jan = 0;
            var fev = 0;
            var mar = 0;
            var abr = 0;
            var may = 0;
            var jun = 0;
            var jul = 0;
            var aug = 0;
            var set = 0;
            var out = 0;
            var nov = 0;
            var dez = 0;
            
            axios.get(`${this.serverIP}/dataReplic`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            .then(res => {
                res.data.replic.forEach(element => {
                    var monthElement = new Date(element.DataChecagem.replace("Z", "")).toLocaleDateString("pt-BR").split("/")[1]
                    var yearElement = new Date(element.DataChecagem.replace("Z", "")).toLocaleDateString("pt-BR").split("/")[2]

                    if(yearElement == this.yearSelected){
                        if(monthElement == "01"){
                            jan += 1;
                        }
                        if(monthElement == "02"){
                            fev += 1;
                        }
                        if(monthElement == "03"){
                            mar += 1;
                        }
                        if(monthElement == "04"){
                            abr += 1;
                        }
                        if(monthElement == "05"){
                            may += 1;
                        }
                        if(monthElement == "06"){
                            jun += 1;
                        }
                        if(monthElement == "07"){
                            jul += 1;
                        }
                        if(monthElement == "08"){
                            aug += 1;
                        }
                        if(monthElement == "09"){
                            set += 1;
                        }
                        if(monthElement == "10"){
                            out += 1;
                        }
                        if(monthElement == "11"){
                            nov += 1;
                        }
                        if(monthElement == "12"){
                            dez += 1;
                        }
                    }
                })
                
                var newData = [jan, fev, mar, abr, may, jun, jul, aug, set, out, nov, dez]

                this.seriesLine = [{
                    name: 'Total',
                    data: newData
                }]
            }).catch(err => {
                this.err = err.response.data.err
            })
        },
        configDataLine(yearSelected){
            var jan = 0;
            var fev = 0;
            var mar = 0;
            var abr = 0;
            var may = 0;
            var jun = 0;
            var jul = 0;
            var aug = 0;
            var set = 0;
            var out = 0;
            var nov = 0;
            var dez = 0;

            if(this.allItems != null){
                this.allItems.forEach(element => {
                    var monthElement = new Date(element.DataChecagem.replace("Z", "")).toLocaleDateString("pt-BR").split("/")[1]
                    var yearElement = new Date(element.DataChecagem.replace("Z", "")).toLocaleDateString("pt-BR").split("/")[2]

                    if(yearElement == yearSelected){
                        if(monthElement == "01"){
                            jan += 1;
                        }
                        if(monthElement == "02"){
                            fev += 1;
                        }
                        if(monthElement == "03"){
                            mar += 1;
                        }
                        if(monthElement == "04"){
                            abr += 1;
                        }
                        if(monthElement == "05"){
                            may += 1;
                        }
                        if(monthElement == "06"){
                            jun += 1;
                        }
                        if(monthElement == "07"){
                            jul += 1;
                        }
                        if(monthElement == "08"){
                            aug += 1;
                        }
                        if(monthElement == "09"){
                            set += 1;
                        }
                        if(monthElement == "10"){
                            out += 1;
                        }
                        if(monthElement == "11"){
                            nov += 1;
                        }
                        if(monthElement == "12"){
                            dez += 1;
                        }
                    }
                })
            }
            
            var newData = [jan, fev, mar, abr, may, jun, jul, aug, set, out, nov, dez]

            this.seriesLine = [{
                name: 'Total',
                data: newData
            }]
        },
        syncInfoDashboard(){
            var loginUser = document.getElementById("inputTextDashboard").value
            if(loginUser != "" && loginUser != null && loginUser != undefined){
                this.snackbarText = `${loginUser} acabou de checar a replicação.`
                this.snackbar = true;
                this.configData(true);
            }
            
        },
        createArrayData(){
            var currentYear = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10).split('-')[0]
            this.yearSelected = parseInt(currentYear)
            
            var minYear = parseInt(currentYear) - 100;
            var maxYear = parseInt(currentYear) + 100;
            for(var x = minYear; x <= maxYear; x++){
                if(this.arrayYears == []){
                    this.arrayYears = x
                } else{
                    this.arrayYears.push(x)
                }
            }
        },
        newChartLines(){
            this.optionsLine = {
                width: '100%',
                tooltip: {
                    enabled: true,
                    y: {
                        formatter: function (val) {
                            return val;
                        },
                        title: {
                            formatter : function(){
                                return 'Total:'
                            } 
                        }
                    }
                },
                chart: {
                    defaultLocale: 'pt-br',
                    locales: [{
                        name: 'pt-br',
                        options: {
                            toolbar: {
                                selectionZoom: 'Selecionar Zoom',
                                zoomIn: 'Mais Zoom',
                                zoomOut: 'Reduzir Zoom',
                                pan: 'Panorâmico',
                                reset: 'Resetar Zoom',
                            }
                        }
                    }],
                    toolbar: {
                        export: {
                            csv: {
                                filename: 'Acompanhamentos por ano',
                                columnDelimiter: ';',
                                headerCategory: 'Mês',
                            },
                            svg:{
                                filename: 'Acompanhamentos por ano',
                            },
                            png:{
                                filename: 'Acompanhamentos por ano',
                            }
                        }
                    },
                },
                markers: {
                    size: [4,7],
                },
                xaxis: {
                    categories: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                }
            }
        },
        newChart(){
            this.optionsDonut = { 
                colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#9C27B0', '#2E93fA', '#66DA26', '#546E7A', '#986CDF', '#FF9800', '#29D9D5', '#FFC107', '#FF0000', '#000000'],
                chart: {
                    width: '100%',
                },
                tooltip: {
                    enabled: true,
                    y: {
                        formatter: function (val) {
                            return "Replicações Checadas: " + val
                        }
                    }
                },
                show: true,
                showForZeroSeries: false,
                formatter: function (val) {
                    return val + "%"
                },
                legend:{
                    position: 'bottom'
                },
                labels: []
            }
        },
        clearDateFilter(){
            this.allItems = [];
            this.items = [];
            this.seriesDonut = [];
            this.newChart();
            this.totalCheckReplic = 0
            this.dateFilterInit = ''
            this.dateFilterFinal = ''
            this.dateFilterFormattedInit = ''
            this.dateFilterFormattedFinal = ''
            this.message = ''
            this.myFunction();
        },
        configData(bySocket){
            this.seriesDonut = [];
            this.seriesLine = [];
            this.optionsDonut = { labels: [] }
            this.optionsLine = { labels: [] }
            this.items = [];
            this.allItems = [];
            this.allItems2 = [];

            if(!bySocket){
                axios.get(`${this.serverIP}/dataReplic`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                })
                .then(res => {
                    this.totalCheckReplic = res.data.replic.length;
                    res.data.replic.forEach(element => {
                        var [dayIni, monthIni, yearIni] = new Date(element.DataChecagem.replace("Z", "")).toLocaleDateString("pt-BR").split("/")
                        var dateFormated = `${yearIni}-${monthIni}-${dayIni}`;
                       
                        this.allItems2.push({USUARIO_ID: element.USUARIO_ID, LOGIN_USUARIO: element.LOGIN_USUARIO, DataChecagem: element.DataChecagem.replace("Z", "")})
                            if(dateFormated >= this.dateFilterInit && dateFormated <= this.dateFilterFinal){
                                this.allItems.push({USUARIO_ID: element.USUARIO_ID, LOGIN_USUARIO: element.LOGIN_USUARIO, DataChecagem: element.DataChecagem.replace("Z", "")})
                                this.items.push({USUARIO_ID: element.USUARIO_ID, LOGIN_USUARIO: element.LOGIN_USUARIO, DataChecagem: element.DataChecagem.replace("Z", "")})
                            }
                        
                    });
                }).catch(err => {
                    this.err = err.response.data.err
                })

                axios.get(`${this.serverIP}/dataCountReplic`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    },
                    params:{
                        dataIni: this.dateFilterInit,
                        dataFim: this.dateFilterFinal,
                    }
                })
                .then(res => {
                    res.data.replic.forEach(element => {
                        this.seriesDonut.push(element.ContagemChecagem)
                        this.optionsDonut.labels.push(element.LOGIN_USUARIO)
                    });
                }).catch(err => {
                    this.err = err.response.data.err
                })
            }
            else{
                axios.get(`${this.serverIP}/dataReplic`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                })
                .then(res => {
                    this.totalCheckReplic = res.data.replic.length;
                    res.data.replic.forEach(element => {
                        var [dayIni, monthIni, yearIni] = new Date(element.DataChecagem.replace("Z", "")).toLocaleDateString("pt-BR").split("/")
                        var dateFormated = `${yearIni}-${monthIni}-${dayIni}`;
                        this.allItems2.push({USUARIO_ID: element.USUARIO_ID, LOGIN_USUARIO: element.LOGIN_USUARIO, DataChecagem: element.DataChecagem.replace("Z", "")})
                        
                        if(this.dateFilterInit != '' || this.dateFilterFinal != ''){
                            if(this.dateFilterFinal >= this.dateFilterInit){
                                if(dateFormated >= this.dateFilterInit && dateFormated <= this.dateFilterFinal){
                                    this.allItems.push({USUARIO_ID: element.USUARIO_ID, LOGIN_USUARIO: element.LOGIN_USUARIO, DataChecagem: element.DataChecagem.replace("Z", "")})
                                    this.items.push({USUARIO_ID: element.USUARIO_ID, LOGIN_USUARIO: element.LOGIN_USUARIO, DataChecagem: element.DataChecagem.replace("Z", "")})
                                }
                            }
                        }
                        else{
                            this.allItems.push({USUARIO_ID: element.USUARIO_ID, LOGIN_USUARIO: element.LOGIN_USUARIO, DataChecagem: element.DataChecagem.replace("Z", "")})
                            this.items.push({USUARIO_ID: element.USUARIO_ID, LOGIN_USUARIO: element.LOGIN_USUARIO, DataChecagem: element.DataChecagem.replace("Z", "")})
                        }
                    });
                }).catch(err => {
                    this.err = err.response.data.err
                })

                axios.get(`${this.serverIP}/dataCountReplic`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    },
                    params:{
                        dataIni: this.dateFilterInit == '' || this.dateFilterFinal == '' ? null : this.dateFilterFinal >= this.dateFilterInit ? this.dateFilterInit: null,
                        dataFim: this.dateFilterInit == '' || this.dateFilterFinal == '' ? null : this.dateFilterFinal >= this.dateFilterInit ? this.dateFilterFinal: null,
                    }
                })
                .then(res => {
                    res.data.replic.forEach(element => {
                        this.seriesDonut.push(element.ContagemChecagem)
                        this.optionsDonut.labels.push(element.LOGIN_USUARIO)
                    });
                }).catch(err => {
                    this.err = err.response.data.err
                })
            }

            if(this.allItems != null){
                this.newChart();
                this.newChartLines();
                this.initConfig();
            }
        },
        clique() {
            scrypt.clique(this);
        }, 
        filterByDate(){
            if(this.dateFilterInit == '' || this.dateFilterFinal == ''){
                this.error = true;
                this.msgError = 'Preencha os campos data inicial e final antes de filtrar';
            } else if(this.dateFilterFinal >= this.dateFilterInit){
                this.message = ''
                this.configData(false);
            } else {
                this.error = true;
                this.msgError = 'A data inicial deve ser menor ou igual a data final';
            }
        },
        filterData (value, search2) {
            return  value != null &&
                search2 != null &&
                typeof value === 'string' &&
                (value.toString().replace(".", ",").toLowerCase().indexOf(search2.toLowerCase()) !== -1 || 
                value.toString().replace(",", ".").toLowerCase().indexOf(search2.toLowerCase()) !== -1)
        },
        myFunction(){
            this.roleUserLogged = localStorage.getItem("roleUser")

            axios.get(`${this.serverIP}/dataReplic`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            .then(res => {
                this.totalCheckReplic = res.data.replic.length;
                res.data.replic.forEach(element => {
                    this.allItems.push({USUARIO_ID: element.USUARIO_ID, LOGIN_USUARIO: element.LOGIN_USUARIO, DataChecagem: element.DataChecagem.replace("Z", "")})
                    this.allItems2.push({USUARIO_ID: element.USUARIO_ID, LOGIN_USUARIO: element.LOGIN_USUARIO, DataChecagem: element.DataChecagem.replace("Z", "")})
                    this.items.push({USUARIO_ID: element.USUARIO_ID, LOGIN_USUARIO: element.LOGIN_USUARIO, DataChecagem: element.DataChecagem.replace("Z", "")})
                });
            }).catch(err => {
                this.err = err.response.data.err
            })

            axios.get(`${this.serverIP}/dataCountReplic`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                },
                params:{
                    dataIni: null,
                    dataFim: null,
                }
            })
            .then(res => {
                res.data.replic.forEach(element => {
                    this.seriesDonut.push(element.ContagemChecagem)
                    this.optionsDonut.labels.push(element.LOGIN_USUARIO)
                });
            }).catch(err => {
                this.err = err.response.data.err
            })
        },
        parseDate (date) {
            if (!date) return null

            const [day, month, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },
        formatDate (date) {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
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
    watch: {
        dateFilterInit(){
            this.dateFilterFormattedInit = this.formatDate(this.dateFilterInit);
        },
        dateFilterFinal(){
            this.dateFilterFormattedFinal = this.formatDate(this.dateFilterFinal);
        },
        yearSelected(){
          this.configDataLine(this.yearSelected)
        },
    },
}
</script>
