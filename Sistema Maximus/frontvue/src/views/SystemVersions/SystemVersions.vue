<template>
    <div>
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
                        <a href="#">Versões</a>
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
                <v-overlay :value="loading" absolute :z-index="9999">
                    <v-progress-circular indeterminate size="64"></v-progress-circular>
                </v-overlay>

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

                <div class="vm--overlay" style="z-index: 9999" @click="success = ''" v-if="success != ''">
                    <div class="position-fixed top-50 start-50 translate-middle p-3">
                        <div id="liveToast" class="toast show" role="alert" aria-live="assertive" aria-atomic="true" style="">
                            <div class="toast-header">
                                <img src="../../assets/img/icone_maximus_gestao.png" style="height: 30px" class="rounded img-fluid me-2" alt="...">
                                
                                <strong class="me-auto">Maximus Gestão</strong>
                                <button type="button" class="btn-close" @click="success = ''"></button>
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
                            <button class="btn btn-outline-success" type="button" @click="editVersion(null)">
                                Nova Versão
                            </button>
                        </v-col>
                        <v-col class="col" :cols="12">
                            <v-card>
                                <v-card-title>
                                    <v-text-field v-model="dataTable.search" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details></v-text-field>
                                </v-card-title>
                                
                                <v-data-table :no-data-text="'Não há dados'" :no-results-text="'Nenhum resultado encontrado'" 
                                :header-props="{'sortByText': 'Ordenar por'}" :footer-props="{'items-per-page-text':'Itens por página', 
                                pageText: '{0}-{1} de {2}', 'items-per-page-all-text':'Todos'}" :headers="dataTable.headers" :items="dataTable.items" 
                                :search="dataTable.search">
                                    <template v-slot:[`item.id`]="{ item }">
                                        <span>{{ item.id }}</span>
                                    </template>

                                    <template v-slot:[`item.dataPublicacao`]="{ item }">
                                        <span>{{ (item.dataPublicacao != null ? new Date(item.dataPublicacao).toLocaleString("pt-BR") : '') }}</span>
                                    </template>

                                    <template v-slot:[`item.qtdModificacoes`]="{ item }">
                                        <v-tooltip :color="'rgb(0, 0, 0)'" :max-width="220" bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <span v-bind="attrs" v-on="on" style="">{{ item.qtdModificacoes }}</span>
                                            </template> 
                                            <span>{{ item.qtdModificacoes }}</span>
                                        </v-tooltip>
                                    </template>

                                    <template v-slot:[`item.pdfDisponivel`]="{ item }">
                                        <v-tooltip :color="'rgb(0, 0, 0)'" :max-width="420" bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <span v-bind="attrs" v-on="on" style="">{{ (item.pdfDisponivel ? 'Sim' : 'Não') }}</span>
                                            </template> 
                                            <span>Indica se o PDF está disponível para o cliente baixar nos módulos do sistema.</span>
                                        </v-tooltip>
                                    </template>

                                    <template v-slot:[`item.action`]="{ item }"> 
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
                                                    <v-icon class="mr-2" @click="editVersion(item)"> 
                                                        mdi-calendar
                                                    </v-icon>
                                                </span>
                                            </template> 
                                            <span>Alterar Data de Publicação</span>
                                        </v-tooltip>
                                    </template>
                                </v-data-table>
                            </v-card>
                        </v-col>
                    </v-row>

                    <v-dialog transition="dialog-bottom-transition" max-width="600" v-model="dialogSuccess">
                        <template>
                            <v-card>
                                <v-toolbar color="success" dark>Maximus Farma</v-toolbar>
                                <v-card-text class="justify-center">
                                    <h3 class="pa-12">
                                        {{ msgDialog }}
                                    </h3>
                                </v-card-text>
                                <v-card-actions class="justify-end">
                                    <v-btn text @click="dialogSuccess = false">Fechar</v-btn>
                                </v-card-actions>
                            </v-card>
                        </template>
                    </v-dialog>

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

                    <v-dialog v-model="dialogEditVersion" max-width="70%">
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">Editar Dados Versão</span>
                            </v-card-title>

                            <v-card-text>
                                <v-divider/>

                                <v-container ref="pdfContainer" class="mt-5">
                                    <div @click="editVersionsModules(result)" v-for="result in filteredData" :key="result.id" style="cursor: pointer;">
                                        <span><h4 class="d-inline" style="color: rgba(0, 0, 0, 0.6); ">{{ result.idModulo | convertName }} </h4> 
                                            <v-tooltip :color="'rgb(0, 0, 0)'" :max-width="220" bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <h6 style="display: inline;color: rgba(0, 0, 0, 0.6);" class="d-inline" v-bind="attrs" v-on="on">{{ result.numeroVersao }}</h6>
                                                </template> 
                                                <span>Número da Versão</span>
                                            </v-tooltip>
                                        </span>

                                        <div>
                                            <v-tooltip :color="'rgb(0, 0, 0)'" :max-width="220" bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <span
                                                        v-on="on"
                                                        v-bind="attrs"
                                                        style="color: #757575 !important; caret-color: #757575 !important; font-size: 0.75rem !important; font-weight: 400; line-height: 1.25rem; letter-spacing: 0.0333333333em !important; font-family: 'Roboto', sans-serif !important;"
                                                    >
                                                        {{ new Date(result.dataVersao).toLocaleString('pt-BR') }}
                                                    </span>
                                                </template>
                                                <span>Data da Versão</span>
                                            </v-tooltip>
                                        </div>

                                        <br>
                                        
                                        <ul v-for="versao in result.notas" :key="versao.id" style="padding-left: 16px !important;">
                                            <li @click.stop="managementNoteVersion(versao)" style="cursor: pointer;">
                                                <v-tooltip :color="'rgb(0, 0, 0)'" :max-width="220" bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <span style="color: rgba(0, 0, 0, 0.6); font-weight: 700 !important; font-size: 1rem !important; letter-spacing: 0.009375em !important; line-height: 1.75rem; font-family: 'Roboto', sans-serif !important;" v-on="on" v-bind="attrs">{{versao.titulo}}: </span>
                                                    </template>
                                                    <span>Título da Modificação</span>
                                                </v-tooltip>

                                                <v-tooltip :color="'rgb(0, 0, 0)'" bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <span class="subtitle-2" v-html="versao.descricao" v-on="on" v-bind="attrs"></span>
                                                    </template>
                                                    <span>Descrição da Modificação</span>
                                                </v-tooltip>
                                            </li>
                                        </ul>

                                        <v-divider/> 
                                    </div>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="dialogEditVersion = false">
                                    Fechar
                                </v-btn>

                                <template>
                                    <v-menu offset-y>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn color="blue darken-1" text v-bind="attrs" v-on="on" >
                                                Opções de PDF
                                            </v-btn>
                                        </template>

                                        <v-list>
                                            <v-list-item @click="gerarPdf()" v-if="filteredData.length > 0">
                                                <v-list-item-title>Gerar PDF</v-list-item-title>
                                            </v-list-item>
                                            <v-list-item @click="removePDF()" v-if="filteredData.length > 0">
                                                <v-list-item-title>Remover PDF Gerado</v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </template>

                                <template>
                                    <v-menu offset-y>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn color="blue darken-1" text v-bind="attrs" v-on="on">
                                                Adicionar
                                            </v-btn>
                                        </template>

                                        <v-list>
                                            <v-list-item @click="editVersionsModules(null)">
                                                <v-list-item-title>Criar nova Versão/Módulo</v-list-item-title>
                                            </v-list-item>
                                            <v-list-item @click="managementNoteVersion(null)" v-if="filteredData.length > 0">
                                                <v-list-item-title>Criar nova Nota</v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </template>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="dialogVueVersions" max-width="70%">
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ textTitleVersion }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="3">
                                            Data de Publicação
                                            <date-picker class="d-block w-100" format="DD-MM-YYYY HH:mm:ss" show-hour show-minute  v-model="versionSelected.dataPublicacao" show-second type="datetime"></date-picker>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="dialogVueVersions = false">
                                    Fechar
                                </v-btn>

                                <v-btn color="blue darken-1" text @click="saveVersion()">
                                    Salvar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="dialogVueVersionsModules" max-width="70%">
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ textTitleVersionModule }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="3">
                                            <v-text-field counter :maxlength="20" label="Número Versão" required v-model="versionModuleSelected.numeroVersao"></v-text-field>
                                        </v-col>
                                        
                                        <v-col cols="3">
                                            Data Versão
                                            <date-picker class="d-block w-100" format="DD-MM-YYYY HH:mm:ss" show-hour show-minute show-second v-model="versionModuleSelected.dataVersao" type="datetime"></date-picker>
                                        </v-col>

                                        <v-col cols="12">
                                            Selecione o Módulo
                                            <multiselect v-model="moduleSelected" :preselect-first="true" deselect-label="Remover opção" selectLabel="Selecionar essa opção" selectedLabel="Opção selecionada" 
                                                placeholder="Selecione um Módulo" :options="modules" :searchable="false" :allow-empty="true"
                                                label="DESC_MODULE" track-by="ID_MODULE" >
                                                    {{ modules }}
                                            </multiselect>
                                        </v-col>

                                        <div style="height: 100px;"></div>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-btn color="red darken-1" text @click="removeVersionModule()" v-if="!this.newVersionModule">
                                    Excluir
                                </v-btn>

                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="dialogVueVersionsModules = false">
                                    Fechar
                                </v-btn>

                                <v-btn color="blue darken-1" text @click="saveVersionModule()">
                                    Salvar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="dialogVueNotesVersions" max-width="70%">
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ textTitleNoteVersion }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12">
                                            Selecione o Módulo
                                            <multiselect
                                                label="idModulo"
                                                :searchable="false"
                                                track-by="idModulo"
                                                :allow-empty="true"
                                                :options="filteredData"
                                                :preselect-first="false"
                                                deselect-label="Remover opção"
                                                placeholder="Selecione um Módulo"
                                                selected-label="Opção selecionada"
                                                v-model="noteVersionModuleSelected"
                                                select-label="Selecionar essa opção"
                                            >
                                                <!-- Customiza a exibição na lista suspensa -->
                                                <template #option="{ option }">
                                                    <span>{{ option.idModulo | convertName }} ({{ option.numeroVersao }})</span>
                                                </template>

                                                <!-- Customiza a exibição após selecionar -->
                                                <template #singleLabel="{ option }">
                                                    <span>{{ option.idModulo | convertName }} ({{ option.numeroVersao }})</span>
                                                </template>
                                            </multiselect>

                                        </v-col>

                                        <v-col cols="12">
                                            <v-text-field label="Título" required v-model="noteVersionSelected.titulo"></v-text-field>
                                        </v-col>
                                        
                                        <v-col cols="12">
                                            <vue-editor
                                                v-model="noteVersionSelected.descricao"
                                                :editorToolbar="[
                                                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                                                    ['bold', 'italic', 'underline', 'strike'],
                                                    ['blockquote', 'code-block'],
                                                    [{ list: 'ordered' }, { list: 'bullet' }],
                                                    [{ script: 'sub' }, { script: 'super' }],
                                                    [{ indent: '-1' }, { indent: '+1' }],
                                                    [{ color: [] }, { background: [] }],
                                                    [{ align: [] }]
                                                ]"
                                                :editorOptions="{
                                                    placeholder: 'Digite sua descrição aqui...',
                                                    formats: ['bold', 'italic', 'underline', 'strike', 'color', 'background', 'script', 'align']
                                                }"
                                            />
                                        </v-col>

                                        <v-divider/>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-btn color="red darken-1" text @click="removeNoteVersion()" v-if="!this.newNoteVersion">
                                    Excluir
                                </v-btn>

                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="dialogVueNotesVersions = false">
                                    Fechar
                                </v-btn>

                                <v-btn color="blue darken-1" text @click="saveNoteVersion()">
                                    Salvar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="dialogInfoVersion" max-width="600px">
                        <v-card>
                            <v-card-title class="pb-0">
                                <span class="text-h5 mx-auto">Info Versão</span>
                            </v-card-title>

                            <v-divider class="mx-auto" style="width: 70%"></v-divider>

                            <v-card-text v-for="(item, index) in itemsFiltered" :key="index">
                                <v-timeline align-top dense>
                                    <v-timeline-item :color="item.DataVendaEnviada != null && item.DataCatalogoEnviado != null ? 'success' : 'red lighten-1'" small>
                                        <v-row class="pt-1">
                                            <v-col class="pt-0" cols="3">
                                                <strong>{{ item.DataVendaEnviada != null ? new Date(item.DataVendaEnviada).toLocaleString("pt-BR") : new Date(item.DataCatalogoEnviado).toLocaleString("pt-BR") }}</strong>
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
                                <v-btn color="blue darken-1" text @click="dialogInfoVersion = false">
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
import Vue from 'vue';
import axios from 'axios';
import html2pdf from "html2pdf.js";
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/pt-br';
import '../../assets/style/style.css';
import DatePicker from 'vue2-datepicker';
import scrypt from "../../assets/js/scrypt";

