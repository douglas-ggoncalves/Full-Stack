<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-combobox v-model="select" :items="USUARIO" item-text="LOGIN_USUARIO" return-object label="Usuários" multiple chips>
          <template v-slot:selection="data">
            <v-chip :key="JSON.stringify(data.item)" v-bind="data.attrs" :input-value="data.selected" :disabled="data.disabled" @click:close="data.parent.selectItem(data.item)">
              <v-avatar class="accent white--text" left v-if="data.item.IMG_USUARIO != '' &&  data.item.IMG_USUARIO != null">
                <img :src='"../../assets/img/Funcionarios/" + data.item.IMG_USUARIO +  ".jpg"' :alt="data.item.LOGIN_USUARIO">
              </v-avatar>
              <v-avatar class="accent white--text" v-text="data.item.LOGIN_USUARIO.slice(0, 1).toUpperCase()" left v-else/>
              {{ data.item.LOGIN_USUARIO }}
            </v-chip>
          </template>
        </v-combobox>
      </v-col>
    </v-row>


    <v-row>
      <v-col cols="12" sm="6" offset-sm="3">
        <v-card>
          <v-btn fab color="cyan accent-2" bottom left absolute @click="dialog = !dialog">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          
          <v-dialog v-model="dialog" max-width="500px" id="testeeee">
            <v-combobox v-model="select" :items="USUARIO" item-text="LOGIN_USUARIO" return-object label="Usuários" multiple chips style="background-color: white;">
              <template v-slot:selection="data">
                <v-chip :key="JSON.stringify(data.item)" v-bind="data.attrs" :input-value="data.selected" :disabled="data.disabled" @click:close="data.parent.selectItem(data.item)">
                  <v-avatar class="accent white--text" left v-if="data.item.IMG_USUARIO != '' &&  data.item.IMG_USUARIO != null">
                    <img :src='"../../assets/img/Funcionarios/" + data.item.IMG_USUARIO +  ".jpg"' :alt="data.item.LOGIN_USUARIO">
                  </v-avatar>
                  <v-avatar class="accent white--text" v-text="data.item.LOGIN_USUARIO.slice(0, 1).toUpperCase()" left v-else/>
                  {{ data.item.LOGIN_USUARIO }}
                </v-chip>
              </template>
            </v-combobox>
          </v-dialog>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

  export default {
    data (){
      return{
        dialog: false,
        select: [{ ID_USUARIO: 1, LOGIN_USUARIO: 'Rafael', IMG_USUARIO: 'Rafael' }],
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
    methods:{
      reversedMessage(value) {
        if(/\s/g.test(value)){ // se ter espaços
          var name = value.split(' ')[0].toUpperCase();
          var name2 = value.split(' ')[1].toUpperCase();
          return name.substr(0, 1) + name2.substr(0, 1)
        } 
        else{
          return value.substr(0, 2)
        }
      }
    }
  }
</script>