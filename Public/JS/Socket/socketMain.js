//socketMain.js é o ficheiro principal .js. É chamado no ficheiro socket.ejs
console.log("conected");
//Importamos as funções de "socketHandler.js"
import { submitUserInputToServer, receiveFromServer } from "./socketHandler.js";
//Importamos a váriavel form de "ui.js"
import { form } from "./ui.js";

//submitUserInputToServer() é executado cada vez submetemos algo peli "form".
form[0].addEventListener("submit", function (event) {
  event.preventDefault(); //evitar que a página faça refresh cada vez que submetemos algo

  //Envoamos dados para o servidor
  submitUserInputToServer();
});
//Recebe dados do servidor
receiveFromServer();