export default {
    components: { DatePicker },
    data(){
        return {
            err: '',
            msgError: '',
            versionChanged: false,
            loading: false,
            noteVersionChanged: false,
            versionModuleChanged: false,
            error: false,
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
            resultadoAgrupado: [],
            msgDialog: '',
            itemsDetailed: [],
            itemsFiltered: [],
            roleUserLogged: '',
            success: '',
            dialogVueNotesVersions: false,
            dialogVueVersions: false,
            dialogVueVersionsModules: false,
            dialogSuccess: false,
            menuFilterInit: false,
            dialogInfoVersion: false,
            dialogEditVersion: false,
            filteredData: [],
            dateFilterFormattedInit: '',
            dataTable: {
                serverIP: '',
                search: '',
                headers: [
                    { text: 'ID', align: 'center', value: 'id' },
                    { text: 'Data Publicação', align: 'center', value: 'dataPublicacao',},
                    { text: 'Qtd. Módulos Atualizados', align: 'center', value: 'qtdModificacoes'},
                    { text: 'PDF Disponível', align: 'center', value: 'pdfDisponivel'},
                    { text: 'Ações', align: 'center', value: 'action', sortable: false }
                ],
                items: [
                    
                ],
            },
            noteVersionSelected: {
                id: null, 
                titulo: "", 
                descricao: "", 
                idVersaoModulo: null
            },
            versionModuleSelected: {
                id: null, 
                idModulo: null,
                numeroVersao: "",
                dataVersao: null,
                idVersao: null,
            },
            versionSelected: {
                id: null, 
                dataPublicacao: null,
                qtdModificacoes: 0
            },
            moduleSelected: 
            {
                ID_MODULE: 0,
                DESC_MODULE: ''
            },
            textTitleVersion: "",
            textTitleVersionModule: "",
            newVersionModule: false,
            noteVersionModuleSelected: null,
            newVersion: false,
            newNoteVersion: false,
            textTitleNoteVersion: "",
        }
    },
    created(){
        this.serverIP = scrypt.serverIP;

        let roleUser = localStorage.getItem("roleUser");
        if(roleUser == "R"){
            alert("Você não possui permissão para acessar esta página.\n\nVocê será direcionado para a página inicial.");
            this.$router.push({name: "Index"})
        }

        this.getData();
    },
    methods: {
        gerarPdf() {
           if(confirm("Deseja realmente Gerar o PDF ?")){
                this.loading = true;
                const element = this.$refs.pdfContainer;

                html2pdf()
                    .from(element)
                    .output('datauristring')
                    .then(dataUri => {
                    const base64 = dataUri.split(',')[1];

                    axios.put(`${this.serverIP}/versoes/${this.versionSelected.id}`, { base64 })
                    .then(res => {
                        this.loading = false;
                        this.success = res.data.success;
                        this.getData();
                    }).catch(err => {
                        this.loading = false;
                        this.err = err.response.data.err;
                    })
                });
            }
        },
        removePDF() {
           if(confirm("Deseja realmente remover o PDF ?")){
                this.loading = true;
                const base64 = '';

                axios.put(`${this.serverIP}/versoes/${this.versionSelected.id}`, { base64 })
                .then(res => {
                    this.loading = false;
                    this.success = res.data.success;
                    this.getData();
                }).catch(err => {
                    this.loading = false;
                    this.err = err.response.data.err;
                })
            }
        },
        clique() {
            scrypt.clique(this);
        }, 
        editVersion(version){
            this.newVersion = version == null;
            this.textTitleVersion = this.newVersion ? "Nova Versão" : "Editar Versão";
            if(version){
                this.versionSelected = version;
                this.versionSelected.dataPublicacao = version.dataPublicacao ? new Date(version.dataPublicacao) : null;
            }
            else{
                this.versionSelected = {
                    id: null, 
                    dataPublicacao: null,
                    qtdModificacoes: 0
                };
            }
            this.dialogVueVersions = true;
        }, 
        editVersionsModules(versionModule){
            this.newVersionModule = versionModule == null;
            this.textTitleVersionModule = this.newVersionModule ? `Nova Versão/Módulo`  : "Editar Versão/Módulo";
            if(versionModule){
                this.versionModuleSelected = versionModule;
            }
            else{
                this.versionModuleSelected = {
                    id: null, 
                    idModulo: null,
                    numeroVersao: "",
                    dataVersao: null
                }
            }

            this.versionModuleSelected.dataVersao = this.versionModuleSelected.dataVersao ? new Date(this.versionModuleSelected.dataVersao) : null;
            this.moduleSelected = versionModule?.idModulo ? this.modules.find(c => c.ID_MODULE == versionModule.idModulo) : null;
            this.dialogVueVersionsModules = true;
        }, 
        managementNoteVersion(noteVersion){
            this.newNoteVersion = noteVersion == null;
            this.textTitleNoteVersion = this.newNoteVersion ? "Nova Nota" : "Editar Nota";
            
            if(noteVersion){
                this.noteVersionSelected = noteVersion;
                this.noteVersionModuleSelected = this.filteredData.find(c => c.id == noteVersion.idVersaoModulo);
            }
            else{
                this.noteVersionSelected = {
                    id: null, 
                    titulo: "", 
                    descricao: "", 
                    idVersaoModulo: null
                }
            }
            this.dialogVueNotesVersions = true;
        },
        removeVersionModule(){
           if (confirm("Deseja realmente remover? Todas as notas associadas a esta versão/módulo serão excluídas.")) {
               this.loading = true;

                this.versionModuleChanged = true;
                axios.delete(`${this.serverIP}/versoesModulos/${this.versionModuleSelected.id}`, {})
                .then(res => {
                    this.dialogVueVersionsModules = false
                    this.loading = false;
                    this.success = res.data.success;
                }).catch(err => {
                    this.loading = false;
                    this.err = err.response.data.err;
                })
            }
        },
        saveVersionModule(){
            this.loading = true;

            let obj = {
                idModulo : this.moduleSelected.ID_MODULE, 
                numeroVersao : this.versionModuleSelected.numeroVersao, 
                dataVersao : this.versionModuleSelected.dataVersao ? this.formatLocalDate(this.versionModuleSelected.dataVersao) : null,
                idVersao : this.versionSelected.id
            };

            this.versionModuleChanged = true;
            if(this.newVersionModule){
                axios.post(`${this.serverIP}/versoesModulos`, obj)
                    .then(res => {
                        this.loading = false;
                        this.success = res.data.success;
                        this.dialogVueVersionsModules = false;
                    }).catch(err => {
                        this.loading = false;
                        this.err = err.response.data.err;
                    })
            }
            else{
                axios.patch(`${this.serverIP}/versoesModulos/${this.versionModuleSelected.id}`, obj)
                    .then(res => {
                        this.loading = false;
                        this.success = res.data.success;
                        this.dialogVueVersionsModules = false;
                    }).catch(err => {
                        this.loading = false;
                        this.err = err.response.data.err;
                    })
            }
        },
        saveVersion(){
            this.loading = true; 

            let obj = {
                dataPublicacao : this.versionSelected.dataPublicacao ? this.formatLocalDate(this.versionSelected.dataPublicacao) : null
            };
    
            this.versionChanged = true;
            if(this.newVersion){
                axios.post(`${this.serverIP}/versoes`, obj)
                    .then(res => {
                        this.loading = false;
                        this.dialogVueVersions = false;
                        this.success = res.data.success;
                        this.getData();
                    }).catch(err => {
                        this.err = err.response.data.err
                    })
            }
            else{
                axios.patch(`${this.serverIP}/versoes/${this.versionSelected.id}`, obj)
                    .then(res => {
                        this.loading = false;
                        this.dialogVueVersions = false;
                        this.success = res.data.success;
                        this.getData();
                    }).catch(err => {
                        this.err = err.response.data.err;
                    })
            }
        },
        saveNoteVersion(){
            this.loading = true; 

            let obj = {
                titulo : this.noteVersionSelected.titulo, 
                descricao : this.noteVersionSelected.descricao, 
                idVersaoModulo : this.noteVersionModuleSelected.id
            };

            this.noteVersionChanged = true;
            if(this.newNoteVersion){
                axios.post(`${this.serverIP}/notasVersoes`, obj)
                    .then(res => {
                        this.loading = false;
                        this.dialogVueNotesVersions = false;
                        this.success = res.data.success;
                    }).catch(err => {
                        this.err = err.response.data.err
                    })
            }
            else{
                axios.patch(`${this.serverIP}/notasVersoes/${this.noteVersionSelected.id}`, obj)
                    .then(res => {
                        this.loading = false;
                        this.dialogVueNotesVersions = false;
                        this.success = res.data.success;
                    }).catch(err => {
                        this.err = err.response.data.err;
                    })
            }
        },
        removeNoteVersion(){
            this.loading = true; 

            axios.delete(`${this.serverIP}/notasVersoes/${this.noteVersionSelected.id}`, {})
                .then(res => {
                    this.loading = false;
                    this.success = res.data.success;
                    this.dialogVueNotesVersions = false;
                }).catch(err => {
                    this.err = err.response.data.err;
                })
        },
        formatLocalDate(date) {
            const pad = n => String(n).padStart(2, '0');

            const ano = date.getFullYear();
            const mes = pad(date.getMonth() + 1);
            const dia = pad(date.getDate());
            const hora = pad(date.getHours());
            const minuto = pad(date.getMinutes());
            const segundo = pad(date.getSeconds());

            return `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}`;
        },
        modalEdit(item){
            let objFiltered = this.resultadoAgrupado.find(c => c.idVersao == item.id)
            this.versionSelected.id = item.id;
            this.versionSelected.qtdModificacoes = item.qtdModificacoes;
            this.versionSelected.dataPublicacao = item.dataPublicacao;
            this.filteredData = objFiltered?.versoes ?? [];
            this.dialogEditVersion = true;
        },
        infoNetwork(item){
            this.itemsFiltered = this.itemsDetailed.filter(element => element.qtdModificacoes == item.qtdModificacoes);
            this.dialogInfoVersion = true;
        },
        refreshVersionSelectedData(){
            if(this.versionSelected){
                this.modalEdit(this.versionSelected);
            }
        },
        getData(callback){
            this.roleUserLogged = localStorage.getItem("roleUser");
            this.versionChanged = false;
            this.resultadoAgrupado = [];
            this.loading = true;

            axios.get(`${this.serverIP}/versoes`, {})
                .then(res => {
                    res.data.arrayVersoes.forEach((versao, index) => {
                        let id = versao.ID;
                        let qtdModificacoes = versao.QtdModificacoes;
                        let pdfDisponivel = versao.PdfDisponivel;
                        let dataPublicacao = versao.DataPublicacao != null ? versao.DataPublicacao.replace("Z", "") : null;

                        let item = {
                            id,
                            pdfDisponivel,
                            dataPublicacao,
                            qtdModificacoes
                        };

                        Vue.set(this.dataTable.items, index, item);
                        Vue.set(this.itemsDetailed, index, item);
                    });
                    const agrupadoFinal = [];

                    res.data.versoesModulos.forEach(versaoModulo => {
                        const idModulo = versaoModulo.IdModulo;
                        const id = versaoModulo.ID;
                        const numeroVersao = versaoModulo.NumeroVersao;
                        const dataVersao = versaoModulo.DataVersao ? versaoModulo.DataVersao.replace("Z", "") : null;
                        const idVersao = versaoModulo.IdVersao;

                        // ⚠️ Se não tiver um IdVersao, não podemos agrupar
                        if (!idVersao) return;

                        // Buscar todas as notas relacionadas a esse versaoModulo
                        const notasRelacionadas = res.data.notasVersoes.filter(nota => nota.IdVersaoModulo === id);

                        const versaoObj = {
                            id,
                            idModulo,
                            numeroVersao,
                            dataVersao,
                            idVersao,
                            notas: notasRelacionadas.map(nota => ({
                                id: nota.ID,
                                titulo: nota.Titulo,
                                descricao: nota.Descricao,
                                numeroVersao,
                                idModulo,
                                idVersao: nota.IdVersao,
                                idVersaoModulo: nota.IdVersaoModulo
                            }))
                        };

                        // Agrupar por idVersao
                        let grupo = agrupadoFinal.find(g => g.idVersao === idVersao);
                        if (!grupo) {
                            grupo = {
                                idVersao: idVersao,
                                versoes: []
                            };
                            agrupadoFinal.push(grupo);
                        }

                        grupo.versoes.push(versaoObj);
                    });

                    this.loading = false;
                    this.resultadoAgrupado = agrupadoFinal;
                    if (callback) callback(); // <- chama a função após finalizar
                }).catch(err => {
                    this.loading = false;
                    this.err = err.response.data.err;
                }
            )
        },
        logout(){
           if(confirm("Deseja sair?")){
                localStorage.removeItem("token");
                localStorage.removeItem("roleUser");
                localStorage.removeItem("redeIdUser");
                localStorage.removeItem("loginUser");
                localStorage.removeItem("idUser");
                this.$router.push({name: "Home"});
           }
        },
        parseDate (date) {
            if (!date) return null

            const [day, month, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        }
    },
    filters: {
        convertName(value){
            return value == 1 ? "Maximus Lite" : value == 2 ? "Módulo Administrativo" :
            value == 3 ? "Módulo Balcão" : value == 4 ? "Módulo Caixa" : value
        }
    },
    watch: {
        dialogVueVersions(newValue) {
            if (!newValue && this.versionChanged) {
                this.getData();
            }
        },
        dialogVueVersionsModules(newValue) {
            if (!newValue && this.versionModuleChanged) {
                this.getData(() => {
                    this.refreshVersionSelectedData();
                });
            }
        },
        dialogVueNotesVersions(newValue) {
            if (!newValue && this.noteVersionChanged) {
                this.getData(() => {
                    this.refreshVersionSelectedData();
                });
            }
        }
    }
}
</script>

<style scoped>
    .changelog-html p {
        margin: 0 0 0.5em 0;
        color: #444;
        font-size: 0.95rem;
    }
</style>