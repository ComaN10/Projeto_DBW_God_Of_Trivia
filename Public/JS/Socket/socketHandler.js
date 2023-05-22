//O SocketHandler é responsavel por enviar e receber mensagens do servidor
console.log("connect");
let socket = io(); //Client side socket io. io() é um objecto global que pode ser usado no momento que implementamos o script => <script src="/socket.io/socket.io.js"></script> em socket.ejs. Não esquecer que temos de instalar o socket.io (npm i socket.io)

//Nós importamos as variaveis "mensagem" e "output" proveniente do ficheiro "ui.js". NOTA: As variaveis devem ser o mesmo nome que definidos em "ui.js"
import { mensagem, output } from "./ui.js";

//submitUserInputToServer() é responsavel por emitir a mensagem para o servidor no "canal" "chat". A mensagem é o texto inserido pelo cliente. Nós depois exportamos a função para usar em "socketMain.js"
export function submitUserInputToServer() {
  if (mensagem.value) {
    socket.emit("chat", mensagem.value);
    mensagem.value = "";
  }
}

//receiveFromServer() é responsavel por escutar a mensagem do servidor para o cliente no "canal" "clientChat". A mensagem é depois enviada para todos os clientes. Nós depois exportamos a função para usar em "socketMain.js"
export function receiveFromServer() {
  socket.on("clientChat", function (paraCliente) {
    let html = `<div class="meuEstilo"> 
  <p> ${new Date()} </p> 
  <p> <b>Mensagem: </b> ${paraCliente.mensagem} </p>
  <p> <b>SocketID: </b>${paraCliente.socketID} </p>
  </div>`;
    //Nós adicionamos código HTML depois do elemento HTML output.
    output.insertAdjacentHTML("afterend", html);
  });
}
