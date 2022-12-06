<template>
    <div class="wrapper">
        <nav id="sidebar">
            <ul class="list-unstyled components">
                <div class="sidebar-header">
                    <img class="img-fluid" src="../../assets/img/logo-white.png">
                    <hr>
                </div>

                <li v-if="roleUserLogged == 'M' || roleUserLogged == 'A'">
                    <a href="#">Acessos</a>
                </li>

                <li v-if="roleUserLogged == 'M' || roleUserLogged == 'A'">
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

                <v-snackbar style="z-index: 99999" v-model="snackbar" timeout="3000" :color="snackbarColor" absolute top right elevation="24">
                    <strong>{{ snackbarText }}</strong>

                    <template v-slot:action="{ attrs }">
                        <v-btn color="White" text v-bind="attrs" @click="snackbar = false">Fechar</v-btn>
                    </template>
                </v-snackbar>

                <v-tooltip :color="'rgb(0, 0, 0)'" top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="black" outlined v-bind="attrs" v-on="on" style="text-transform: none" @click="myFunction(true)">
                            Atualizar
                        </v-btn>
                    </template>
                    <span>Atualizar os dados da página</span>
                </v-tooltip>

                <v-dialog v-model="dialogFullScreen" class="w-100" fullscreen hide-overlay transition="dialog-bottom-transition">
                    <v-card>
                        <v-toolbar dark color="primary">
                            <v-btn icon dark @click="dialogFullScreen = false">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                            <v-toolbar-title>{{ networkSelected.NOME_REDE }}</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-toolbar-items>
                                <v-btn dark text @click="dialogFullScreen = false">Fechar</v-btn>
                            </v-toolbar-items>
                        </v-toolbar>
                        
                        <v-card-text>
                            <v-container>
                                <v-row class="mt-5">
                                    <span class="text-h5">Dados da Rede</span>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="4">
                                        <v-text-field label="Nome da rede" v-model="networkSelected.NOME_REDE" required></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="4">
                                        <v-text-field label="Login do radmin" v-model="networkSelected.RADMIN_NOMEREDE" required></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="4">
                                        <v-text-field label="Senha do radmin" v-model="networkSelected.RADMIN_SENHAREDE" required></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="4">
                                        <v-select :items="['Sim', 'Não']" v-model="networkSelected.REDE_REPLICA" label="Rede replica" required ></v-select>
                                    </v-col>

                                    <v-col cols="12" sm="4">
                                        <v-select :items="['Sim', 'Não']" v-model="networkSelected.ISATIVA" label="Loja Ativa" required ></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="4" style="margin-top: 14px">
                                        <v-btn color="success" @click="editNetwork(false)">
                                            Alterar
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    
                        <v-divider></v-divider>
                        
                        <v-card-text>
                            <v-container>
                                <v-row class="" justify="center">
                                    <v-col :cols="12">
                                        <div style="float: left; padding-top: 20px">
                                            <span class="text-h5">Lojas</span>
                                        </div>
                                        
                                        <v-sheet style="float: right" class="px-5 d-inline-block">
                                            <v-switch v-model="switchMode" inset :label="`Modo ${switchMode ? 'Tabela': 'Painéis'}`" ></v-switch>
                                        </v-sheet>
                                    </v-col>
                                </v-row>
                                <v-row justify="center">
                                    <v-col :cols="12" v-if="!switchMode">
                                        <v-expansion-panels popout>
                                            <v-expansion-panel v-for="item in storesFiltered" :key="item.ID_LOJA">
                                                <v-expansion-panel-header @click="alterDataStore(item)">{{ item.NUMERO_LOJA | convertName }}</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-card-text>
                                                        <v-container>
                                                            <v-row class="mt-5">
                                                                <span class="text-h5">Dados da Loja</span>
                                                            </v-row>
                                                            <v-row>
                                                                <v-col cols="12" sm="6">
                                                                    <v-text-field min="0" max="30" label="Número da Loja" type="number" v-model="storeSelected.NUMERO_LOJA" ></v-text-field>
                                                                </v-col>

                                                                <v-col cols="12" sm="6">
                                                                    <v-text-field label="Nome da Loja" v-model="storeSelected.NOME_LOJA"></v-text-field>
                                                                </v-col>

                                                                <v-col cols="12" sm="6">
                                                                    <v-text-field label="IP da Loja" v-model="storeSelected.IP_LOJA" @keyup="numbersAndPoints()"></v-text-field>
                                                                </v-col>

                                                                <v-col cols="12" sm="6">
                                                                    <v-select v-model="storeSelected.REDEID" :items="nameNetworks" label="Rede da Loja" ></v-select>
                                                                </v-col>

                                                                <v-col cols="12" sm="6">
                                                                    <v-text-field label="Porta da Loja" v-model="storeSelected.PORTA_LOJA" counter="4" maxlength="4" @keyup="onlyNumbers()"></v-text-field>
                                                                </v-col>

                                                                <v-col cols="12" sm="6">
                                                                    <v-select :items="['Maximus Gestão', 'Maximus Lite']" v-model="storeSelected.SISTEMA_LOJA" label="Sistema da Loja" ></v-select>
                                                                </v-col>

                                                                <v-col cols="12" sm="6">
                                                                    <v-text-field label="Login do Banco" v-model="storeSelected.LOGIN_LOJA" counter="2" maxlength="2"></v-text-field>
                                                                </v-col>
                                                                
                                                                <v-col cols="12" sm="6">
                                                                    <v-text-field label="Senha do Banco" v-model="storeSelected.SENHA_LOJA"></v-text-field>
                                                                </v-col>
                                                                
                                                                <v-col cols="12">
                                                                    <v-text-field label="Razão Social" v-model="storeSelected.RAZAO_LOJA"></v-text-field>
                                                                </v-col>
                                                                
                                                                <v-col cols="12" sm="6">
                                                                    <v-text-field label="CNPJ" v-model="storeSelected.CNPJ_LOJA" counter="18" maxlength="18"></v-text-field>
                                                                </v-col>

                                                                <v-col cols="12" sm="6">
                                                                    <v-text-field label="Endereço" v-model="storeSelected.ENDERECO_LOJA"></v-text-field>
                                                                </v-col>

                                                                <v-col cols="12" sm="6">
                                                                    <v-text-field label="Acesso RustDesk" v-model="storeSelected.ACESSOREMOTO"></v-text-field>
                                                                </v-col>

                                                                <v-col cols="12" sm="6">
                                                                    <v-text-field label="Senha RustDesk" v-model="storeSelected.SENHAACESSOREMOTO"></v-text-field>
                                                                </v-col>

                                                                <v-col cols="12" sm="4" style="margin-top: 14px">
                                                                    <v-btn color="success" @click="editNetwork(true)">
                                                                        Alterar
                                                                    </v-btn>
                                                                </v-col>
                                                            </v-row>
                                                        </v-container>
                                                    </v-card-text>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                    </v-col>

                                    <v-col :cols="12" v-else>
                                        <v-card>
                                            <v-card-title>
                                                <v-text-field v-model="dataTableStores.search" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details></v-text-field>
                                            </v-card-title>
                                            <v-data-table :no-data-text="'Não há dados'" :no-results-text="'Nenhum resultado encontrado'" 
                                            :header-props="{'sortByText': 'Ordenar por'}" :footer-props="{'items-per-page-text':'Itens por página', 
                                            pageText: '{0}-{1} de {2}', 'items-per-page-all-text':'Todos'}" :headers="dataTableStores.headers" :items="storesFiltered" 
                                            :search="dataTableStores.search" :item-key="'ID_LOJA'">

                                                <template v-slot:[`item.NOME_REDE`]="{ item }">
                                                    <span>
                                                        {{ item.NOME_REDE }}
                                                    </span>
                                                </template>

                                                <template v-slot:[`item.NUMERO_LOJA`]="{ item }">
                                                    <span>
                                                        {{ item.NUMERO_LOJA | convertName }}
                                                    </span>
                                                </template>

                                                <template v-slot:[`item.RADMIN_NOMEREDE`]="{ item }">
                                                    <v-tooltip :color="'rgb(0, 0, 0)'" v-if="item.RADMIN_NOMEREDE" bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-btn text color="primary" v-bind="attrs" v-on="on" style="text-transform: none" @click="copyText(item.RADMIN_NOMEREDE, 'Nome da Rede')">
                                                                {{ item.RADMIN_NOMEREDE }}
                                                            </v-btn>
                                                        </template>
                                                        <span>Copiar</span>
                                                    </v-tooltip>
                                                </template>

                                                <template v-slot:[`item.RADMIN_SENHAREDE`]="{ item }">
                                                    <v-tooltip :color="'rgb(0, 0, 0)'" v-if="item.RADMIN_SENHAREDE" bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-btn text color="primary" v-bind="attrs" v-on="on" style="text-transform: none" @click="copyText(item.RADMIN_SENHAREDE, 'Senha', true)">
                                                                {{ item.RADMIN_SENHAREDE }}
                                                            </v-btn>
                                                        </template>
                                                        <span>Copiar</span>
                                                    </v-tooltip>
                                                </template>

                                                <template v-slot:[`item.IP_LOJA`]="{ item }">
                                                    <v-tooltip :color="'rgb(0, 0, 0)'" v-if="item.IP_LOJA" bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-btn text color="primary" v-bind="attrs" v-on="on" style="text-transform: none" @click="copyText(item.IP_LOJA, 'IP da Loja')">
                                                                {{ item.IP_LOJA }}
                                                            </v-btn>
                                                        </template>
                                                        <span>Copiar</span>
                                                    </v-tooltip>
                                                </template>
                                                
                                                <template v-slot:[`item.ACESSOREMOTO`]="{ item }">
                                                    <v-tooltip :color="'rgb(0, 0, 0)'" v-if="item.ACESSOREMOTO" bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-btn text color="primary" v-bind="attrs" v-on="on" style="text-transform: none" @click="copyText(item.ACESSOREMOTO, 'Acesso')">
                                                                {{ item.ACESSOREMOTO }}
                                                            </v-btn>
                                                        </template>
                                                        <span>Copiar</span>
                                                    </v-tooltip>
                                                </template>

                                                <template v-slot:[`item.SENHAACESSOREMOTO`]="{ item }">
                                                    <v-tooltip :color="'rgb(0, 0, 0)'" v-if="item.SENHAACESSOREMOTO" bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-btn text color="primary" v-bind="attrs" v-on="on" style="text-transform: none" @click="copyText(item.SENHAACESSOREMOTO, 'Senha', true)">
                                                                {{ item.SENHAACESSOREMOTO }}
                                                            </v-btn>
                                                        </template>
                                                        <span>Copiar</span>
                                                    </v-tooltip>
                                                </template>
                      
                                                <template v-slot:[`item.action`]="{ item }" class="text-end"> 
                                                    <v-tooltip :color="'rgb(0, 0, 0)'" :max-width="220" bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <span v-bind="attrs" v-on="on" style="">
                                                                <v-icon class="mr-2" @click="modalEditStore(item)">
                                                                    mdi-pencil
                                                                </v-icon>
                                                            </span>
                                                        </template> 
                                                        <span>Editar</span>
                                                    </v-tooltip>
                                                </template>
                                            </v-data-table>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-dialog>

                <v-dialog v-model="dialogNewStore" max-width="600px">
                    <v-card ref="form">
                        <v-card-title>
                            <span class="text-h5">Cadastrar Loja</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6">
                                        <v-text-field min="0" max="30" label="Número da Loja *" type="number" v-model="newStore.NUMERO_LOJA" ></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Nome da Loja *" v-model="newStore.NOME_LOJA"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-text-field label="IP da Loja" v-model="newStore.IP_LOJA" @keyup="numbersAndPoints2()"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-select v-model="newStore.REDEID" :items="nameNetworks" label="Rede da Loja *" ></v-select>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Porta da Loja" v-model="newStore.PORTA_LOJA" counter="4" maxlength="4" @keyup="onlyNumbers()"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-select :items="['Maximus Gestão', 'Maximus Lite']" v-model="newStore.SISTEMA_LOJA" label="Sistema da Loja" ></v-select>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Login do Banco" v-model="newStore.LOGIN_LOJA" counter="2" maxlength="2"></v-text-field>
                                    </v-col>
                                    
                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Senha do Banco" v-model="newStore.SENHA_LOJA"></v-text-field>
                                    </v-col>
                                    
                                    <v-col cols="12">
                                        <v-text-field label="Razão Social" v-model="newStore.RAZAO_LOJA"></v-text-field>
                                    </v-col>
                                    
                                    <v-col cols="12" sm="6">
                                        <v-text-field label="CNPJ" v-model="newStore.CNPJ_LOJA" counter="18" maxlength="18"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Endereço" v-model="newStore.ENDERECO_LOJA"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Acesso RustDesk" v-model="newStore.ACESSOREMOTO"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Senha RustDesk" v-model="newStore.SENHAACESSOREMOTO"></v-text-field>
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
                            <v-btn color="blue darken-1" text @click="saveStore()">
                                Salvar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-dialog v-model="dialogNewNetwork" max-width="600px">
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
                                        <v-select :items="['Sim', 'Não']" v-model="newNetwork.ISATIVA" label="Rede Ativa" required ></v-select>
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
                            <v-btn color="blue darken-1" text @click="editNetwork(true)">
                                Salvar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-dialog v-model="dialogEditStore" max-width="600px">
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">Editar Loja</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6">
                                        <v-text-field min="0" max="30" label="Número da Loja" type="number" v-model="storeSelected.NUMERO_LOJA" ></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Nome da Loja" v-model="storeSelected.NOME_LOJA"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-text-field label="IP da Loja" v-model="storeSelected.IP_LOJA" @keyup="numbersAndPoints()"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-select v-model="storeSelected.REDEID" :items="nameNetworks" label="Rede da Loja" ></v-select>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Porta da Loja" v-model="storeSelected.PORTA_LOJA" counter="4" maxlength="4" @keyup="onlyNumbers()"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-select :items="['Maximus Gestão', 'Maximus Lite']" v-model="storeSelected.SISTEMA_LOJA" label="Sistema da Loja" ></v-select>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Login do Banco" v-model="storeSelected.LOGIN_LOJA" counter="2" maxlength="2"></v-text-field>
                                    </v-col>
                                    
                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Senha do Banco" v-model="storeSelected.SENHA_LOJA"></v-text-field>
                                    </v-col>
                                    
                                    <v-col cols="12">
                                        <v-text-field label="Razão Social" v-model="storeSelected.RAZAO_LOJA"></v-text-field>
                                    </v-col>
                                    
                                    <v-col cols="12" sm="6">
                                        <v-text-field label="CNPJ" v-model="storeSelected.CNPJ_LOJA" counter="18" maxlength="18"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Endereço" v-model="storeSelected.ENDERECO_LOJA"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Acesso RustDesk" v-model="storeSelected.ACESSOREMOTO"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Senha RustDesk" v-model="storeSelected.SENHAACESSOREMOTO"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="dialogEditStore = false">
                                Fechar
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="editStore()">
                                Salvar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                
                <v-row justify="center">
                    <v-col :cols="12">
                        <div style="float: left; padding-top: 20px">
                            <span class="text-h5">{{ switchNetwork ? 'Redes' : 'Lojas' }}</span>
                        </div>
                        
                        <v-sheet style="float: right" class="px-5 d-inline-block">
                            <v-switch v-model="switchNetwork" inset :label="`Modo ${switchNetwork ? 'Redes': 'Lojas'}`" ></v-switch>
                        </v-sheet>
                    </v-col>
                </v-row>
                
                <v-row>
                    <v-col class="col" :cols="12" v-show="switchNetwork">
                        <v-card>
                           
                            <v-card-title>
                                <v-text-field v-model="dataTable.search" append-icon="mdi-magnify" label="Pesquisar" class="pr-5" single-line hide-details></v-text-field>
                                <v-btn color="primary" dark style="margin-top: 16px !important;" @click="dialogNewNetwork = true">
                                    Nova Rede
                                </v-btn>
                            </v-card-title>
                            <v-data-table :no-data-text="'Não há dados'" :no-results-text="'Nenhum resultado encontrado'" 
                            :header-props="{'sortByText': 'Ordenar por'}" :footer-props="{'items-per-page-text':'Itens por página', 
                            pageText: '{0}-{1} de {2}', 'items-per-page-all-text':'Todos'}" :headers="dataTable.headers" :items="dataTable.items" 
                            :search="dataTable.search" v-if="switchNetwork">
                                <template v-slot:[`item.RADMIN_NOMEREDE`]="{ item }">
                                    <v-tooltip :color="'rgb(0, 0, 0)'" v-if="item.RADMIN_NOMEREDE" bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn text color="primary" v-bind="attrs" v-on="on" style="text-transform: none" @click="copyText(item.RADMIN_NOMEREDE, 'Nome da rede')">
                                                {{ item.RADMIN_NOMEREDE }}
                                            </v-btn>
                                        </template>
                                        <span>Copiar</span>
                                    </v-tooltip>
                                </template>

                                <template v-slot:[`item.RADMIN_SENHAREDE`]="{ item }">
                                    <v-tooltip :color="'rgb(0, 0, 0)'" v-if="item.RADMIN_SENHAREDE" bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn text color="primary" v-bind="attrs" v-on="on" style="text-transform: none" @click="copyText(item.RADMIN_SENHAREDE, 'Senha', true), false">
                                                {{ item.RADMIN_SENHAREDE }}
                                            </v-btn>
                                        </template>
                                        <span>Copiar</span>
                                    </v-tooltip>
                                </template>

                                <template v-slot:[`item.ISATIVA`]="{ item }">
                                    <span>
                                        {{ item.ISATIVA }}
                                    </span>
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

                                <template v-slot:[`item.COMPLETED`]="{ item }">
                                    <v-simple-checkbox :ripple="false" v-model="item.COMPLETED" @click="checkItem(item)"></v-simple-checkbox>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-col>

                    <v-col class="col" :cols="12" v-show="!switchNetwork">
                        <v-card>
                            <v-card-title>
                                <v-text-field v-model="dataTableStores.search" append-icon="mdi-magnify" label="Pesquisar" class="pr-5" single-line hide-details></v-text-field> 
                                <v-btn color="primary" dark style="margin-top: 16px !important;" @click="modalNewStore()">
                                    Nova Loja
                                </v-btn>
                            </v-card-title>
                           
                            <v-data-table :no-data-text="'Não há dados'" :no-results-text="'Nenhum resultado encontrado'" 
                            :header-props="{'sortByText': 'Ordenar por'}" :footer-props="{'items-per-page-text':'Itens por página', 
                            pageText: '{0}-{1} de {2}', 'items-per-page-all-text':'Todos'}" :headers="dataTableStores.headers" :items="stores" :item-key="'ID_LOJA'"
                            :search="dataTableStores.search" v-if="!switchNetwork">
                                <template v-slot:[`item.NOME_LOJA`]="{ item }">
                                    <span>
                                        {{ item.NOME_LOJA }}
                                    </span>
                                </template>

                                <template v-slot:[`item.RADMIN_NOMEREDE`]="{ item }">
                                    <v-tooltip :color="'rgb(0, 0, 0)'" v-if="item.RADMIN_NOMEREDE" bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn text color="primary" v-bind="attrs" v-on="on" style="text-transform: none" @click="copyText(item.RADMIN_NOMEREDE, 'Nome da Rede Radmin')">
                                                {{ item.RADMIN_NOMEREDE }}
                                            </v-btn>
                                        </template>
                                        <span>Copiar</span>
                                    </v-tooltip>
                                </template>
                                
                                <template v-slot:[`item.RADMIN_SENHAREDE`]="{ item }">
                                    <v-tooltip :color="'rgb(0, 0, 0)'" v-if="item.RADMIN_SENHAREDE" bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn text color="primary" v-bind="attrs" v-on="on" style="text-transform: none" @click="copyText(item.RADMIN_SENHAREDE, 'Senha do Radmin', true)">
                                                {{ item.RADMIN_SENHAREDE }}
                                            </v-btn>
                                        </template>
                                        <span>Copiar</span>
                                    </v-tooltip>
                                </template>

                                <template v-slot:[`item.IP_LOJA`]="{ item }">
                                    <v-tooltip :color="'rgb(0, 0, 0)'" v-if="item.IP_LOJA" bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn text color="primary" v-bind="attrs" v-on="on" style="text-transform: none" @click="copyText(item.IP_LOJA, 'IP da Loja')">
                                                {{ item.IP_LOJA }}
                                            </v-btn>
                                        </template>
                                        <span>Copiar</span>
                                    </v-tooltip>
                                </template>
                                
                                <template v-slot:[`item.ACESSOREMOTO`]="{ item }">
                                    <v-tooltip :color="'rgb(0, 0, 0)'" v-if="item.ACESSOREMOTO" bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn text color="primary" v-bind="attrs" v-on="on" style="text-transform: none" @click="copyText(item.ACESSOREMOTO, 'Acesso RustDesk')">
                                                {{ item.ACESSOREMOTO }}
                                            </v-btn>
                                        </template>
                                        <span>Copiar</span>
                                    </v-tooltip>
                                </template>
                                
                                <template v-slot:[`item.SENHAACESSOREMOTO`]="{ item }">
                                    <v-tooltip :color="'rgb(0, 0, 0)'" v-if="item.SENHAACESSOREMOTO" bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn text color="primary" v-bind="attrs" v-on="on" style="text-transform: none" @click="copyText(item.SENHAACESSOREMOTO, 'Senha de acesso RustDesk', true)">
                                                {{ item.SENHAACESSOREMOTO }}
                                            </v-btn>
                                        </template>
                                        <span>Copiar</span>
                                    </v-tooltip>
                                </template>

                                <template v-slot:[`item.action`]="{ item }" class="text-end"> 
                                    <v-tooltip :color="'rgb(0, 0, 0)'" :max-width="220" bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <span v-bind="attrs" v-on="on" style="">
                                                <v-icon class="mr-2" @click="modalEditStore(item)">
                                                    mdi-pencil
                                                </v-icon>
                                            </span>
                                        </template> 
                                        <span>Editar</span>
                                    </v-tooltip>
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
            switchNetwork: true,
            switchMode: true,
            err: '', 
            dialogEditStore: false,
            dialog: false,
            serverIP: '',
            roleUserLogged: '',
            dialogTwo: false,
            msgDialog: '',
            colorDialog: 'success', /* success,  primary*/
            dialogNewNetwork: false,
            dialogFullScreen: false,
            snackbar: false,
            nameNetworks: [],
            selectedFruits: [],
            snackbarText: '',
            snackbarColor: '',
            showPassword: true,
            networksCheckeds: [],
            dialogNewStore: false,
            dataTable: {
                search: '',
                headers: [
                    { text: 'Nome Rede', align: 'center', value: 'NOME_REDE',},
                    { text: 'Nome Rede Radmin', align: 'center', value: 'RADMIN_NOMEREDE',},
                    { text: 'Senha Rede Radmin', align: 'center', value: 'RADMIN_SENHAREDE'},
                    { text: 'Rede Ativa', align: 'center', value: 'ISATIVA'},
                    { text: 'Ações', align: 'center', value: 'action', sortable: false },
                    { text: 'Concluído', align: 'center', value: 'COMPLETED'},
                ],
                items: [
                    //{ id: 1, NOME_REDE: 'Big Farma', RADMIN_NOMEREDE: 'Big Farma', RADMIN_SENHAREDE: 'd120588', REDE_REPLICA: 'SIM', ISATIVA: 'NÃO', COMPLETED: true},
                    //{ id: 2, NOME_REDE: 'Bom Preço', RADMIN_NOMEREDE: 'Bom Preço', RADMIN_SENHAREDE: 'Maximus', REDE_REPLICA: 'SIM', ISATIVA: 'NÃO',COMPLETED: false},
                    //{ id: 3, NOME_REDE: 'Drogaria Canaã', RADMIN_NOMEREDE: 'Drogaria Canaã', RADMIN_SENHAREDE: 'segredo!2019', REDE_REPLICA: 'SIM', ISATIVA: 'NÃO', COMPLETED: true},
                ],
            },
            dataTableStores: {
                search: '',
                headers: [
                    { text: 'Rede', align: 'center', value: 'NOME_REDE'}, // NOME_LOJA
                    { text: 'Loja', align: 'center', value: 'NOME_LOJA'}, // NOME_LOJA
                    { text: 'Nome Rede Radmin', align: 'center', value: 'RADMIN_NOMEREDE'},
                    { text: 'Senha Rede Radmin', align: 'center', value: 'RADMIN_SENHAREDE'},
                    { text: 'IP Radmin', align: 'center', value: 'IP_LOJA'},
                    { text: 'Acesso RustDesk', align: 'center', value: 'ACESSOREMOTO'},
                    { text: 'Senha RustDesk', align: 'center', value: 'SENHAACESSOREMOTO'},
                    { text: 'Ações', align: 'center', value: 'action', sortable: false },
                ],
                items: [
                    //{ id: 1, NOME_REDE: 'Big Farma', RADMIN_NOMEREDE: 'Big Farma', RADMIN_SENHAREDE: 'd120588', REDE_REPLICA: 'SIM', ISATIVA: 'NÃO', COMPLETED: true},
                    //{ id: 2, NOME_REDE: 'Bom Preço', RADMIN_NOMEREDE: 'Bom Preço', RADMIN_SENHAREDE: 'Maximus', REDE_REPLICA: 'SIM', ISATIVA: 'NÃO',COMPLETED: false},
                    //{ id: 3, NOME_REDE: 'Drogaria Canaã', RADMIN_NOMEREDE: 'Drogaria Canaã', RADMIN_SENHAREDE: 'segredo!2019', REDE_REPLICA: 'SIM', ISATIVA: 'NÃO', COMPLETED: true},
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
            storeSelected:{
                ID_LOJA: '',
                NUMERO_LOJA: '',
                NOME_LOJA: '',
                IP_LOJA: '',
                PORTA_LOJA: '',
                LOGIN_LOJA: '',
                SENHA_LOJA: '',
                REDEID: '',
                RAZAO_LOJA: '',
                CNPJ_LOJA: '',
                SISTEMA_LOJA: '',
                ENDERECO_LOJA: '',
                ACESSOREMOTO: '',
                SENHAACESSOREMOTO: '',
            },
            newStore:{
                NUMERO_LOJA: '',
                NOME_LOJA: '',
                IP_LOJA: '',
                PORTA_LOJA: '',
                LOGIN_LOJA: '',
                SENHA_LOJA: '',
                REDEID: '',
                RAZAO_LOJA: '',
                CNPJ_LOJA: '',
                SISTEMA_LOJA: '',
                ENDERECO_LOJA: '',
                ACESSOREMOTO: '',
                SENHAACESSOREMOTO: '',
            },
            
            stores:[
                
            ],
            storesFiltered: [

            ]
        }
    },
    created(){
        this.serverIP = scrypt.serverIP
        this.myFunction(false);
    },
    methods: {
        myFunction(cond){
            this.roleUserLogged = localStorage.getItem("roleUser")
            this.setItensChecked();
            axios.get(`${this.serverIP}/networks`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then(res => {
                for(var y=0; y < res.data.networks.length; y++) {
                    var element = res.data.networks[y];
                    var completed = this.networksCheckeds.find(network => network.id == element.id)
                    Vue.set(this.dataTable.items, y, {id: element.id, NOME_REDE: element.NOME_REDE, RADMIN_NOMEREDE: element.RADMIN_NOMEREDE, RADMIN_SENHAREDE: element.RADMIN_SENHAREDE, REDE_REPLICA: element.REDE_REPLICA == 1 ? "Sim" : "Não", ISATIVA: element.ISATIVA == 1 ? "Sim" : "Não", COMPLETED: completed ? true: false})
                    Vue.set(this.nameNetworks, y, element.NOME_REDE)
                }
            }).catch(err => {
                this.err = err.response.data.err
            })

            if(cond){
                this.snackbarText = 'Dados recarregados com sucesso'
                this.snackbar = true;
            } 

            axios.get(`${this.serverIP}/stores`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then(res => {
                for(var x=0; x < res.data.stores.length; x++){
                    var element = res.data.stores[x];
                    Vue.set(this.stores, x, {ID_LOJA: element.ID_LOJA, NUMERO_LOJA: element.NUMERO_LOJA, NOME_LOJA: element.NOME_LOJA, IP_LOJA: element.IP_LOJA, PORTA_LOJA: element.PORTA_LOJA, LOGIN_LOJA: element.LOGIN_LOJA, SENHA_LOJA: element.SENHA_LOJA, REDEID: element.REDEID, RAZAO_LOJA: element.RAZAO_LOJA, CNPJ_LOJA: element.CNPJ_LOJA, SISTEMA_LOJA: element.SISTEMA_LOJA, ENDERECO_LOJA: element.ENDERECO_LOJA, ACESSOREMOTO: element.ACESSOREMOTO, SENHAACESSOREMOTO: element.SENHAACESSOREMOTO, id: element.id, NOME_REDE: element.NOME_REDE, RADMIN_NOMEREDE: element.RADMIN_NOMEREDE, RADMIN_SENHAREDE: element.RADMIN_SENHAREDE, REDE_REPLICA: element.REDE_REPLICA, ISATIVA: element.ISATIVA})
                }
                this.storesFiltered = this.stores.filter(element => element.id == this.networkSelected.id)

            }).catch(err => {
                this.err = err.response.data.err
            })
        },
        copyText(text, value, female){
            this.dialogFullScreen ? this.snackbarColor = 'success' : this.snackbarColor = 'deep-purple accent-4' // o dialog dialogFullScreen tem a cor de fundo azul, impedindo o user de ver o snackBar
            navigator.clipboard.writeText(text)
            this.snackbarText = `${value} ${female ? 'copiada' : 'copiado'}  com sucesso`
            this.snackbar = true;
        },
        checkItem(item){
            if(window) {
                if(item.COMPLETED){
                    if(this.networksCheckeds != null){
                        this.networksCheckeds.push({id: item.id})
                    } else{
                        this.networksCheckeds = [{id: item.id}]
                    }
                } else{
                    this.networksCheckeds = this.networksCheckeds.filter(element => element.id != item.id)
                }
                
                localStorage.setItem("dataMaximus", JSON.stringify(this.networksCheckeds));
            }
        },
        modalEditStore(item){
            this.storeSelected.ID_LOJA = item.ID_LOJA
            this.storeSelected.NUMERO_LOJA = item.NUMERO_LOJA 
            this.storeSelected.NOME_LOJA = item.NOME_LOJA
            this.storeSelected.IP_LOJA = item.IP_LOJA
            this.storeSelected.PORTA_LOJA = item.PORTA_LOJA
            this.storeSelected.LOGIN_LOJA = item.LOGIN_LOJA
            this.storeSelected.SENHA_LOJA = item.SENHA_LOJA
            this.storeSelected.REDEID = this.dataTable.items.filter(element => element.id == item.REDEID)[0].NOME_REDE
            this.storeSelected.RAZAO_LOJA = item.RAZAO_LOJA 
            this.storeSelected.CNPJ_LOJA = this.maskToCNPJ(item.CNPJ_LOJA)
            this.storeSelected.SISTEMA_LOJA = item.SISTEMA_LOJA == 1 ? "Maximus Gestão" : item.SISTEMA_LOJA == 2 ? "Maximus Lite" : ""
            this.storeSelected.ENDERECO_LOJA = item.ENDERECO_LOJA
            this.storeSelected.ACESSOREMOTO = item.ACESSOREMOTO
            this.storeSelected.SENHAACESSOREMOTO = item.SENHAACESSOREMOTO
            this.dialogEditStore = true;
        },
        saveStore(){
            if(this.newStore.NUMERO_LOJA < 0){
                this.callErr("Número da Loja inválido");
            } else if(this.newStore.NOME_LOJA.trim() == ""){
                this.callErr("Nome da Loja não pode ser vazio");
            }  else if(this.newStore.REDEID.trim() == ""){
                this.callErr("Informe uma Rede para esta Loja");
            } else{
                axios.post(`${this.serverIP}/store`, {
                    NUMERO_LOJA: this.newStore.NUMERO_LOJA,
                    NOME_LOJA: this.newStore.NOME_LOJA,
                    IP_LOJA: this.newStore.IP_LOJA == null || undefined ? '' : this.newStore.IP_LOJA,
                    REDEID: this.dataTable.items.filter(element => element.NOME_REDE == this.newStore.REDEID)[0].id,
                    PORTA_LOJA: this.newStore.PORTA_LOJA == null || this.newStore.PORTA_LOJA == undefined || this.newStore.PORTA_LOJA == "" ? 3739 : this.newStore.PORTA_LOJA,
                    LOGIN_LOJA: this.newStore.LOGIN_LOJA == null || this.newStore.LOGIN_LOJA == undefined ? '' : this.newStore.LOGIN_LOJA,
                    SENHA_LOJA: this.newStore.SENHA_LOJA == null || this.newStore.SENHA_LOJA == undefined ? '' : this.newStore.SENHA_LOJA,
                    RAZAO_LOJA: this.newStore.RAZAO_LOJA == null || this.newStore.RAZAO_LOJA == undefined ? '' : this.newStore.RAZAO_LOJA,
                    CNPJ_LOJA: this.newStore.CNPJ_LOJA == null || this.newStore.CNPJ_LOJA == undefined ? '' : this.newStore.CNPJ_LOJA,
                    SISTEMA_LOJA: this.newStore.SISTEMA_LOJA == "Maximus Gestão" ? 1 : this.newStore.SISTEMA_LOJA == "Maximus Lite" ? 2 : 0,
                    ENDERECO_LOJA: this.newStore.ENDERECO_LOJA == null || this.newStore.ENDERECO_LOJA == undefined ? '' : this.newStore.ENDERECO_LOJA,
                    ACESSOREMOTO: this.newStore.ACESSOREMOTO == null || this.newStore.ACESSOREMOTO == undefined ? '' : this.newStore.ACESSOREMOTO,
                    SENHAACESSOREMOTO: this.newStore.SENHAACESSOREMOTO == null || this.newStore.SENHAACESSOREMOTO == undefined ? '' : this.newStore.SENHAACESSOREMOTO,
                }).then(res => {
                    this.dialogNewStore = false;
                    this.myFunction();
                    this.callMsgSuccess(res.data.success)
                }).catch(err => {
                    this.callErr(err.response.data.err)
                })
            }
        },
        editStore(){
            if(this.storeSelected.NUMERO_LOJA < 0){
                this.callErr("Número da Loja inválido");
            } else if(this.storeSelected.NOME_LOJA.trim() == ""){
                this.callErr("Nome da Loja não pode ser vazio");
            }  else if(this.storeSelected.REDEID.trim() == ""){
                this.callErr("Rede da Loja não pode ser vazio");
            } else{
                axios.patch(`${this.serverIP}/store`, {
                    idStore: this.storeSelected.ID_LOJA,
                    nameStore: this.storeSelected.NOME_LOJA,
                    editNumberStoreNewStore: this.storeSelected.NUMERO_LOJA,
                    editNameStore: this.storeSelected.NOME_LOJA,
                    editIpStore: this.storeSelected.IP_LOJA == null || undefined ? '' : this.storeSelected.IP_LOJA,
                    editSelected: this.dataTable.items.filter(element => element.NOME_REDE == this.storeSelected.REDEID)[0].id,
                    editDoorIP: this.storeSelected.PORTA_LOJA == null || undefined ? '' : this.storeSelected.PORTA_LOJA,
                    editLogin: this.storeSelected.LOGIN_LOJA == null || undefined ? '' : this.storeSelected.LOGIN_LOJA,
                    SENHA_LOJA: this.storeSelected.SENHA_LOJA == null || undefined ? '' : this.storeSelected.SENHA_LOJA,
                    RAZAO_LOJA: this.storeSelected.RAZAO_LOJA == null || undefined ? '' : this.storeSelected.RAZAO_LOJA,
                    CNPJ_LOJA: this.storeSelected.CNPJ_LOJA == null || undefined ? '' : this.storeSelected.CNPJ_LOJA,
                    SISTEMA_LOJA: this.storeSelected.SISTEMA_LOJA == "Maximus Gestão" ? 1 : this.storeSelected.SISTEMA_LOJA == "Maximus Lite" ? 2 : 0,
                    ENDERECO_LOJA: this.storeSelected.ENDERECO_LOJA == null || undefined ? '' : this.storeSelected.ENDERECO_LOJA,
                    ACESSOREMOTO: this.storeSelected.ACESSOREMOTO == null || undefined ? '' : this.storeSelected.ACESSOREMOTO,
                    SENHAACESSOREMOTO: this.storeSelected.SENHAACESSOREMOTO == null || undefined ? '' : this.storeSelected.SENHAACESSOREMOTO,
                }).then(res => {
                    this.dialogEditStore = false;
                    this.myFunction();
                    this.callMsgSuccess(res.data.success)
                }).catch(err => {
                    this.callErr(err.response.data.err)
                })
            }
        },
        modalNewStore(){
            this.newStore.NUMERO_LOJA = "";
            this.newStore.NOME_LOJA = "";
            this.newStore.IP_LOJA = "";
            this.newStore.REDEID = "";
            this.newStore.PORTA_LOJA = "";
            this.newStore.SENHA_LOJA = "";
            this.newStore.RAZAO_LOJA = "";
            this.newStore.CNPJ_LOJA = "";
            this.newStore.SISTEMA_LOJA = "";
            this.newStore.ENDERECO_LOJA = "";
            this.newStore.ACESSOREMOTO = "";
            this.newStore.SENHAACESSOREMOTO = "";
            this.dialogNewStore = true;
        },
        infoNetwork(item){
            this.storesFiltered = this.stores.filter(element => element.id == item.id)
            this.networkSelected.id = item.id
            this.networkSelected.NOME_REDE = item.NOME_REDE
            this.networkSelected.RADMIN_NOMEREDE = item.RADMIN_NOMEREDE
            this.networkSelected.RADMIN_SENHAREDE = item.RADMIN_SENHAREDE
            this.networkSelected.REDE_REPLICA = item.REDE_REPLICA
            this.networkSelected.ISATIVA = item.ISATIVA
            this.dialogFullScreen = true
        },
        alterDataStore(item){
            this.storeSelected.ID_LOJA = item.ID_LOJA
            this.storeSelected.NUMERO_LOJA = item.NUMERO_LOJA 
            this.storeSelected.NOME_LOJA = item.NOME_LOJA
            this.storeSelected.IP_LOJA = item.IP_LOJA
            this.storeSelected.PORTA_LOJA = item.PORTA_LOJA
            this.storeSelected.LOGIN_LOJA = item.LOGIN_LOJA
            this.storeSelected.SENHA_LOJA = item.SENHA_LOJA
            this.storeSelected.REDEID = this.dataTable.items.filter(element => element.id == item.REDEID)[0].NOME_REDE
            this.storeSelected.RAZAO_LOJA = item.RAZAO_LOJA 
            this.storeSelected.CNPJ_LOJA = this.maskToCNPJ(item.CNPJ_LOJA)
            this.storeSelected.SISTEMA_LOJA = item.SISTEMA_LOJA == 1 ? "Maximus Gestão" : item.SISTEMA_LOJA == 2 ? "Maximus Lite" : ""
            this.storeSelected.ENDERECO_LOJA = item.ENDERECO_LOJA
            this.storeSelected.ACESSOREMOTO = item.ACESSOREMOTO
            this.storeSelected.SENHAACESSOREMOTO = item.SENHAACESSOREMOTO
        },
        setItensChecked(){
            if(window){
                if(localStorage.getItem('dataMaximus') == null){
                    localStorage.setItem("dataMaximus", JSON.stringify([]))
                }
                this.networksCheckeds = JSON.parse(localStorage.getItem("dataMaximus"))
            }
        },
        modalEdit(item){
            this.networkSelected.id = item.id
            this.networkSelected.NOME_REDE = item.NOME_REDE
            this.networkSelected.RADMIN_NOMEREDE = item.RADMIN_NOMEREDE
            this.networkSelected.RADMIN_SENHAREDE = item.RADMIN_SENHAREDE
            this.networkSelected.REDE_REPLICA = item.REDE_REPLICA
            this.networkSelected.ISATIVA = item.ISATIVA
            this.dialog = true;
        },
        editNetwork(clearData){
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

                    if(clearData) {
                        this.networkSelected.id = "";
                        this.networkSelected.NOME_REDE = "";
                        this.networkSelected.RADMIN_NOMEREDE = "";
                        this.networkSelected.RADMIN_SENHAREDE = "";
                        this.networkSelected.REDE_REPLICA = "";
                        this.networkSelected.ISATIVA = "";
                    }
                    
                }).catch(err => {
                    this.err = err.response.data.err
                })
            }
        },
        callMsgSuccess(msg){
            this.dialogTwo = true
            this.dialog = ""
            this.msgDialog = msg
        },
        saveNetwork(){
            if(this.newNetwork.NOME_REDE.trim() == ""){
                this.callErr('Nome da rede não pode ser vazio')
            } else if(this.newNetwork.REDE_REPLICA.trim() == ""){
                this.callErr('Informe se a loja replica ou não')
            } else{
                var confirmation = confirm("Confirma gravação de " + this.newNetwork.NOME_REDE +' ?');
                if(confirmation) {
                    axios.post(`${this.serverIP}/network`, {
                        NOME_REDE: this.newNetwork.NOME_REDE,
                        RADMIN_NOMEREDE: this.newNetwork.RADMIN_NOMEREDE,
                        RADMIN_SENHAREDE: this.newNetwork.RADMIN_SENHAREDE,
                        REDE_REPLICA: this.newNetwork.REDE_REPLICA == "Sim" ? 1 : 0,
                        ISATIVA: this.newNetwork.ISATIVA == "Sim" ? 1 : 0
                    }).then(res => {
                        this.dialogNewNetwork = false
                        this.callMsgSuccess(res.data.success)
                        this.myFunction();
                        this.newNetwork.NOME_REDE = ""
                        this.newNetwork.RADMIN_NOMEREDE = ""
                        this.newNetwork.RADMIN_SENHAREDE = ""
                        this.newNetwork.REDE_REPLICA = ""
                        this.newNetwork.ISATIVA = ""
                    }).catch(err => {
                        this.callErr(err.response.data.err);
                    })
                }   
            }
        },
        callErr(msgError){
            this.msgDialog = msgError
            this.colorDialog = 'danger'
            this.dialogTwo = true
        },
        closeToastErr(){
            this.err = ''
        },
        clique() {
            scrypt.clique(this);
        },
        numbersAndPoints(){
            var aux = this.storeSelected.IP_LOJA.replace(/[^0-9.]/gi, '') // retira tudo o que não estiver entre 0 e 9 e ponto
            this.storeSelected.IP_LOJA = aux
        },
        numbersAndPoints2(){
            var aux = this.newStore.IP_LOJA.replace(/[^0-9.]/gi, '') // retira tudo o que não estiver entre 0 e 9 e ponto
            this.newStore.IP_LOJA = aux
        },
        onlyNumbers(){
            var aux = this.storeSelected.PORTA_LOJA.replace(/[^0-9]/gi, '') // retira tudo o que não estiver entre 0 e 9 e ponto
            this.storeSelected.PORTA_LOJA = aux
        },
        onlyNumbers2(){
            var aux = this.newStore.PORTA_LOJA.replace(/[^0-9]/gi, '') // retira tudo o que não estiver entre 0 e 9 e ponto
            this.newStore.PORTA_LOJA = aux
        },
        maskToCNPJ(CNPJ){
            if(CNPJ != "" && CNPJ != null) {
                CNPJ = CNPJ.substr(0, 18).replace(/\D/g, '').replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5")
                return CNPJ;
            }
        }
    },
    filters: {
        convertName(value){
            return value == 0 ? "Integração" : "Loja " + value
        }
    },
    
    watch: {
        'storeSelected.NUMERO_LOJA'() {
            if(this.storeSelected.NUMERO_LOJA < 0){ 
                this.storeSelected.NUMERO_LOJA = 0
                this.callErr("O menor número possível para uma loja é 0")
                return;
            }

             if(this.storeSelected.NUMERO_LOJA > 30){ 
                this.storeSelected.NUMERO_LOJA = 0
                this.callErr("O maior número possível para uma loja é 30")
                return;
            }

            this.storeSelected.NOME_LOJA = this.storeSelected.NUMERO_LOJA == 0 ? "Integração" : "Loja " + this.storeSelected.NUMERO_LOJA
        },
        'newStore.NUMERO_LOJA'() {
            if(this.newStore.NUMERO_LOJA < 0){ 
                this.newStore.NUMERO_LOJA = 0
                this.callErr("O menor número possível para uma loja é 0")
                return;
            }

             if(this.newStore.NUMERO_LOJA > 30){ 
                this.newStore.NUMERO_LOJA = 0
                this.callErr("O maior número possível para uma loja é 30")
                return;
            }
            
            if(this.newStore.NUMERO_LOJA.trim() != ""){
                this.newStore.NOME_LOJA = this.newStore.NUMERO_LOJA == 0 ? "Integração" : "Loja " + this.newStore.NUMERO_LOJA
            }
        },
        'storeSelected.CNPJ_LOJA'(){
            if(this.storeSelected.CNPJ_LOJA != "" && this.storeSelected.CNPJ_LOJA != null) {
                if(this.storeSelected.CNPJ_LOJA.length == 3) {
                    this.storeSelected.CNPJ_LOJA = this.storeSelected.CNPJ_LOJA.replace(/\D/g, '').replace(/^(\d{2})/, "$1.")
                }
                else if(this.storeSelected.CNPJ_LOJA.length == 7){
                    this.storeSelected.CNPJ_LOJA = this.storeSelected.CNPJ_LOJA.replace(/\D/g, '').replace(/^(\d{2})(\d{3})/, "$1.$2.")
                }
                else if(this.storeSelected.CNPJ_LOJA.length == 10){
                    this.storeSelected.CNPJ_LOJA = this.storeSelected.CNPJ_LOJA.replace(/\D/g, '').replace(/^(\d{2})(\d{3})(\d{3})/, "$1.$2.$3/")
                }
                else if(this.storeSelected.CNPJ_LOJA.length == 16){
                    this.storeSelected.CNPJ_LOJA = this.storeSelected.CNPJ_LOJA.replace(/\D/g, '').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})/, "$1.$2.$3/$4-")
                }
                else if(this.storeSelected.CNPJ_LOJA.length > 18){
                    this.storeSelected.CNPJ_LOJA = this.storeSelected.CNPJ_LOJA.substr(0, 18).replace(/\D/g, '').replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5")
                }
            }
        },
        'newStore.CNPJ_LOJA'(){
            if(this.newStore.CNPJ_LOJA != "" && this.newStore.CNPJ_LOJA != null) {
                if(this.newStore.CNPJ_LOJA.length == 3) {
                    this.newStore.CNPJ_LOJA = this.newStore.CNPJ_LOJA.replace(/\D/g, '').replace(/^(\d{2})/, "$1.")
                }
                else if(this.newStore.CNPJ_LOJA.length == 7){
                    this.newStore.CNPJ_LOJA = this.newStore.CNPJ_LOJA.replace(/\D/g, '').replace(/^(\d{2})(\d{3})/, "$1.$2.")
                }
                else if(this.newStore.CNPJ_LOJA.length == 10){
                    this.newStore.CNPJ_LOJA = this.newStore.CNPJ_LOJA.replace(/\D/g, '').replace(/^(\d{2})(\d{3})(\d{3})/, "$1.$2.$3/")
                }
                else if(this.newStore.CNPJ_LOJA.length == 16){
                    this.newStore.CNPJ_LOJA = this.newStore.CNPJ_LOJA.replace(/\D/g, '').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})/, "$1.$2.$3/$4-")
                }
                else if(this.newStore.CNPJ_LOJA.length > 18){
                    this.newStore.CNPJ_LOJA = this.newStore.CNPJ_LOJA.substr(0, 18).replace(/\D/g, '').replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5")
                }
            }
        }
    }
    
}
</script>