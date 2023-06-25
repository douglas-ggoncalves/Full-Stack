import { io } from 'socket.io-client';
const connection = require("../../connection/backConnection.json")

class SocketioService {
    socket;
    constructor() {}

    setupSocketConnection() {
      this.socket = io(connection.serverIP);

      this.socket.emit('my message', 'Hello there from Vue.');

      this.socket.on('itemsRefresh', (data) => {
        document.getElementById("inputText").value = data.DESC_ITEM
        document.getElementById("inputActive").value = data.ITEM_ATIVO
        document.getElementById("inputID_LOJA").value = data.ID_LOJA
        document.getElementById("dataImplant").click();
      });

      this.socket.on('usersRefresh', (data) => {
        document.getElementById("divUsersStage" + data.value).value = JSON.stringify(data.arrayElements)
        document.getElementById("syncUsersStage").click();
      });

      this.socket.on('usersItemsRefresh', (data) => {
        document.getElementById("inputItemsAux").value = JSON.stringify(data);
        document.getElementById("divItemsAux").click();
      });

      this.socket.on('showmsg', () => {
        document.getElementById("chat").append(document.createElement("p").innerHTML = 'ABC')
        document.getElementById("chat").append(document.createElement("br"))
      });

      this.socket.on('dashboardRefresh', (loginUser) => {
        if(document.getElementById("syncInfoDashboard") != null){
          document.getElementById("inputTextDashboard").value = loginUser
          document.getElementById("syncInfoDashboard").click();
        }
      });
    }

    refreshDashboard(loginUser){
      this.socket.emit('dashboardRefresh', {loginUser: loginUser});
    }

    updateItemImp(DESC_ITEM, ITEM_ATIVO, ID_LOJA){
      this.socket.emit('refreshItems', {DESC_ITEM: DESC_ITEM, ITEM_ATIVO: ITEM_ATIVO, ID_LOJA: ID_LOJA})
    }

    updateStageUsers(ID_LOJA, IMP_CODIMP, value, arrayElements){
      this.socket.emit('refreshStageUsers', {ID_LOJA: ID_LOJA, IMP_CODIMP: IMP_CODIMP, value: value, arrayElements: arrayElements})
    }

    updateItemUsers(obj){
      console.log("ID_LOJA " + obj.ID_LOJA);
      console.log("IMP_CODIMP " + obj.IMP_CODIMP);
      console.log("value " + obj.value);
      console.log("arrayElements " + obj.IMP_USUARIOSITEM);
      console.log("COD_ITEM " + obj.COD_ITEM);
      //this.socket.emit('refreshItemsUser', {ID_LOJA: ID_LOJA, IMP_CODIMP: IMP_CODIMP, value: value, arrayElements: arrayElements, COD_ITEM: COD_ITEM})
      this.socket.emit('refreshItemsUser', obj)
    }

    disconnect() {
      if (this.socket) {
        this.socket.disconnect();
      }
    }
  }
  
  export default new SocketioService();