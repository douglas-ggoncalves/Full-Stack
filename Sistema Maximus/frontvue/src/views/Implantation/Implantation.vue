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
            <v-container fluid v-show="teste">
                <v-row justify="center">
                    <v-menu v-for="user in users" :key="user.ID_USUARIO" bottom min-width="200px" rounded offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon x-large v-on="on">
                                <v-avatar color="brown" size="48" v-if="user.IMG_USUARIO != '' &&  user.IMG_USUARIO != null">
                                    <img :src='"../../assets/img/Funcionarios/" + user.IMG_USUARIO +  ".jpg"' :alt="user.LOGIN_USUARIO">
                                </v-avatar>

                                <v-avatar size="48" v-else color="red">
                                    <span class="white--text text-h6">{{ user.LOGIN_USUARIO | reversedMessage(user.LOGIN_USUARIO) }}</span>
                                </v-avatar>
                            </v-btn>
                        </template>
                        <v-card>
                            <v-list-item-content class="justify-center">
                                <div class="mx-auto text-center">
                                    <v-avatar color="brown"  v-if="user.IMG_USUARIO != '' &&  user.IMG_USUARIO != null">
                                        <img :src='"../../assets/img/Funcionarios/" + user.IMG_USUARIO +  ".jpg"' :alt="user.LOGIN_USUARIO">
                                    </v-avatar>
                                    <v-avatar size="48" v-else color="red">
                                        <span class="white--text text-h6">{{ user.LOGIN_USUARIO | reversedMessage(user.LOGIN_USUARIO) }}</span>
                                    </v-avatar>
                                    <h3>{{ user.LOGIN_USUARIO }}</h3>
                                    <p class="text-caption mt-1">
                                        {{ user.LOGIN_USUARIO }}
                                    </p>
                                    <v-divider class="my-3"></v-divider>
                                    <v-btn depressed rounded text>
                                        Editar Conta
                                    </v-btn>
                                    <v-divider class="my-3"></v-divider>
                                    <v-btn depressed rounded text>
                                        Fechar
                                    </v-btn>
                                </div>
                            </v-list-item-content>
                        </v-card>
                    </v-menu>
                </v-row>

                <v-row>
                    <v-col class="col" :cols="12">
                        <v-card>
                            <v-card-title>
                                <v-text-field v-model="search2" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details></v-text-field>
                            </v-card-title>
                            <v-data-table :no-data-text="'Não há dados'" :no-results-text="'Nenhum resultado encontrado'" 
                            :header-props="{'sortByText': 'Ordenar por'}" :footer-props="{'items-per-page-text':'Itens por página', 
                            pageText: '{0}-{1} de {2}', 'items-per-page-all-text':'Todos'}" :headers="headers2" :items="desserts2" 
                            :search="search2">
                                <template v-slot:[`item.desc`]="{ item }">
                                    <v-tooltip :color="'rgb(0, 0, 0)'" :max-width="220" bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <span v-bind="attrs" v-on="on" style="">{{ item.desc }}</span>
                                        </template> 
                                        <span>{{ item.desc }}</span>
                                    </v-tooltip>
                                </template>

                                <template v-slot:[`item.value`]="{ item }">
                                    <span>{{ item.value | toBrl }}</span>
                                </template>

                                <template v-slot:[`item.date`]="{ item }">
                                    <span>{{ new Date(item.date.replace("-",',')).toLocaleString() | toDate }}</span>
                                </template>

                                <template v-slot:[`item.action`]="{ item }" class="text-end"> 
                                    <v-btn class="ml-auto" color="success" @click="viewItem(item)">Selecionar</v-btn>
                                </template>

                            </v-data-table>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>

            <v-container fluid v-show="!teste">
                <v-row>
                    <v-col class="text-left">
                        <v-tooltip right>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn @click="viewItem('item')" outlined v-bind="attrs" v-on="on" tile color="grey darken-3 text-white">
                                    <v-icon left>
                                        mdi-arrow-left-thick
                                    </v-icon>
                                    Voltar
                                </v-btn>
                            </template>
                                <span>Voltar para implantações</span>
                        </v-tooltip>
                    </v-col>
                </v-row>

                <v-row>
                    <h4>Maximus Gestão</h4>
                    <h5>Relatório de implantação</h5>
                </v-row>

                <v-row id="dataImplant">
                    <v-col :cols="10">
                        <h5>Dados do cliente</h5>
                    </v-col>
                    <v-col :cols="5">
                        <v-text-field label="Razão Social" :rules="rules" hide-details="auto"></v-text-field>
                    </v-col>
                    <v-col :cols="5">
                        <v-text-field label="CNPJ"></v-text-field> 
                    </v-col>

                    <v-col :cols="5">
                        <v-text-field label="Endereço"></v-text-field> 
                    </v-col>
                    
                    <v-col :cols="5">
                        <v-select :items="sistema" label="Sistema" required></v-select>
                    </v-col>

                </v-row>

                <v-row class="d-flex justify-start align-center text-left">
                    <v-col :cols="4">
                        <h5>Implantação Etapa 1</h5>
                    </v-col>
                    <v-col :cols="4">
                        <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="dateFormatted" readonly :prepend-inner-icon="'mdi-calendar'" label="Início *" 
                                hint="informe a data desejada" v-bind="attrs" @blur="editedItemdate = parseDate(dateFormatted)" v-on="on" ></v-text-field>
                            </template>
                            
                            <v-date-picker v-model="editedItemdate" no-title @input="menu1 = false" locale="pt"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col :cols="4">
                        <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="dateFormatted" readonly :prepend-inner-icon="'mdi-calendar'" label="Conclusão *" 
                                hint="informe a data desejada" v-bind="attrs" @blur="editedItemdate = parseDate(dateFormatted)" v-on="on" ></v-text-field>
                            </template>
                            
                            <v-date-picker v-model="editedItemdate" no-title @input="menu1 = false" locale="pt"></v-date-picker>
                        </v-menu>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col :cols="6">
                        <v-card class="mx-auto">
                            <v-list>
                                <v-list-item-group v-model="model" multiple>
                                    <template v-for="(item, i) in items">
                                        <v-divider v-if="!item" :key="`divider-${i}`"></v-divider>

                                        <v-list-item v-else :key="`item-${i}`" :value="item" active-class="success text-white">
                                            <template v-slot:default="{ active }">
                                                <v-list-item-action>
                                                    <v-checkbox :input-value="active" color="white"></v-checkbox>
                                                    
                                                </v-list-item-action>

                                                <v-list-item-content>
                                                    <v-list-item-title v-text="item"></v-list-item-title>
                                                    
                                                </v-list-item-content>
                                            </template>

                                            
                                        </v-list-item>
                                        
                                    </template>
                                </v-list-item-group>
                            </v-list>
                        </v-card>
                    </v-col>

                    <v-col :cols="5">

    
                        <v-switch v-model="switch1" :label="`Todos os itens foram instalados? ${switch1==false? 'Não' :'Sim'}`"></v-switch>
                        <v-textarea label="Motivo" value="" outlined v-if="!switch1"></v-textarea>
                        <v-textarea label="Motivo" :value="value" v-if="switch1" filled disabled style="width: 100%"></v-textarea>

                    </v-col>

                        
                    

                </v-row>

            </v-container>

        </div>
         
    </div>

    
