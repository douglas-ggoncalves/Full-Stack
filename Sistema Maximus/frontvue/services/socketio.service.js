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

      this.socket.on('showmsg', () => {
        document.getElementById("chat").append(document.createElement("p").innerHTML = 'ABC')
        document.getElementById("chat").append(document.createElement("br"))
      });

    }

    updateItemImp(DESC_ITEM, ITEM_ATIVO, ID_LOJA){
      this.socket.emit('refreshItems', {DESC_ITEM: DESC_ITEM, ITEM_ATIVO: ITEM_ATIVO, ID_LOJA: ID_LOJA})
    }

    disconnect() {
      if (this.socket) {
        this.socket.disconnect();
      }
    }
  }
  
  export default new SocketioService();