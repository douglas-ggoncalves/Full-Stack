<template>
  <v-container>
    <v-row>
      <v-dialog v-model="dialog" max-width="600">
        <v-card>
          <v-toolbar class="text-center" color="dark" dark>Maximus Farma</v-toolbar>
            <v-card-text class="text-center">
              <div class="text-h5 pa-12">{{ msgSuccess }}</div>
              <v-btn class="success" @click="dialog = false">CONFIRMAR</v-btn>
            </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogErr" max-width="600">
        <v-card>
          <v-toolbar class="text-center" color="primary" dark>Maximus Farma</v-toolbar>
            <v-card-text class="text-center">
              <div class="text-h5 pa-12">{{ msgErr }}</div> 
              <v-btn class="primary" @click="dialogErr = false">CONFIRMAR</v-btn>
            </v-card-text>
        </v-card>
      </v-dialog>

      <v-col :cols="10">
        <h5>Etapa</h5>
      </v-col>

      <v-col :cols="5">
        <v-text-field label="Descrição da Etapa" v-model="newEtapa.DESC_ETAPA" hide-details="auto"></v-text-field>
        
        <v-btn color="success" class="mt-3" @click="registerStage()">
          Cadastrar Etapa
        </v-btn>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col :cols="10">
        <h5>Item</h5>
      </v-col>

      <v-col :cols="5">
        <v-text-field label="Descrição" v-model="newItens_Implantacao.DESC_ITEM" hide-details="auto"></v-text-field>
        <v-btn color="success" class="mt-3" @click="registerItem()">
          Cadastrar Item
        </v-btn>
      </v-col>

      <v-col :cols="5">
        <v-select v-model="newItens_Implantacao.ITEM_DESCETAPA" :items="newItens_Implantacao.ITEM_ETAPAOPTIONS" label="Etapa" required></v-select>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col :cols="10">
        <h5>Implantação</h5>
      </v-col>

      <v-col :cols="5">
        <v-select v-model="stores.STORES_SELECTED" :items="stores.DESC_STORES" label="Selecionar a loja" multiple chips hint="Selecione a loja que deseja associar o processo de implantação"></v-select>
        <v-btn class="mt-2" color="success" @click="associationImp()">
          Associar implantação
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import scrypt from "../../assets/js/scrypt";

  export default {
    data (){
      return{
        aux: [],
        stores: {
          DESC_STORES: [],
          ALL_STORES: [],
          STORES_SELECTED: []
        },
        dialog: false,
        dialogErr: false,
        msgErr: '',
        msgSuccess: '',
        serverIP: '',
        etapaItens: {
          data: [ 
            // {COD_ETAPA: 1, DESC_ETAPA: 'Etapa 1'}
          ]          
        },
        newEtapa:{
          DESC_ETAPA: '',
        },
        newItens_Implantacao:{
          DESC_ITEM: '',
          ITEM_DESCETAPA: '',
          ITEM_ETAPAOPTIONS: [
            //'Opção 1', 'Opção 2'
          ]
        },
      } 
    },

    methods: {
      registerStage(){
        axios.post(`${this.serverIP}/stage`, {
          DESC_ETAPA: this.newEtapa.DESC_ETAPA
        }).then(() => {
          this.msgSuccess = "Cadastro efetuado com sucesso"
          this.dialog = true;
          this.newEtapa.DESC_ETAPA = '';
        }).catch(err => {
          this.msgErr = err.response.data.err
          this.dialogErr = true
        })
      },
      registerItem(){
        if(this.newItens_Implantacao.DESC_ITEM.length == 0){
          this.msgErr = "Informe uma descrição para o item"
          this.dialogErr = true
        } else if(this.newItens_Implantacao.ITEM_DESCETAPA.length == 0){
          this.msgErr = "Informe uma etapa para cadastrar o item"
          this.dialogErr = true
        } else{
          var codSelected = this.etapaItens.data.find(o => o.DESC_ETAPA == this.newItens_Implantacao.ITEM_DESCETAPA)
          axios.post(`${this.serverIP}/items`, {
            ITEM_CODETAPA: codSelected.COD_ETAPA,
            DESC_ITEM: this.newItens_Implantacao.DESC_ITEM
          }).then(() => {
            this.msgSuccess = "Cadastro efetuado com sucesso"
            this.dialog = true;
          }).catch(err => {
            this.msgErr = err.response.data.err
            this.dialogErr = true
          })
        }
      },
      
      getStages(){
        axios.get(`${this.serverIP}/stages`, {
        }).then(res => {
          this.etapaItens.data = res.data;
          if(this.etapaItens.data.length > 0) {
            this.etapaItens.data.forEach(element => {
              this.newItens_Implantacao.ITEM_ETAPAOPTIONS.push(element.DESC_ETAPA)
            });
          }
        }).catch(err => {
          console.log(err)
        })    
      },
      
      getStores(){
        axios.get(`${this.serverIP}/stores`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }).then(res => {
          this.stores.ALL_STORES = res.data.stores;
          if(this.stores.ALL_STORES.length > 0) {
            this.stores.ALL_STORES.forEach(element => {
              this.stores.DESC_STORES.push(element.NUMERO_LOJA == "0" ? element.NOME_REDE + " " + "Integração" : element.NOME_REDE + ' ' + element.NUMERO_LOJA)
            });
          }
        }).catch(err => {
          console.log(err)
        })    
      },
      associationImp(){
        if(this.stores.STORES_SELECTED.length == 0){
          this.msgErr = "Informe ao menos uma loja"
          this.dialogErr = true
        } else{
          this.stores.STORES_SELECTED.forEach(element => {
            if(element.match(/Integração/)){
              this.aux.push(this.stores.ALL_STORES.find(o => o.NOME_REDE + " " + "Integração" == element).ID_LOJA)
            } else{
              this.aux.push(this.stores.ALL_STORES.find(o => o.NOME_REDE + " " + o.NUMERO_LOJA == element).ID_LOJA)
            }
          })
          
          axios.post(`${this.serverIP}/implantation`, {
            IMP_IDSTORES: this.aux
          }).then(res => {
              console.log("resposta: " + res)
            if(res.data.itensSuccess.length > 0 && res.data.itensErr.length == 0){
              this.msgSuccess = "Todos os cadastros foram efetuados com sucesso"
              this.dialog = true;
            } 
          }).catch(err => {
            this.msgErr = err.response.data.err
            this.dialogErr = true
          })
          
        }
      }
    },
    
    async created(){
      this.serverIP = await scrypt.serverIP
      this.getStages();
      this.getStores();
    },
  }
</script>
