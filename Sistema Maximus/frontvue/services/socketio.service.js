import { io } from 'socket.io-client';

class SocketioService {
    socket;
    constructor() {}

    
    setupSocketConnection() {
      this.socket = io("http://localhost:4000");

      this.socket.emit('my message', 'Hello there from Vue.');

      this.socket.on('showmsg', (data) => {
        console.log('teste pra ver se está chegando ' + data);
        document.getElementById("chat").append(document.createElement("p").innerHTML = 'ABC')
        document.getElementById("chat").append(document.createElement("br"))
      });
    }

    pimba(){
      this.socket.emit('replicInfo', '');
    }

    

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
  }
  
  export default new SocketioService();