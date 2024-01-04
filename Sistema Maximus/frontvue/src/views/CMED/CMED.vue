<template>
  <div>
    <input type="file" @change="onFileUpload" />
    <button @click="salvarDados()" v-if="tableData.length > 0">Salvar Dados Banco {{ tableData.length }} Dados</button>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import axios from 'axios';
import scrypt from "../../assets/js/scrypt";

export default {
  data() {
    return {
      tableData: [],
      tableHeaders: [],
      serverIP: ''
    };
  },
  methods: {
    onFileUpload(event) {
      const files = event.target.files;
      if (files && files.length) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });

          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          this.tableHeaders = jsonData.shift() || [];
          this.tableData = jsonData;
        };
        reader.readAsBinaryString(file);
      }
    },
    async salvarDados(){
      

        await axios.post(`${this.serverIP}/CMED`, {
            LISTA_CMED: this.tableData,
        }).then(res => {
            alert(res.data)
        }).catch(() => {

        })
        console.log(this.tableData)
    }
  },
  created(){
    this.serverIP = scrypt.serverIP
  }
};
</script>
