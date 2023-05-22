//Aqui está o nosso socket que recebe uma mensgem do cliente e emitte para todos os clientes. Expotamos o socket io usando uma função anonima que é depois chamada em index.js
module.exports = serverSocket = (io) =>
  //Em seguida, escutamos o evento de conexão ("connection") em busca de sockets de entrada.
  io.on("connection", function (socket) {
    //Aqui recebemos a mensagem no canal "chat" que é enviado pelo cliente. O socket.emit("chat",...) está definido no ficheiro socketHandler.js
    socket.on("chat", function (msg) {
      console.log(msg);
      //Criamos um objeto que guarda a mensagem ("msg") proveniente do cliente e o socket.id. O socket.id gera de forma aleatória um "id" para cada cliente que se conecta aqui.
      let paraCliente = {
        mensagem: msg,
        socketID: socket.id,
      };
      //Aqui emitimos o objeto "paraCliente" para todos os clientes que estão conectados aqui. Para emitir pata todos os clientes existentes, usamos o io.sockets.emit("clientChat",...).

      //NOTA: Existem outas funções para emit eventos. Vejam esta cheatSheet => https://socket.io/docs/v3/emit-cheatsheet/
      io.sockets.emit("clientChat", paraCliente);
    });
  });
