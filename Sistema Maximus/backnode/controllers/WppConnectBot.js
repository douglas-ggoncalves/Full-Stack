function start(client) {
  client.onMessage((message) => {
    if (message.body === 'Hello') {
      client
      .sendText(message.from, 'Olá, como posso te ajudar?')
      .then((result) => {
        console.log('Result: ', result); //return object success
      })
      .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
      });
    }
  });
}

function enviarMSG(client) {
  client.sendText('5562995492682@c.us', '👋 Hello from wppconnect!')
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });
}

class WppConnectBot{
  wppConnect(){
    const wppconnect = require('@wppconnect-team/wppconnect');

    wppconnect
    .create({
      session: 'sessionName',
      puppeteerOptions: {
        userDataDir: './tokens/sessionWhatsapp', // or your custom directory
      },
      statusFind: (statusSession, session) => {
        console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
        //Create session wss return "serverClose" case server for close
        console.log('Session name: ', session);
      },
      catchQR: (base64Qr, asciiQR) => {
        console.log(asciiQR); // Optional to log the QR in the terminal
        var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};

        if (matches.length !== 3) {
          return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer.from(matches[2], 'base64');

        var imageBuffer = response;
        require('fs').writeFile(
          'out.png',
          imageBuffer['data'],
          'binary',
          function (err) {
            if (err != null) {
              console.log(err);
            }
          }
        );
      },

      logQR: false,
    })
    .then((client) => {
      console.log("clienteeeeeeeeee " + client)
      start(client);
      enviarMSG(client);
    })
    .catch((error) => console.log(error));
  }
}
  


module.exports = new WppConnectBot();