</template>

<script>
import '../../assets/style/style.css'
import scrypt from "../../assets/js/scrypt";

export default {
    data(){
        return {
            items: [
        'Verificar servidor',
        'Instalação terminais',
        'Instalação certificado digital',
        'Instalação impressora',
        'Verificar conexão com matriz',
      ],
        model: ['Instalação impressora'],
switch1: true,

        sistema: ['Maximus Gestão', 'Maximus Lite'],
        teste: false,
        direction: 'bottom',
        fab: false,
        fling: false,
        hover: false,
        tabs: null,
        top: false,
        right: true,
        bottom: true,
        left: false,
        openOnHover: true,
        transition: 'scale',
      dateFormatted: this.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
      menu1: false,
      
        editedItemdate: '',
            roleUserLogged: '',
            search2: '',
            desserts2: [
                { ID_LOJA: 0, desc: 'A M LEITE', idCategory: '07.897.182/0001-94', date: '01-10-2022', value: 'Big Farma'},
                { ID_LOJA: 1, desc: 'A. C. S. GONTIJO OLIVEIRA - EIRELI', idCategory: '21.918.236/0001-81', date: '05-10-2022', value: 'Preço Popular'},
                { ID_LOJA: 2, desc: 'DAVIFARMA MEDICAMENTOS E PERFUMARIAS E COSMETICOS LTDA', idCategory: '40.930.296/0001-64', date: '01-10-2022', value: 'Davi Farma'},
                { ID_LOJA: 3, desc: 'STAR FARMA LTDA', idCategory: '34.088.313/0001-65', date: '01-11-2022', value: 'STAR FARMA'},
            ],
            headers2: [
                { text: 'Razão Social', align: 'center', value: 'desc',},
                { text: 'CNPJ', align: 'center', value: 'idCategory'},
                { text: 'Rede', align: 'center', value: 'value' , searchable: false},
                { text: 'Data Inicial', align: 'center', value: 'date' },
                { text: 'Ações', align: 'center', value: 'action', sortable: false }
            ],
            users: [
                { ID_USUARIO: 1, LOGIN_USUARIO: 'Rafael', IMG_USUARIO: 'Rafael' },
                { ID_USUARIO: 2, LOGIN_USUARIO: 'Gabriel', IMG_USUARIO: 'Gabriel' },
                { ID_USUARIO: 3, LOGIN_USUARIO: 'Jonas', IMG_USUARIO: 'Jonas' },
                { ID_USUARIO: 4, LOGIN_USUARIO: 'Gyselle', IMG_USUARIO: 'Gyselle' },
                { ID_USUARIO: 5, LOGIN_USUARIO: 'Eduardo', IMG_USUARIO: 'Eduardo' },
                { ID_USUARIO: 6, LOGIN_USUARIO: 'Maurício Xavier', IMG_USUARIO: '' },
                { ID_USUARIO: 7, LOGIN_USUARIO: 'Raynaldo Macedo', IMG_USUARIO: '' },
            ]
        }
    },
    created(){
        this.myFunction();
    },
    methods: {
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
        viewItem(item){
            console.log(item);
            this.teste = !this.teste;
        },
        formatDate (date) {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
        }
    },
    filters: {
        reversedMessage(value) {
            if(/\s/g.test(value)){ // se ter espaços
                var name = value.split(' ')[0].toUpperCase();
                var name2 = value.split(' ')[1].toUpperCase();
                return name.substr(0, 1) + name2.substr(0, 1)
            } 
            else{
                return value.substr(0, 2)
            }
        },
        toDate(value){
            return value.substr(0, 10)
        }
    },
    watch: {
        'editedItemdate'(){
            this.dateFormatted = this.formatDate(this.editedItemdate);
        }
    },
    
}
</script>