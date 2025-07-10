<template>
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
                    <a href="#">Implantações</a>
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
            
            <v-snackbar style="z-index: 99999" v-model="snackbar" timeout="3000" :color="snackbarColor" fixed top right elevation="24">
                <strong>{{ snackbarText }}</strong>

                <template v-slot:action="{ attrs }">
                    <v-btn color="White" text v-bind="attrs" @click="snackbar = false">Fechar</v-btn>
                </template>
            </v-snackbar>

            <v-container fluid v-show="!checkImplantation">
                <v-dialog v-model="dialogMsgSuccess" max-width="600">
                    <v-card>
                        <v-toolbar class="text-center" color="success" dark>Maximus Farma</v-toolbar>
                        <v-card-text class="text-center">
                            <div class="text-h5 pa-12">{{ msgSuccess }}</div>
                            <v-btn class="success" @click="dialogMsgSuccess = false">CONFIRMAR</v-btn>
                        </v-card-text>
                    </v-card>
                </v-dialog>

                <div id="chat">

                </div>
                <v-row justify="center">
<v-sheet
    height="400"
    class="overflow-hidden"
    style="position: relative;"
  >
    <v-container class="fill-height">
      <v-row
        align="center"
        justify="center"
      >
        <v-btn
          color="pink"
          dark
          @click.stop="drawer = !drawer"
        >
          Toggle
        </v-btn>
      </v-row>
    </v-container>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list-item>
        <v-list-item-avatar class="mr-0">
           <v-icon>mdi-account-circle</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Lista de Usuários</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list class="w-auto" dense>
  <v-list-item v-for="user in USUARIO" :key="user.ID_USUARIO" style="max-width: 100%">
    <v-list-item-icon>
      <v-icon :color="user.ID_USUARIO == 5 ? 'green' : 'red'">mdi-circle</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>{{ user.LOGIN_USUARIO }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</v-list>
    </v-navigation-drawer>
  </v-sheet>



                    <v-menu v-for="user in USUARIO" :key="user.ID_USUARIO" bottom min-width="200px" rounded offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon x-large v-on="on">
                                <v-avatar color="brown" size="48" v-if="user.IMG_USUARIO != '' &&  user.IMG_USUARIO != null">
                                    <img :src='"" + user.IMG_USUARIO' :alt="user.LOGIN_USUARIO">
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
                                        <img :src='"" + user.IMG_USUARIO' :alt="user.LOGIN_USUARIO">
                                    </v-avatar>
                                    <v-avatar size="48" v-else color="red">
                                        <span class="white--text text-h6">{{ user.LOGIN_USUARIO | reversedMessage(user.LOGIN_USUARIO) }}</span>
                                    </v-avatar>
                                    <h3>{{ user.LOGIN_USUARIO }}</h3>
                                    <p class="text-caption mt-1">
                                        {{ user.LOGIN_USUARIO }}
                                    </p>
                                    <v-divider class="my-3"></v-divider>
                                    <input type="file" ref="fileInput" id="fileInput" @change="onFileChange" style="display: none">
                                    <v-btn depressed rounded text @click="alterPhoto(user)">
                                        Trocar Foto de Perfil
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

                                <template v-slot:[`item.action`]="{ item }"> 
                                    <v-btn class="ml-auto" color="success" @click="viewItem(item)">Selecionar</v-btn>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>

            <v-container id="implantation" fluid v-show="checkImplantation">
                <v-dialog v-model="dialog" persistent max-width="600">
                    <v-card>
                        <v-toolbar class="text-center" color="dark" dark>Atribua membros a {{ itemSelected.DESC_ITEM }}</v-toolbar>
                        <v-card-text class="text-center">
                            <div class="text-h5 pa-12">
                                <v-combobox hide-selected solo v-model="itemSelected.USUARIOS" :items="USUARIO" item-text="LOGIN_USUARIO" return-object label="Usuários" multiple chips>
                                    <template v-slot:selection="data"> 
                                        <v-chip :key="JSON.stringify(data.item)" close v-bind="data.attrs" :input-value="data.selected" :disabled="data.disabled" @click:close="data.parent.selectItem(data.item)">
                                            <v-avatar class="accent white--text" left v-if="data.item.IMG_USUARIO != '' &&  data.item.IMG_USUARIO != null">
                                                <img :src='"../../assets/img/Funcionarios/" + data.item.IMG_USUARIO +  ".jpg"' :alt="data.item.LOGIN_USUARIO">
                                            </v-avatar>
                                            <v-avatar class="accent white--text" :v-text="data.item.LOGIN_USUARIO.slice(0, 1).toUpperCase()" left v-else/>
                                            {{ data.item.LOGIN_USUARIO | getFirstName }}
                                        </v-chip>
                                    </template>
                                </v-combobox>
                            </div>
                            <v-btn class="success" @click="saveMembersItem()">Fechar</v-btn>
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
                    <h5 id="syncUsersStage" @click="syncUsersStage()">Relatório de implantação</h5>
                    <input type="text" class="d-none" id="inputText">
                    <input type="text" class="d-none" id="inputActive">
                    <input type="text" class="d-none" id="inputID_LOJA">
                    <input type="text" class="d-none" id="divUsersStage1">
                    <input type="text" class="d-none" id="divUsersStage2">
                    <input type="text" class="d-none" id="divUsersStage3">
                    <input type="text" class="d-none" id="divUsersStage4">
                    <div id="divItemsAux" class="d-none" @click="usersItemsRefresh()"/>
                    <input type="text" class="" id="inputItemsAux">
                </v-row>

                <v-row id="dataImplant" @click="syncInfo()">
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
                        <v-select v-model="dataClient.SISTEMA_LOJA" :items="optionsSystem" label="Sistema" required></v-select>
                    </v-col>
                </v-row>
                
                <v-row class="stages">
                    <v-col class="myColumn" :cols="12" :lg="3">
                        <h5>Implantação Etapa 1</h5>
                        
                        <div>
                            <v-progress-circular :value="progressStage1" :size="55" :color="stage1.color">
                                {{ progressStage1 }}%
                            </v-progress-circular>
                        </div>
                    </v-col>

                    <v-col :cols="12" :lg="5">
                        <v-combobox v-model="stage1.usersStage" :items="USUARIO" item-text="LOGIN_USUARIO" return-object label="Usuários" @change="saveMembersStage()" multiple chips>
                            <template v-slot:selection="data">
                                <v-chip :key="JSON.stringify(data.item)" close v-bind="data.attrs" :input-value="data.selected" :disabled="data.disabled" @click:close="data.parent.selectItem(data.item)">
                                    <v-avatar class="accent white--text" left v-if="data.item.IMG_USUARIO != '' && data.item.IMG_USUARIO != null">
                                        <img :src='"../../assets/img/Funcionarios/" + data.item.IMG_USUARIO + ".jpg"' :alt="data.item.LOGIN_USUARIO">
                                    </v-avatar>
                                    <v-avatar class="accent white--text" :v-text="data.item.LOGIN_USUARIO.slice(0, 1).toUpperCase()" left v-else/>
                                    {{ data.item.LOGIN_USUARIO | getFirstName }}
                                </v-chip>
                            </template>
                        </v-combobox>
                    </v-col>

                    <v-col :cols="6" :lg="2">
                        <v-menu ref="stage1.dateInit" v-model="stage1.dateInit" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="stage1.iniDateFormatted" readonly :prepend-inner-icon="'mdi-calendar'" label="Data Início" 
                                hint="informe a data desejada" v-bind="attrs" @blur="stage1.editedItemDateIni = parseDate(stage1.iniDateFormatted)" v-on="on" ></v-text-field>
                            </template>
                            <v-date-picker v-model="stage1.editedItemDateIni" no-title @input="stage1.dateInit = false" locale="pt"></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col :cols="6" :lg="2">
                        <v-menu ref="stage1.dateFinal" v-model="stage1.dateFinal" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="stage1.dateFormattedFinal" readonly :prepend-inner-icon="'mdi-calendar'" label="Data Conclusão" 
                                hint="informe a data desejada" v-bind="attrs" @blur="stage1.editedDateFinal = parseDate(stage1.dateFormattedFinal)" v-on="on" ></v-text-field>
                            </template>
                            <v-date-picker v-model="stage1.editedDateFinal" no-title @input="stage1.dateFinal = false" locale="pt"></v-date-picker>
                        </v-menu>
                    </v-col>
                    
                    <div class="separate"/>
                    <v-row class="containerItens">
                        <v-col class="col-12 col-lg-11 col-xl-6">
                            <v-card class="mx-auto">
                                <v-list class="p-0">
                                    <v-list-item-group v-model="stage1.model" multiple>
                                        <template v-for="(item, i) in stage1.items">
                                            <v-divider v-if="!item" :key="`divider-${i}`"></v-divider>
                                            <v-list-item v-else :active="false" :key="`item-${i}`" :value="item.DESC_ITEM" active-class="success text-white" @click="selectItemImp(item.DESC_ITEM)">
                                                <template v-slot:default="{ active }">
                                                    <v-list-item-action>
                                                        <v-checkbox :input-value="active" color="white"></v-checkbox>
                                                    </v-list-item-action>

                                                    <v-list-item-content>
                                                        <v-list-item-title v-text="item.DESC_ITEM"></v-list-item-title>
                                                    </v-list-item-content>

                                                    <v-list-item-icon class="display: flex; align-items-center"> 
                                                        <span v-for="user in item.USUARIOS" :key="user.ID_USUARIO">
                                                            <v-avatar color="brown" size="36" v-if="user.IMG_USUARIO != '' &&  user.IMG_USUARIO != null">
                                                                <img :src='"../../assets/img/Funcionarios/" + user.IMG_USUARIO + ".jpg"' :alt="user.LOGIN_USUARIO">
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

                        <v-col class="col-12 col-lg-11 col-xl-6 observation">
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
                    <v-col class="myColumn" :cols="3">
                        <h5>Implantação Etapa 2</h5>
                        <div>
                            <v-progress-circular :value="progressStage2" :size="55" :color="stage2.color">
                                {{ progressStage2 }}%
                            </v-progress-circular>
                        </div>
                    </v-col>

                    <v-col :cols="5">
                        <v-combobox v-model="stage2.usersStage" :items="USUARIO" item-text="LOGIN_USUARIO" return-object label="Usuários" multiple chips>
                            <template v-slot:selection="data">
                                <v-chip :key="JSON.stringify(data.item)" close v-bind="data.attrs" :input-value="data.selected" :disabled="data.disabled" @click:close="data.parent.selectItem(data.item)">
                                    <v-avatar class="accent white--text" left v-if="data.item.IMG_USUARIO != '' && data.item.IMG_USUARIO != null">
                                        <img :src='"../../assets/img/Funcionarios/" + data.item.IMG_USUARIO + ".jpg"' :alt="data.item.LOGIN_USUARIO">
                                    </v-avatar>
                                    <v-avatar class="accent white--text" :v-text="data.item.LOGIN_USUARIO.slice(0, 1).toUpperCase()" left v-else/>
                                    {{ data.item.LOGIN_USUARIO | getFirstName }}
                                </v-chip>
                            </template>
                        </v-combobox>
                    </v-col>

                    <v-col :cols="2">
                        <v-menu ref="stage2.dateInit" v-model="stage2.dateInit" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="stage2.iniDateFormatted" readonly :prepend-inner-icon="'mdi-calendar'" label="Data Início" 
                                hint="informe a data desejada" v-bind="attrs" @blur="stage2.editedItemDateIni = parseDate(stage2.iniDateFormatted)" v-on="on" ></v-text-field>
                            </template>
                            
                            <v-date-picker v-model="stage2.editedItemDateIni" no-title @input="stage2.dateInit = false" locale="pt"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col :cols="2">
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
                    <v-col class="myColumn" :cols="3">
                        <h5>Implantação Etapa 3</h5>

                        <div>
                            <v-progress-circular :value="progressStage3" :size="55" :color="stage3.color">
                                {{ progressStage3 }}%
                            </v-progress-circular>
                        </div>
                    </v-col>

                    <v-col :cols="5">
                        <v-combobox v-model="stage3.usersStage" :items="USUARIO" item-text="LOGIN_USUARIO" return-object label="Usuários" multiple chips>
                            <template v-slot:selection="data">
                                <v-chip :key="JSON.stringify(data.item)" close v-bind="data.attrs" :input-value="data.selected" :disabled="data.disabled" @click:close="data.parent.selectItem(data.item)">
                                    <v-avatar class="accent white--text" left v-if="data.item.IMG_USUARIO != '' && data.item.IMG_USUARIO != null">
                                        <img :src='"../../assets/img/Funcionarios/" + data.item.IMG_USUARIO + ".jpg"' :alt="data.item.LOGIN_USUARIO">
                                    </v-avatar>
                                    <v-avatar class="accent white--text" :v-text="data.item.LOGIN_USUARIO.slice(0, 1).toUpperCase()" left v-else/>
                                    {{ data.item.LOGIN_USUARIO | getFirstName }}
                                </v-chip>
                            </template>
                        </v-combobox>
                    </v-col>

                    <v-col :cols="2">
                        <v-menu ref="stage3.dateInit" v-model="stage3.dateInit" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="stage3.iniDateFormatted" readonly :prepend-inner-icon="'mdi-calendar'" label="Data Início" 
                                hint="informe a data desejada" v-bind="attrs" @blur="stage3.editedItemDateIni = parseDate(stage3.iniDateFormatted)" v-on="on" ></v-text-field>
                            </template>
                            
                            <v-date-picker v-model="stage3.editedItemDateIni" no-title @input="stage3.dateInit = false" locale="pt"></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col :cols="2">
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
                    <v-col class="myColumn" :cols="3">
                        <h5>Implantação Etapa 4</h5>
                        <div>
                            <v-progress-circular :value="progressStage4" :size="55" :color="stage4.color">
                                {{ progressStage4 }}%
                            </v-progress-circular>
                        </div>
                    </v-col>

                    <v-col :cols="5">
                        <v-combobox v-model="stage4.usersStage" :items="USUARIO" item-text="LOGIN_USUARIO" return-object label="Usuários" multiple chips>
                            <template v-slot:selection="data">
                                <v-chip :key="JSON.stringify(data.item)" close v-bind="data.attrs" :input-value="data.selected" :disabled="data.disabled" @click:close="data.parent.selectItem(data.item)">
                                    <v-avatar class="accent white--text" left v-if="data.item.IMG_USUARIO != '' && data.item.IMG_USUARIO != null">
                                        <img :src='"../../assets/img/Funcionarios/" + data.item.IMG_USUARIO + ".jpg"' :alt="data.item.LOGIN_USUARIO">
                                    </v-avatar>
                                    <v-avatar class="accent white--text" :v-text="data.item.LOGIN_USUARIO.slice(0, 1).toUpperCase()" left v-else/>
                                    {{ data.item.LOGIN_USUARIO | getFirstName }}
                                </v-chip>
                            </template>
                        </v-combobox>
                    </v-col>

                    <v-col :cols="2">
                        <v-menu ref="stage4.dateInit" v-model="stage4.dateInit" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="stage4.iniDateFormatted" readonly :prepend-inner-icon="'mdi-calendar'" label="Data Início" 
                                hint="informe a data desejada" v-bind="attrs" @blur="stage4.editedItemDateIni = parseDate(stage4.iniDateFormatted)" v-on="on" ></v-text-field>
                            </template>
                            <v-date-picker v-model="stage4.editedItemDateIni" no-title @input="stage4.dateInit = false" locale="pt"></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col :cols="2">
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
            </v-container>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import '../../assets/style/style.css'
import scrypt from "../../assets/js/scrypt";
import axios from 'axios';
import SocketioService from '../../../services/socketio.service.js';

export default {
    data(){
        return {
            drawer: null,
            dialog: false,
            dialogMsgSuccess: false,
            msgSuccess: '',
            itemSelected: '',
            items: [{ title: 'Click Me' }, { title: 'Click Me' }, { title: 'Click Me' }, { title: 'Click Me 2'}],
            implantsAll: [],
            usersImplants: [],
            pageLoaded: false,
            optionsSystem: ['Maximus Gestão', 'Maximus Lite'],
            id_Store: 1,
            usersItemAux: [],
            stages: [/* {COD_ETAPA: 1, DESC_ETAPA: "Etapa 1"}, {COD_ETAPA: 2, DESC_ETAPA: "Etapa 2"}, {COD_ETAPA: 3, DESC_ETAPA: "Etapa 3"}, {COD_ETAPA: 4, DESC_ETAPA: "Etapa 4"} */],
            dataClient: {
                ID_LOJA: '',
                RAZAO_LOJA: '',
                CNPJ_LOJA: '',
                ENDERECO_LOJA: '',
                SISTEMA_LOJA: '',
                IMP_CODIMP: '',
                IMP_CODITEM: '',
                IMP_CODLOJA: '',
                ETAPA_CODETAPA: '',
                ITEM_CODETAPA: '',
                ITEM_ATIVO: ''
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
                usersStageItem: [],
                usersStage:[/*{ ID_USUARIO: 3, LOGIN_USUARIO: 'Erick', IMG_USUARIO: 'Erick'}*/],
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
                usersStage:[],
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
                usersStage:[],
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
                usersStage:[],
            },
            allItems: {
                IMP_CODIMP: 0,
                IMP_CODLOJA: 0,
                IMP_STATUSOK: 0,
                IMP_CODITEM: 0,
                ETAPA_CODETAPA: 0,
                ITEM_CODETAPA: 0,
                IMP_USUARIOSITEM: 0
            },
            checkImplantation: false,
            serverIP: '',
            roleUserLogged: '',
            snackbar: false,
            snackbarText: '',
            snackbarColor: '',
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
            USUARIO_SELECT:[{ ID_USUARIO: 3, LOGIN_USUARIO: 'rafael123', IMG_USUARIO: '' }],
            USUARIO_SELECT2:[{ ID_USUARIO: 1, LOGIN_USUARIO: 'MAXIMUS', IMG_USUARIO: '' }],
            USUARIO2: [
                'rafael123', 'Douglas', 'Eduardo'//, 'Gyselle', 'Eduardo', 'Maurício Xavier'
            ],
            USUARIO: [
                //{ ID_USUARIO: 1, LOGIN_USUARIO: 'Rafael', IMG_USUARIO: 'Rafael' },
                //{ ID_USUARIO: 2, LOGIN_USUARIO: 'Gabriel', IMG_USUARIO: 'Gabriel' },
                //{ ID_USUARIO: 3, LOGIN_USUARIO: 'Erick', IMG_USUARIO: 'Erick' },
                //{ ID_USUARIO: 4, LOGIN_USUARIO: 'Gyselle', IMG_USUARIO: 'Gyselle' },
                //{ ID_USUARIO: 5, LOGIN_USUARIO: 'Eduardo', IMG_USUARIO: 'Eduardo' },
                //{ ID_USUARIO: 6, LOGIN_USUARIO: 'Maurício Xavier', IMG_USUARIO: '' },
                //{ ID_USUARIO: 7, LOGIN_USUARIO: 'Rubens', IMG_USUARIO: 'Rubens' }
            ],
            ID_USER_PHOTO: 0
        }
    },
    created(){
        alert("Você não possui permissão para acessar esta página.\n\nVocê será direcionado para a página inicial.");
        this.$router.push({name: "Index"})

        this.roleUserLogged = localStorage.getItem("roleUser")
        this.serverIP = scrypt.serverIP;
        this.myFunction();
    },
    methods: {
        addMembers(element){
            this.itemSelected = element;
            this.dialog = true;
        },
        callmsgSuccess(msg){
            this.msgSuccess =  msg
            this.dialogMsgSuccess = true;
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

            axios.get(`${this.serverIP}/items`, {
            }).then(res => {
               this.allItems = res.data.items
            }).catch(err => {
                console.log(err);
            })

            axios.get(`${this.serverIP}/implants`, {})
                .then(res => {
                    this.implantsAll = res.data.implants
                }).catch(err => {
                    console.log("Erro: " + err)
                }
            )

            this.setArrayUsers();   
        },
        setArrayUsers(){
            this.USUARIO = [];

            axios.get(`${this.serverIP}/user`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then(res => {
                for(var y=0; y < res.data.length; y++) {
                    var user = res.data[y];

                    if(user.IS_FUNCIONARIO == 1){
                        Vue.set(this.USUARIO, this.USUARIO.length, { ID_USUARIO: user.ID_USUARIO, LOGIN_USUARIO: user.LOGIN_USUARIO, IMG_USUARIO: user.IMG_USUARIO })
                    }
                }
            }).catch(err => {
                console.log("Erro: " + err)
            })
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
                localStorage.removeItem("idUser")
                this.$router.push({name: "Home"})
           }
        },
        clearData(){
            this.dataClient.IMP_CODIMP = ''
            this.dataClient.ID_LOJA = ''
            this.dataClient.RAZAO_LOJA = ''
            this.dataClient.CNPJ_LOJA = ''
            this.dataClient.ENDERECO_LOJA = ''
            this.dataClient.IMP_CODLOJA = ''
            this.dataClient.SISTEMA_LOJA = ''
            this.stage1.items = []
            this.stage1.model = []
            this.stage2.items = []
            this.stage2.model = []
            this.stage3.items = []
            this.stage3.model = []
            this.stage4.items = []
            this.stage4.model = []
            this.stage1.iniDateFormatted = ''
            this.stage1.editedItemDateIni = ''
            this.stage1.dateFormattedFinal = ''
            this.stage1.editedDateFinal = ''

            this.stage2.iniDateFormatted = ''
            this.stage2.editedItemDateIni = ''
            this.stage2.dateFormattedFinal = ''
            this.stage2.editedDateFinal = ''

            this.stage3.iniDateFormatted = ''
            this.stage3.editedItemDateIni = ''
            this.stage3.dateFormattedFinal = ''
            this.stage3.editedDateFinal = ''

            this.stage4.iniDateFormatted = ''
            this.stage4.editedItemDateIni = ''
            this.stage4.dateFormattedFinal = ''
            this.stage4.editedDateFinal = ''
        },
        isNumber(value){
            var onlyNumbers = new RegExp('^[0-9]+$')

            if(onlyNumbers.test(value)){
                return true;
            } else{
                return false;
            }
        },
        async alterUserStage(value){
            var arrayElements = [];
            if(value == 1){
                this.stage1.usersStage.forEach(element => {
                    arrayElements.push(element.ID_USUARIO)
                })
            }
            
            if(value == 2){
                this.stage2.usersStage.forEach(element => {
                    arrayElements.push(element.ID_USUARIO)
                })
            }
            
            if(value == 3){
                this.stage3.usersStage.forEach(element => {
                    arrayElements.push(element.ID_USUARIO)
                })
            }
            
            if(value == 4){
                this.stage4.usersStage.forEach(element => {
                    arrayElements.push(element.ID_USUARIO)
                })
            }

            var aux = this.implantsAll.find(element => element.ID_LOJA == this.dataClient.ID_LOJA)

            await axios.patch(`${this.serverIP}/userImplants`, {
                DATASIMP_CODLOJA: this.dataClient.ID_LOJA,
                DATASIMP_CODETAPA: value,
                CODIMP_IMP: aux.IMP_CODIMP,
                DATASIMP_USUARIOS: arrayElements
            }).then(res => {
                if(value == 1) arrayElements = this.stage1.usersStage
                
                if(value == 2) arrayElements = this.stage2.usersStage
                
                if(value == 3) arrayElements = this.stage3.usersStage
                
                if(value == 4) arrayElements = this.stage4.usersStage

                SocketioService.updateStageUsers(this.dataClient.ID_LOJA, aux.IMP_CODIMP, value, arrayElements);

                this.callSnackBar(res.data.success);
            }).catch(err => {
                console.log(err);
            })  
        },
        saveMembersStage(){
            var arrayElements = document.getElementById("divUsersStage1").value

            if(!this.checkArrays(arrayElements, this.stage1.usersStage)){
                this.alterUserStage(1);
            }
        },
        async saveMembersItem(){
            var auxUsuarios = await "";
            this.itemSelected.USUARIOS.forEach(element => {
                auxUsuarios += element.ID_USUARIO + ", ";
            });
            
            this.dialog = await false;

            var aux = this.implantsAll.find(element => element.ID_LOJA == this.dataClient.ID_LOJA)

            await axios.patch(`${this.serverIP}/userItemImp`, {
                IMP_CODLOJA: this.dataClient.ID_LOJA,
                ETAPA_CODETAPA: this.itemSelected.COD_ETAPA,
                IMP_CODITEM: this.itemSelected.COD_ITEM,
                IMP_CODIMP: aux.IMP_CODIMP,
                IMP_USUARIOSITEM: auxUsuarios.slice(0, -2)
            }).then(res => {
                SocketioService.updateItemUsers({ID_LOJA: this.dataClient.ID_LOJA, IMP_CODIMP: aux.IMP_CODIMP, COD_ETAPA: this.itemSelected.COD_ETAPA, IMP_USUARIOSITEM: auxUsuarios.slice(0, -2), COD_ITEM: this.itemSelected.COD_ITEM});

                this.callSnackBar(res.data.success);
            }).catch(err => {
                console.log(err);
            })
        },
        viewItem(item){
            var aux = this.implantsAll.find(element => element.ID_LOJA == item.ID_LOJA)
            if(aux != undefined){
                this.clearData();
                
                axios.get(`${this.serverIP}/userImplants`, {
                    params: {
                        codImp: aux.IMP_CODIMP,
                        codLoja: item.ID_LOJA,
                    }
                }).then(res => {
                    this.usersImplants = res.data.usersImplants;

                    this.usersImplants.forEach(element => {
                        if(element.DATASIMP_USUARIOS != null && element.DATASIMP_USUARIOS != ""){
                            var usuarios = element.DATASIMP_USUARIOS;

                            for(var x=0; x < usuarios.length; x++){
                                if(this.isNumber(usuarios[x])){
                                    if(element.DATASIMP_CODETAPA == 1){
                                        if(this.stage1.usersStage.length == undefined){
                                            this.stage1.usersStage = this.USUARIO.find(element => element.ID_USUARIO == usuarios[x])
                                        } else{
                                            this.stage1.usersStage.push(this.USUARIO.find(element => element.ID_USUARIO == usuarios[x]))
                                        }
                                    }

                                    if(element.DATASIMP_CODETAPA == 2){
                                        if(this.stage2.usersStage.length == undefined){
                                            this.stage2.usersStage = this.USUARIO.find(element => element.ID_USUARIO == usuarios[x])
                                        } else{
                                            this.stage2.usersStage.push(this.USUARIO.find(element => element.ID_USUARIO == usuarios[x]))
                                        }
                                    }

                                    if(element.DATASIMP_CODETAPA == 3){
                                        if(this.stage3.usersStage.length == undefined){
                                            this.stage3.usersStage = this.USUARIO.find(element => element.ID_USUARIO == usuarios[x])
                                        } else{
                                            this.stage3.usersStage.push(this.USUARIO.find(element => element.ID_USUARIO == usuarios[x]))
                                        }
                                    }

                                    if(element.DATASIMP_CODETAPA == 4){
                                        if(this.stage4.usersStage.length == undefined){
                                            this.stage4.usersStage = this.USUARIO.find(element => element.ID_USUARIO == usuarios[x])
                                        } else{
                                            this.stage4.usersStage.push(this.USUARIO.find(element => element.ID_USUARIO == usuarios[x]))
                                        }
                                    }
                                }
                            }
                        }
                    })

                    this.dataClient.IMP_CODIMP = aux.IMP_CODIMP
                    this.dataClient.ID_LOJA = aux.ID_LOJA
                    this.dataClient.RAZAO_LOJA = item.RAZAO_LOJA
                    this.dataClient.CNPJ_LOJA = item.CNPJ_LOJA
                    this.dataClient.ENDERECO_LOJA = item.ENDERECO_LOJA;
                    this.dataClient.IMP_CODLOJA = item.ID_LOJA
                    this.dataClient.SISTEMA_LOJA = item.SISTEMA_LOJA
                    this.checkImplantation = !this.checkImplantation;

                    this.implantsAll.filter(store => store.ID_LOJA == aux.ID_LOJA).forEach(element => {
                        if(element.COD_ETAPA == 1){
                            const targetIds = element.IMP_USUARIOSITEM.split(', ').map(Number);

                            var user = [];
                            var data = this.USUARIO.filter(e => targetIds.includes(e.ID_USUARIO));

                            for(var x = 0; x < data.length; x++){
                                user[x] = data[x];
                            }

                            this.stage1.items.push({DESC_ITEM: element.DESC_ITEM, COD_ETAPA: element.COD_ETAPA, COD_ITEM: element.COD_ITEM, USUARIOS: user})

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
                    console.log(err);
                })
            } else{
                var confirmation = confirm("Elemento inválido, deseja criar uma implantação para esta loja ? ")
                if(confirmation){
                    var NOME_LOJA = this.dataTable.items.filter(element => element.ID_LOJA == item.ID_LOJA)[0].NOME_LOJA
                    this.newImp(item.ID_LOJA, NOME_LOJA)
                }
            }
            
        },
        formatDate (date) {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
        },
        newImp(ID_LOJA, NOME_LOJA){
            axios.post(`${this.serverIP}/implantation`, {
                IMP_IDSTORES: [ID_LOJA]
            }).then(() => {
                this.implantsAll = []
                axios.get(`${this.serverIP}/implants`, {
                }).then(res => {
                    this.implantsAll = res.data.implants
                    /* this.stages.forEach(stage => { // 555
                        console.log("stage " + JSON.stringify(stage.COD_ETAPA))
                    })*/
                    
                    }).catch(err => {
                        console.log("Erro: " + err)
                    }
                )
                this.callmsgSuccess(`Implantação para a loja ${NOME_LOJA} criado com sucesso`)
            }).catch(err => {
                this.msgErr = err.response.data.err
                this.dialogErr = true
            })
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
        },
        callSnackBar(msg, error){
            this.snackbarColor = error ? 'red' : 'green darken-3'
            this.snackbarText = msg
            this.snackbar = true;
        },
        selectItemImp(item){
            if(this.allItems){ 
                var aux = this.allItems.find(element => element.DESC_ITEM == item)
                this.dataClient.IMP_CODITEM = aux.COD_ITEM
                this.dataClient.ITEM_ATIVO = this.stage1.model.find(element => element == item) == undefined ? "1" : "0"
                this.dataClient.ITEM_CODETAPA = aux.ITEM_CODETAPA
                this.dataClient.ETAPA_CODETAPA = aux.ITEM_CODETAPA
            }

            this.updateItem(aux.DESC_ITEM);
        },
        async updateItem(DESC_ITEM){
            if(this.dataClient.IMP_CODITEM != '' && this.checkImplantation){
                await axios.patch(`${this.serverIP}/implants`, {
                    IMP_CODIMP: this.dataClient.IMP_CODIMP,
                    IMP_CODLOJA: this.dataClient.ID_LOJA,
                    IMP_STATUSOK: this.dataClient.ITEM_ATIVO,
                    IMP_CODITEM: this.dataClient.IMP_CODITEM,
                    ETAPA_CODETAPA: this.dataClient.ETAPA_CODETAPA,
                    ITEM_CODETAPA: this.dataClient.ETAPA_CODETAPA
                }).then(res => {
                    SocketioService.updateItemImp(DESC_ITEM, this.dataClient.ITEM_ATIVO, this.dataClient.ID_LOJA);

                    this.callSnackBar(res.data.success);
                }).catch(err => {
                    console.log(err);
                })  
            }
        },
        syncInfo(){
            var ID_LOJA = document.getElementById("inputID_LOJA").value

            if(ID_LOJA == this.dataClient.ID_LOJA){
                var element = document.getElementById("inputText").value
                var itemActive = document.getElementById("inputActive").value 
                
                if(itemActive == 1){
                    this.stage1.model.push(element)
                } else{
                    this.stage1.model = this.stage1.model.filter(e => e != element)
                }
            }
        },
        syncUsersStage(){
            if(this.checkImplantation){
                if(document.getElementById("divUsersStage1").value == "") return;

                var arrayElements = JSON.parse(document.getElementById("divUsersStage1").value);

               // if(arrayElements.length == 0) return;

                var elements = arrayElements.map(function(person){ // [{"ID_USUARIO":3,"LOGIN_USUARIO":"rafael123","IMG_USUARIO":""},{"ID_USUARIO":6,"LOGIN_USUARIO":"Erick","IMG_USUARIO":""}]
                    return person;
                });

                if(!this.checkArrays(arrayElements, this.stage1.usersStage)){
                    this.stage1.usersStage = elements;
                }
            }
        },
        usersItemsRefresh(){
            if(this.checkImplantation){
                if(document.getElementById("inputItemsAux").value == "") return;

                var objElements = JSON.parse(document.getElementById("inputItemsAux").value); // {"ID_LOJA":10,"IMP_CODIMP":7,"COD_ETAPA":1,"IMP_USUARIOSITEM":"1","COD_ITEM":12}
                var itemIndex = this.stage1.items.findIndex(e => e.COD_ETAPA == objElements.COD_ETAPA && e.COD_ITEM == objElements.COD_ITEM)

                var newUsers = []; /*{ "ID_USUARIO": 4, "LOGIN_USUARIO": "Douglas", "IMG_USUARIO": "Douglas"},*/
                
                objElements.IMP_USUARIOSITEM.split(", ").forEach(y => {
                    if(y != ""){
                        var user = this.USUARIO.find(element => element.ID_USUARIO == y);
                        newUsers.push(user);
                    }
                })

                if (itemIndex !== -1) { // Se o item foi encontrado
                    Vue.set(this.stage1.items[itemIndex], 'USUARIOS', newUsers);
                }
            }
        },
        checkArrays(array1, array2) {
            return array1 === JSON.stringify(array2);
        },
        filteredUsers(itemCod) {
            return this.stage1.usersStageItem.filter(user => user.codItem == itemCod.codItem);
        },
        alterPhoto(user){
            var userDif = user.ID_USUARIO == localStorage.getItem("idUser") ? true : false;

            if(this.roleUserLogged != "M" && userDif){
                this.callSnackBar("Usuário sem permissão para alterar imagem de outros usuários.", true);
            }
            else{
                document.getElementById("fileInput").click();
                this.ID_USER_PHOTO = user.ID_USUARIO;
            }
        },
        async onFileChange(e) {
            const file = await e.target.files[0];

            if (file) {
                // Verificando se o arquivo é uma imagem
                if (file && file.type.startsWith("image/")) {
                    const reader = await new FileReader();
                    reader.onload = e  => {
                        var base64 = e.target.result;

                        axios.patch(`${this.serverIP}/userPhoto`, {
                            ID_USUARIO: this.ID_USER_PHOTO,
                            IMG_USUARIO: base64
                        }).then(res => {
                            this.setArrayUsers();
                            this.callmsgSuccess(res.data.success);
                        }).catch(err => {
                            this.msgErr = err.response.data.err;
                            this.dialogErr = true;
                        })
                    };

                    reader.readAsDataURL(file);
                } else {
                    this.callSnackBar("O arquivo selecionado não é uma imagem", true);
                }
            }
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
        /*'stage1.usersStage'(){
            if(this.pageLoaded){
                var arrayElements = document.getElementById("divUsersStage1").value

                if(!this.checkArrays(arrayElements, this.stage1.usersStage)){
                    this.alterUserStage(1);
                }
            }
        },*/
        'stage2.usersStage'(){
            if(this.pageLoaded){
                this.alterUserStage(2);
            }
        },
        'stage3.usersStage'(){
            if(this.pageLoaded){
                this.alterUserStage(3);
            }
        },
        'stage4.usersStage'(){
            if(this.pageLoaded){
                this.alterUserStage(4);
            }
        },
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
            this.pageLoaded = true;
            if(this.stage4.model.length / this.stage4.items.length * 100 == 100){
                this.stage4.color = 'success'
            } else{
                this.stage4.color = 'cyan'
            }
        },
    },
    
}
</script>