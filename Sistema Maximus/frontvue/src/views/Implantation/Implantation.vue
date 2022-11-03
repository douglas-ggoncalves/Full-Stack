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
            <v-container fluid v-show="!checkImplantation">
                <v-row justify="center">
                    <v-menu v-for="user in USUARIO" :key="user.ID_USUARIO" bottom min-width="200px" rounded offset-y>
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

                                <template v-slot:[`item.value`]="{ item }">
                                    <span>{{ item.value }}</span>
                                </template>

                                <template v-slot:[`item.DATAINI_LOJA`]="{ item }">
                                    <span>{{ new Date(item.DATAINI_LOJA.replace("-",',')).toLocaleString() | toDate }}</span>
                                </template>

                                <template v-slot:[`item.action`]="{ item }" class="text-end"> 
                                    <v-btn class="ml-auto" color="success" @click="viewItem(item)">Selecionar</v-btn>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>

            <v-container id="implantation" fluid v-show="checkImplantation">
                <v-dialog v-model="dialog" max-width="600">
                    <v-card>
                        <v-toolbar class="text-center" color="dark" dark>Atribua membros a {{ itemSelected }}</v-toolbar>
                        <v-card-text class="text-center">
                            <div class="text-h5 pa-12">
                                <v-combobox   hide-selected solo v-model="USUARIO_SELECT2" :items="USUARIO" item-text="LOGIN_USUARIO" return-object label="Usuários" multiple chips>
                                    <template  @click="testeeeeee()"  v-slot:selection="data"> 
                                        <v-chip  :key="JSON.stringify(data.item)" close v-bind="data.attrs" :input-value="data.selected" :disabled="data.disabled" @click:close="data.parent.selectItem(data.item)">
                                            <v-avatar class="accent white--text" left v-if="data.item.IMG_USUARIO != '' &&  data.item.IMG_USUARIO != null">
                                                <img :src='"../../assets/img/Funcionarios/" + data.item.IMG_USUARIO +  ".jpg"' :alt="data.item.LOGIN_USUARIO">
                                            </v-avatar>
                                            <v-avatar class="accent white--text" v-text="data.item.LOGIN_USUARIO.slice(0, 1).toUpperCase()" left v-else/>
                                            {{ data.item.LOGIN_USUARIO | getFirstName }}
                                        </v-chip>
                                    </template>
                                </v-combobox>
                            </div>
                            <v-btn class="success" @click="dialog = false">Fechar</v-btn>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                <v-row>
                    <v-col class="text-left">
                        <v-tooltip right>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn @click="checkImplantation = false" outlined v-bind="attrs" v-on="on" tile color="grey darken-3 text-white">
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
                        <v-text-field label="Razão Social" v-model="dataClient.RAZAO_LOJA" hide-details="auto"></v-text-field>
                    </v-col>
                    
                    <v-col :cols="5">
                        <v-text-field label="CNPJ" v-model="dataClient.CNPJ_LOJA" counter="18" maxlength="18"></v-text-field> 
                    </v-col>

                    <v-col :cols="5">
                        <v-text-field label="Endereço" v-model="dataClient.ENDERECO_LOJA"></v-text-field> 
                    </v-col>
                    
                    <v-col :cols="5">
                        <v-select v-model="dataClient.SISTEMA_LOJA" :items="optionsSystem"  label="Sistema" required></v-select>
                    </v-col>
                </v-row>
                
                <v-row class="stages">
                    
                    <v-col class="myColumn" :cols="3">
                        <h5>Implantação Etapa 1</h5>
                        <div>
                            <v-progress-circular :value="progressStage1" :size="55" :color="stage1.color">
                                {{ progressStage1 }}%
                            </v-progress-circular>
                        </div>
                    </v-col>

                    <v-col :cols="5">
                        <v-combobox v-model="USUARIO_SELECT" :items="USUARIO" item-text="LOGIN_USUARIO" return-object label="Usuários" multiple chips>
                            <template v-slot:selection="data">
                                <v-chip :key="JSON.stringify(data.item)" close v-bind="data.attrs" :input-value="data.selected" :disabled="data.disabled" @click:close="data.parent.selectItem(data.item)">
                                    <v-avatar class="accent white--text" left v-if="data.item.IMG_USUARIO != '' &&  data.item.IMG_USUARIO != null">
                                        <img :src='"../../assets/img/Funcionarios/" + data.item.IMG_USUARIO +  ".jpg"' :alt="data.item.LOGIN_USUARIO">
                                    </v-avatar>
                                    <v-avatar class="accent white--text" v-text="data.item.LOGIN_USUARIO.slice(0, 1).toUpperCase()" left v-else/>
                                    {{ data.item.LOGIN_USUARIO | getFirstName }}
                                </v-chip>
                            </template>
                        </v-combobox>
                    </v-col>

                    <v-col :cols="2">
                        <v-menu ref="stage1.dateInit" v-model="stage1.dateInit" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="stage1.iniDateFormatted" readonly :prepend-inner-icon="'mdi-calendar'" label="Data Início" 
                                hint="informe a data desejada" v-bind="attrs" @blur="stage1.editedItemDateIni = parseDate(stage1.iniDateFormatted)" v-on="on" ></v-text-field>
                            </template>
                            
                            <v-date-picker v-model="stage1.editedItemDateIni" no-title @input="stage1.dateInit = false" locale="pt"></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col :cols="2">
                        <v-menu ref="stage1.dateFinal" v-model="stage1.dateFinal" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="stage1.dateFormattedFinal" readonly :prepend-inner-icon="'mdi-calendar'" label="Data Conclusão" 
                                hint="informe a data desejada" v-bind="attrs" @blur="stage1.editedDateFinal = parseDate(stage1.dateFormattedFinal)" v-on="on" ></v-text-field>
                            </template>
                            <v-date-picker v-model="stage1.editedDateFinal" no-title @input="stage1.dateFinal = false" locale="pt"></v-date-picker>
                        </v-menu>
                    </v-col>
                    
                    <div class="separate"/>
                    
                    <v-row>
                        <v-col :cols="6">
                            <v-card class="mx-auto">
                                <v-list class="p-0">
                                    <v-list-item-group v-model="stage1.model" multiple>
                                        <template v-for="(item, i) in stage1.items">
                                            <v-divider v-if="!item" :key="`divider-${i}`"></v-divider>
                                            <v-list-item v-else :active="false" :key="`item-${i}`" :value="item" active-class="success text-white">
                                                <template v-slot:default="{ active }">
                                                    <v-list-item-action>
                                                        <v-checkbox :input-value="active" color="white"></v-checkbox>
                                                    </v-list-item-action>

                                                    <v-list-item-content>
                                                        <v-list-item-title v-text="item"></v-list-item-title>
                                                    </v-list-item-content>

                                                    <v-list-item-icon class="display: flex; align-items-center"> 
                                                        <span v-for="user in USUARIO_SELECT" :key="user.ID_USUARIO"> <!-- 555 -->
                                                            <v-avatar color="brown" size="36" v-if="user.IMG_USUARIO != '' &&  user.IMG_USUARIO != null">
                                                                <img :src='"../../assets/img/Funcionarios/" + user.IMG_USUARIO +  ".jpg"' :alt="user.LOGIN_USUARIO">
                                                            </v-avatar>

                                                            <v-avatar size="36" v-else color="red">
                                                                <span class="white--text">{{ user.LOGIN_USUARIO | reversedMessage(user.LOGIN_USUARIO) }}</span>
                                                            </v-avatar>
                                                        </span>
                                                    </v-list-item-icon>

                                                    <v-list-item-action>
                                                        <v-menu offset-y>
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-btn v-bind="attrs" v-on="on" :color="active ? 'white': 'purple darken-4'" @click="addMembers(item)" icon>
                                                                    <v-icon>mdi-dots-vertical</v-icon>
                                                                </v-btn>
                                                            </template>
                                                        </v-menu>
                                                    </v-list-item-action>
                                                </template>
                                            </v-list-item>
                                        </template>
                                    </v-list-item-group>
                                </v-list>
                            </v-card>
                        </v-col>

                        <v-col :cols="6">
                            <div class="mb-1" style="max-height: 20%;">
                                <v-radio-group class="mt-0 pt-0" v-model="stage1.switch" row>Todos os itens foram instalados?
                                    <v-radio class="mx-3" label="Sim" :value="true"></v-radio> 
                                    <v-radio label="Não" :value="false" ></v-radio> 
                                </v-radio-group>
                            </div>

                            <div class="form-group" style="max-height: 80%">
                                <textarea class="form-control" id="exampleFormControlTextarea1" v-if="!stage1.switch" style="height: 100%"></textarea>
                                <textarea class="form-control" id="exampleFormControlTextarea2" v-if="stage1.switch" disabled style="height: 100%"></textarea>
                            </div>
                        </v-col>
                    </v-row>
                </v-row>

                <v-row class="stages" v-if="stage2.items.length > 0">
                    <v-col class="myColumn" :cols="6">
                        <h5>Implantação Etapa 2</h5>
                        <div>
                            <v-progress-circular :value="progressStage2" :size="55" :color="stage2.color">
                                {{ progressStage2 }}%
                            </v-progress-circular>
                        </div>
                    </v-col>

                    <v-col :cols="3">
                        <v-menu ref="stage2.dateInit" v-model="stage2.dateInit" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="stage2.iniDateFormatted" readonly :prepend-inner-icon="'mdi-calendar'" label="Data Início" 
                                hint="informe a data desejada" v-bind="attrs" @blur="stage2.editedItemDateIni = parseDate(stage2.iniDateFormatted)" v-on="on" ></v-text-field>
                            </template>
                            
                            <v-date-picker v-model="stage2.editedItemDateIni" no-title @input="stage2.dateInit = false" locale="pt"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col :cols="3">
                        <v-menu ref="stage2.dateFinal" v-model="stage2.dateFinal" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="stage2.dateFormattedFinal" readonly :prepend-inner-icon="'mdi-calendar'" label="Data Conclusão" 
                                hint="informe a data desejada" v-bind="attrs" @blur="stage2.editedDateFinal = parseDate(stage2.dateFormattedFinal)" v-on="on" ></v-text-field>
                            </template>
                            <v-date-picker v-model="stage2.editedDateFinal" no-title @input="stage2.dateFinal = false" locale="pt"></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-row>
                        <v-col :cols="6">
                            <v-card class="mx-auto">
                                <v-list class="p-0">
                                    <v-list-item-group v-model="stage2.model" multiple>
                                        <template v-for="(item, i) in stage2.items">
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
                            <div style="height: 20%;">
                                <v-radio-group class="mt-0 pt-0" v-model="stage1.switch" row>Todos os itens foram instalados?
                                    <v-radio class="mx-3" label="Sim" :value="true"></v-radio> 
                                    <v-radio label="Não" :value="false" ></v-radio> 
                                </v-radio-group>
                            </div>

                            <div class="form-group" style="max-height: 80%">
                                <textarea class="form-control" id="exampleFormControlTextarea1" v-if="!stage1.switch" style="height: 100%"></textarea>
                                <textarea class="form-control" id="exampleFormControlTextarea2" v-if="stage1.switch" disabled style="height: 100%"></textarea>
                            </div>
                        </v-col>
                    </v-row>
                </v-row>

                <v-row class="stages">
                    <v-col class="myColumn" :cols="6">
                        <h5>Implantação Etapa 3</h5>
                        <div>
                            <v-progress-circular :value="progressStage3" :size="55" :color="stage3.color">
                                {{ progressStage3 }}%
                            </v-progress-circular>
                        </div>
                    </v-col>

                    <v-col :cols="3">
                        <v-menu ref="stage3.dateInit" v-model="stage3.dateInit" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="stage3.iniDateFormatted" readonly :prepend-inner-icon="'mdi-calendar'" label="Data Início" 
                                hint="informe a data desejada" v-bind="attrs" @blur="stage3.editedItemDateIni = parseDate(stage3.iniDateFormatted)" v-on="on" ></v-text-field>
                            </template>
                            
                            <v-date-picker v-model="stage3.editedItemDateIni" no-title @input="stage3.dateInit = false" locale="pt"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col :cols="3">
                        <v-menu ref="stage3.dateFinal" v-model="stage3.dateFinal" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="stage3.dateFormattedFinal" readonly :prepend-inner-icon="'mdi-calendar'" label="Data Conclusão" 
                                hint="informe a data desejada" v-bind="attrs" @blur="stage3.editedDateFinal = parseDate(stage3.dateFormattedFinal)" v-on="on" ></v-text-field>
                            </template>
                            <v-date-picker v-model="stage3.editedDateFinal" no-title @input="stage3.dateFinal = false" locale="pt"></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-row>
                        <v-col :cols="6">
                            <v-card class="mx-auto">
                                <v-list class="p-0">
                                    <v-list-item-group v-model="stage3.model" multiple>
                                        <template v-for="(item, i) in stage3.items">
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
                    </v-row>
                </v-row>

                <v-row class="stages">
                    <v-col class="myColumn" :cols="6">
                        <h5>Implantação Etapa 4</h5>
                        <div>
                            <v-progress-circular :value="progressStage4" :size="55" :color="stage4.color">
                                {{ progressStage4 }}%
                            </v-progress-circular>
                        </div>
                    </v-col>

                    <v-col :cols="3">
                        <v-menu ref="stage4.dateInit" v-model="stage4.dateInit" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="stage4.iniDateFormatted" readonly :prepend-inner-icon="'mdi-calendar'" label="Data Início" 
                                hint="informe a data desejada" v-bind="attrs" @blur="stage4.editedItemDateIni = parseDate(stage4.iniDateFormatted)" v-on="on" ></v-text-field>
                            </template>
                            <v-date-picker v-model="stage4.editedItemDateIni" no-title @input="stage4.dateInit = false" locale="pt"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col :cols="3">
                        <v-menu ref="stage4.dateFinal" v-model="stage4.dateFinal" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="stage4.dateFormattedFinal" readonly :prepend-inner-icon="'mdi-calendar'" label="Data Conclusão" 
                                hint="informe a data desejada" v-bind="attrs" @blur="stage4.editedDateFinal = parseDate(stage4.dateFormattedFinal)" v-on="on" ></v-text-field>
                            </template>
                            <v-date-picker v-model="stage4.editedDateFinal" no-title @input="stage4.dateFinal = false" locale="pt"></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-row>
                        <v-col :cols="6">
                            <v-card class="mx-auto">
                                <v-list class="p-0">
                                    <v-list-item-group v-model="stage4.model" multiple>
                                        <template v-for="(item, i) in stage4.items">
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
                    </v-row>
                </v-row>
                
                <!-- 
                <v-row class="d-flex justify-start align-center text-left">
                    <v-col :cols="3">
                        <h5>Implantação Etapa 1</h5>
                        <div class="ml-5" style="display: inline-block">
                            <v-progress-circular :value="progress" :size="55"  :color="stage1.color">
                                {{ progress }}%
                            </v-progress-circular>
                        </div>
                    </v-col>
                    <v-col :cols="3"/>

                    <v-col :cols="3">
                        <v-menu ref="stage1.dateInit" v-model="stage1.dateInit" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="stage1.iniDateFormatted" readonly :prepend-inner-icon="'mdi-calendar'" label="Data Início" 
                                hint="informe a data desejada" v-bind="attrs" @blur="stage1.editedItemDateIni = parseDate(stage1.iniDateFormatted)" v-on="on" ></v-text-field>
                            </template>
                            
                            <v-date-picker v-model="stage1.editedItemDateIni" no-title @input="stage1.dateInit = false" locale="pt"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col :cols="3">
                        <v-menu ref="stage1.dateFinal" v-model="stage1.dateFinal" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="stage1.dateFormattedFinal" readonly :prepend-inner-icon="'mdi-calendar'" label="Data Conclusão" 
                                hint="informe a data desejada" v-bind="attrs" @blur="stage1.editedDateFinal = parseDate(stage1.dateFormattedFinal)" v-on="on" ></v-text-field>
                            </template>
                            <v-date-picker v-model="stage1.editedDateFinal" no-title @input="stage1.dateFinal = false" locale="pt"></v-date-picker>
                        </v-menu>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col :cols="6">
                        <v-card class="mx-auto">
                            <v-list class="p-0">
                                <v-list-item-group v-model="stage1.model" multiple>
                                    <template v-for="(item, i) in stage1.items">
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
                        <div style="height: 20%;">
                            <v-radio-group class="mt-0 pt-0" v-model="stage1.switch" row>Todos os itens foram instalados?
                                <v-radio class="mx-3" label="Sim" :value="true"></v-radio> 
                                <v-radio label="Não" :value="false" ></v-radio> 
                            </v-radio-group>
                        </div>

                        <div class="form-group" style="height: 80%">
                            <textarea class="form-control" id="exampleFormControlTextarea1" v-if="!stage1.switch" style="height: 100%"></textarea>
                            <textarea class="form-control" id="exampleFormControlTextarea2" v-if="stage1.switch" disabled style="height: 100%"></textarea>
                        </div>
                    </v-col>
                </v-row>

                -->
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
            dialog: false,
            itemSelected: '',
            items: [{ title: 'Click Me' },{ title: 'Click Me' },{ title: 'Click Me' },{ title: 'Click Me 2'}],
            implantsAll: [],
            optionsSystem: ['Maximus Gestão', 'Maximus Lite'],
            id_Store: 1,
            stages: [/* {COD_ETAPA: 1, DESC_ETAPA: "Etapa 1"}, {COD_ETAPA: 2, DESC_ETAPA: "Etapa 2"}, {COD_ETAPA: 3, DESC_ETAPA: "Etapa 3"}, {COD_ETAPA: 4, DESC_ETAPA: "Etapa 4"} */],
            dataClient: {
                RAZAO_LOJA: '',
                CNPJ_LOJA: '',
                ENDERECO_LOJA: '',
                SISTEMA_LOJA: '',
            },
            stage1: {
                items: [/*'Verificar servidor', 'Instalação impressora', 'Instalação certificado digital'*/],
                model: [/*'Instalação impressora'*/],
                switch: true,
                color: 'cyan',
                dateInit: false,
                dateFinal: false,
                iniDateFormatted: '',
                dateFormattedFinal: '',
                editedItemDateIni: '',
                editedDateFinal: '',
            },
            stage2: {
                items: [],
                model: [],
                color: 'cyan',
                dateInit: false,
                dateFinal: false,
                iniDateFormatted: '',
                dateFormattedFinal: '',
                editedItemDateIni: '',
                editedDateFinal: '',
            },
            stage3: {
                items: [],
                model: [],
                color: 'cyan',
                dateInit: false,
                dateFinal: false,
                iniDateFormatted: '',
                dateFormattedFinal: '',
                editedItemDateIni: '',
                editedDateFinal: '',
            },
            stage4: {
                items: [],
                model: [],
                color: 'cyan',
                dateInit: false,
                dateFinal: false,
                iniDateFormatted: '',
                dateFormattedFinal: '',
                editedItemDateIni: '',
                editedDateFinal: '',
            },
            checkImplantation: true,
            serverIP: '',
            roleUserLogged: '',
            dataTable: {
                search: '',
                headers: [
                    { text: 'Loja', align: 'center', value: 'NOME_LOJA',},
                    { text: 'Razão Social', align: 'center', value: 'RAZAO_LOJA',},
                    { text: 'CNPJ', align: 'center', value: 'CNPJ_LOJA'},
                    { text: 'Sistema', align: 'center', value: 'SISTEMA_LOJA' , searchable: false},
                    { text: 'Data Inicial', align: 'center', value: 'DATAINI_LOJA' },
                    { text: 'Ações', align: 'center', value: 'action', sortable: false }
                ],
                items: [
                    //{ ID_LOJA: 0, RAZAO_LOJA: 'A M LEITE', CNPJ: '07.897.182/0001-94', DATAINI_LOJA: '01-10-2022', value: 'Big Farma'},
                    //{ ID_LOJA: 1, RAZAO_LOJA: 'A. C. S. GONTIJO OLIVEIRA - EIRELI', CNPJ: '21.918.236/0001-81', DATAINI_LOJA: '05-10-2022', value: 'Preço Popular'},
                    //{ ID_LOJA: 2, RAZAO_LOJA: 'DAVIFARMA MEDICAMENTOS E PERFUMARIAS E COSMETICOS LTDA', CNPJ: '40.930.296/0001-64', DATAINI_LOJA: '01-10-2022', value: 'Davi Farma'},
                    //{ ID_LOJA: 3, RAZAO_LOJA: 'STAR FARMA LTDA', CNPJ: '34.088.313/0001-65', DATAINI_LOJA: '01-11-2022', value: 'STAR FARMA'},
                ],
            },
            USUARIO_SELECT:[{ ID_USUARIO: 1, LOGIN_USUARIO: 'Rafael', IMG_USUARIO: 'Rafael' }, { ID_USUARIO: 3, LOGIN_USUARIO: 'Jonas', IMG_USUARIO: 'Jonas' },],
            USUARIO_SELECT2:[{ ID_USUARIO: 1, LOGIN_USUARIO: 'Rafael', IMG_USUARIO: 'Rafael' }, { ID_USUARIO: 3, LOGIN_USUARIO: 'Jonas', IMG_USUARIO: 'Jonas' }],
            USUARIO2: [
                'Rafael', 'Gabriel', 'Jonas', 'Gyselle', 'Eduardo', 'Maurício Xavier', 'Raynaldo Macedo'
            ],
            USUARIO: [
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
        this.serverIP = scrypt.serverIP
        this.myFunction();
    },
    methods: {
        teste(loginUser){
            var element = this.USUARIO.find(element => element.LOGIN_USUARIO == loginUser)
            if(element != undefined && element != null){
                if(this.USUARIO_SELECT.find(element => element.LOGIN_USUARIO == loginUser) != undefined){
                    this.USUARIO_SELECT = this.USUARIO_SELECT.filter(teste => teste.LOGIN_USUARIO != loginUser)
                }
                else{
                    this.USUARIO_SELECT.push(element)
                }
            }
        },
        testeeeeee(){
            alert('asdsa ')
        },
        addMembers(element){
            this.itemSelected = element;
            this.dialog = true;
        },
        myFunction(){
            this.roleUserLogged = localStorage.getItem("roleUser")
        
            axios.get(`${this.serverIP}/stores`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
                }).then(res => {
                    for(var y=0; y < res.data.stores.length; y++) {
                        Vue.set(this.dataTable.items, y, {"NOME_LOJA" : res.data.stores[y].NUMERO_LOJA == "0" ? res.data.stores[y].NOME_REDE + " " + "Integração" : res.data.stores[y].NOME_REDE + ' ' + res.data.stores[y].NUMERO_LOJA, "ID_LOJA" : res.data.stores[y].ID_LOJA, RAZAO_LOJA: res.data.stores[y].RAZAO_LOJA, CNPJ_LOJA: this.transformCNPJ(res.data.stores[y].CNPJ_LOJA), ENDERECO_LOJA: res.data.stores[y].ENDERECO_LOJA, SISTEMA_LOJA: res.data.stores[y].SISTEMA_LOJA == 1 ? "Maximus Gestão" : "Maximus Lite" , DATAINI_LOJA: '01-10-2022', value: res.data.stores[y].NOME_REDE})
                    }
                }).catch(err => {
                    console.log("Erro: " + err)
                }
            )

            axios.get(`${this.serverIP}/stages`, {
            }).then(res => {
                this.stages = res.data

            }).catch(err => {
                console.log(err);
            })

            axios.get(`${this.serverIP}/implants`, {
            }).then(res => {
                this.implantsAll = res.data.implants
                this.stages.forEach(stage => {
                    console.log("stage " + JSON.stringify(stage.COD_ETAPA))
                })
                this.implantsAll.filter(store => store.ID_LOJA == 2).forEach(element => {
                    if(element.COD_ETAPA == 1){
                        this.stage1.items.push(element.DESC_ITEM)
                        if(element.IMP_STATUSOK == 1){
                            this.stage1.model.push(element.DESC_ITEM)
                        }
                    }
                    else if(element.COD_ETAPA == 2){
                        this.stage2.items.push(element.DESC_ITEM)
                        if(element.IMP_STATUSOK == 1){
                            this.stage2.model.push(element.DESC_ITEM)
                        }
                    }
                    
                    else if(element.COD_ETAPA == 3){
                        this.stage3.items.push(element.DESC_ITEM)
                        if(element.IMP_STATUSOK == 1){
                            this.stage3.model.push(element.DESC_ITEM)
                        }
                    }
                    
                    else if(element.COD_ETAPA == 4){
                        this.stage4.items.push(element.DESC_ITEM)
                        if(element.IMP_STATUSOK == 1){
                            this.stage4.model.push(element.DESC_ITEM)
                        }
                    }
                });
                    this.stage1.iniDateFormatted = this.formatDate(this.implantsAll.find(store => store.ID_LOJA == this.id_Store && store.COD_ETAPA == 1).DATASIMP_DATAINICIAL.substr(0,10));
                    this.stage1.editedItemDateIni = this.parseDate(this.stage1.iniDateFormatted)
                    this.stage1.dateFormattedFinal = this.formatDate(this.implantsAll.find(store => store.ID_LOJA == this.id_Store && store.COD_ETAPA == 1).DATASIMP_DATAFINAL.substr(0,10));
                    this.stage1.editedDateFinal = this.parseDate(this.stage1.dateFormattedFinal)
                    if(this.stage1.iniDateFormatted > this.stage1.dateFormattedFinal ){
                        this.stage1.dateFormattedFinal = '';
                        this.stage1.editedDateFinal = '';
                    }

                    if(this.implantsAll.find(store => store.ID_LOJA == this.id_Store && store.COD_ETAPA == 2)){
                        this.stage2.iniDateFormatted = this.formatDate(this.implantsAll.find(store => store.ID_LOJA == this.id_Store && store.COD_ETAPA == 2).DATASIMP_DATAINICIAL.substr(0,10));
                        this.stage2.editedItemDateIni = this.parseDate(this.stage2.iniDateFormatted)
                        this.stage2.dateFormattedFinal = this.formatDate(this.implantsAll.find(store => store.ID_LOJA == this.id_Store && store.COD_ETAPA == 2).DATASIMP_DATAFINAL.substr(0,10));
                        this.stage2.editedDateFinal = this.parseDate(this.stage2.dateFormattedFinal)
                        if(this.stage2.iniDateFormatted > this.stage2.dateFormattedFinal ){
                            this.stage2.dateFormattedFinal = '';
                            this.stage2.editedDateFinal = '';
                        }
                    }

                    this.stage3.iniDateFormatted = this.formatDate(this.implantsAll.find(store => store.ID_LOJA == this.id_Store && store.COD_ETAPA == 3).DATASIMP_DATAINICIAL.substr(0,10));
                    this.stage3.editedItemDateIni = this.parseDate(this.stage3.iniDateFormatted)
                    this.stage3.dateFormattedFinal = this.formatDate(this.implantsAll.find(store => store.ID_LOJA == this.id_Store && store.COD_ETAPA == 3).DATASIMP_DATAFINAL.substr(0,10));
                    this.stage3.editedDateFinal = this.parseDate(this.stage3.dateFormattedFinal)
                    if(this.stage3.iniDateFormatted > this.stage3.dateFormattedFinal ){
                        this.stage3.dateFormattedFinal = '';
                        this.stage3.editedDateFinal = '';
                    }

                    this.stage4.iniDateFormatted = this.formatDate(this.implantsAll.find(store => store.ID_LOJA == this.id_Store && store.COD_ETAPA == 4).DATASIMP_DATAINICIAL.substr(0,10));
                    this.stage4.editedItemDateIni = this.parseDate(this.stage4.iniDateFormatted)
                    this.stage4.dateFormattedFinal = this.formatDate(this.implantsAll.find(store => store.ID_LOJA == this.id_Store && store.COD_ETAPA == 4).DATASIMP_DATAFINAL.substr(0,10));
                    this.stage4.editedDateFinal = this.parseDate(this.stage4.dateFormattedFinal)
                    if(this.stage4.iniDateFormatted > this.stage4.dateFormattedFinal ){
                        this.stage4.dateFormattedFinal = '';
                        this.stage4.editedDateFinal = '';
                    }
                }).catch(err => {
                    console.log("Erro: " + err)
                }
            )
        },
        parseDate (date) {
            if (!date) return null

            const [day, month, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
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
            console.log('item ' + item);
            var aux = this.implantsAll.find(element => element.ID_LOJA == item.ID_LOJA)
            if(aux != undefined){
                this.dataClient.RAZAO_LOJA = item.RAZAO_LOJA
                this.dataClient.CNPJ_LOJA = item.CNPJ_LOJA
                this.dataClient.ENDERECO_LOJA = item.ENDERECO_LOJA;
                this.dataClient.SISTEMA_LOJA = item.SISTEMA_LOJA
                this.checkImplantation = !this.checkImplantation;
            } else{
                alert("Elemento inválido, deseja criar uma implantação para esta loja?")
            }
            
        },
        formatDate (date) {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
        },
        transformCNPJ(value){
            if(value){
                return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
            } else{
                return value
            }
        },
        clique() {
            scrypt.clique(this);
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
        getFirstName(value){
            return value.split(' ')[0];
        },
        toDate(value){
            return value.substr(0, 10)
        },
        
    },
    computed: {
      progressStage1 () {
        return Math.trunc(this.stage1.model.length / this.stage1.items.length * 100);
      },
      progressStage2 () {
        return Math.trunc(this.stage2.model.length / this.stage2.items.length * 100);
      },
      progressStage3 () {
        return Math.trunc(this.stage3.model.length / this.stage3.items.length * 100);
      },
      progressStage4 () {
        return Math.trunc(this.stage4.model.length / this.stage4.items.length * 100);
      },
    },
    watch: {
        'stage1.editedItemDateIni'(){
            this.stage1.iniDateFormatted = this.formatDate(this.stage1.editedItemDateIni);
        },
        'stage1.editedDateFinal'(){
            this.stage1.dateFormattedFinal = this.formatDate(this.stage1.editedDateFinal);
        },
        'dataClient.CNPJ_LOJA'(){
            if(this.dataClient.CNPJ_LOJA != "" && this.dataClient.CNPJ_LOJA != null) {
                if(this.dataClient.CNPJ_LOJA.length == 3) {
                    this.dataClient.CNPJ_LOJA = this.dataClient.CNPJ_LOJA.replace(/\D/g, '').replace(/^(\d{2})/, "$1.")
                }
                else if(this.dataClient.CNPJ_LOJA.length == 7){
                    this.dataClient.CNPJ_LOJA = this.dataClient.CNPJ_LOJA.replace(/\D/g, '').replace(/^(\d{2})(\d{3})/, "$1.$2.")
                }
                else if(this.dataClient.CNPJ_LOJA.length == 10){
                    this.dataClient.CNPJ_LOJA = this.dataClient.CNPJ_LOJA.replace(/\D/g, '').replace(/^(\d{2})(\d{3})(\d{3})/, "$1.$2.$3/")
                }
                else if(this.dataClient.CNPJ_LOJA.length == 16){
                    this.dataClient.CNPJ_LOJA = this.dataClient.CNPJ_LOJA.replace(/\D/g, '').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})/, "$1.$2.$3/$4-")
                }
                else if(this.dataClient.CNPJ_LOJA.length > 18){
                    this.dataClient.CNPJ_LOJA = this.dataClient.CNPJ_LOJA.substr(0, 18).replace(/\D/g, '').replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5")
                }
            }
        },

        progressStage1 () {
            if(this.stage1.model.length / this.stage1.items.length * 100 == 100){
                this.stage1.color = 'success'
            } else{
                this.stage1.color = 'cyan'
            }
        },
        progressStage2 () {
            if(this.stage2.model.length / this.stage2.items.length * 100 == 100){
                this.stage2.color = 'success'
            } else{
                this.stage2.color = 'cyan'
            }
        },
        progressStage3 () {
            if(this.stage3.model.length / this.stage3.items.length * 100 == 100){
                this.stage3.color = 'success'
            } else{
                this.stage3.color = 'cyan'
            }
        },
        progressStage4 () {
            if(this.stage4.model.length / this.stage4.items.length * 100 == 100){
                this.stage4.color = 'success'
            } else{
                this.stage4.color = 'cyan'
            }
        },
    },
    
}
</script>