const express = require("express");
const app = express();
const mongoose = require("mongoose");

//setup
const http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");
const io= new Server (server);
const Port = 3000;
//referencias a todas as rotas
let userRoute = require("./Routes/userRoute");


app.set("view engine", "ejs");//Estamos a dizer a noode.js que vamos user template engine .ejs
app.use(express.static(__dirname + "/public"));// é uma função middleware no framework Express.js para Node.js que serve arquivos estáticos, como imagens, arquivos CSS e JavaScript.
app.use(express.urlencoded({extended:true}));
app.use(express.json());
//Passport variables
const passport = require("passport");
const localStrategy = require("passport-local");
const session = require("express-session");
const user = require("./Model/userModel");
const perguntasDesporto = require("./Model/perguntasDesporto");
const perguntasPaises = require("./Model/perguntasPaises");
const perguntasAnimais = require("./Model/perguntasanimais");


//Express-session middleware
app.use(
  session({
    secret: "your-secret-key", //é usado para encriptar dados da sessão
    resave: false,
    saveUninitialized: false,
  })
);
//PASSPORT CONFIG//////
app.use(passport.initialize()); //inicializa passport
app.use(passport.session()); ////é usado para restaurar uma sessão de utilizador. Isso permitirá que o website mantenha a autenticação do utilizador em todas as solicitações usando dados de sessão
passport.use(new localStrategy(user.authenticate())); //Authenticate é adicionado automaticamente pelo plugin
passport.serializeUser(user.serializeUser()); //guarda um utilizador na sessão
passport.deserializeUser(user.deserializeUser()); //retira um utilizador na sessão

  mongoose
  .connect(
    //SUBSTITUIR COM A VOSSA CONEÇÂO CRIADA NA AULA
    "mongodb+srv://DBuser:AT4W8h2uBIlJxunA@clusterdbw.f9pinbz.mongodb.net/?",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("Connected to mongooooooose"))
  .catch((err) => console.log(err));
//Middleware que é executado sempre que fazemos, por exemplo, um get/post request.
  app.use(userRoute);
//Ligação ao servidor

server.listen(Port, function (err) {
  if (err) console.log("Ups, something went wrong: " + err);
  else console.log("Listening at POasRT " + Port);
});













//**************************codigo serverSide  do jogo******************************************************** */

var p1Desporto= [];
var p2Desporto= [];
var p3Desporto= [];

var pAnimais1= [];
var pAnimais2= [];
var pAnimais3= [];

var pPaises1= [];
var pPaises2= [];
var pPaises3= [];

var playerName;

app.get('/Game', async (req, res) => {

    const pp1Desporto = await perguntasDesporto.findById("6464ba2ec9ccaa360ff71088").exec();
    const pp2Desporto = await perguntasDesporto.findById("64666ea60b1fa3e77313d203").exec();
    const pp3Desporto = await perguntasDesporto.findById("64666eab0b1fa3e77313d204").exec();
    const perguntasPaises1 = await perguntasPaises.findById("6466743f185a7f8e03ff1bff").exec();
    const perguntasPaises2 = await perguntasPaises.findById("64667471185a7f8e03ff1c00").exec();
    const perguntasPaises3 = await perguntasPaises.findById("646674e1185a7f8e03ff1c01").exec();
    const perguntasAnimais1 = await perguntasAnimais.findById("646675a2185a7f8e03ff1c02").exec();
    const perguntasAnimais2 = await perguntasAnimais.findById("64667659185a7f8e03ff1c03").exec();
    const perguntasAnimais3 = await perguntasAnimais.findById("6466769c185a7f8e03ff1c04").exec();

    assignPerguntaValues(p1Desporto, pp1Desporto);
    assignPerguntaValues(p2Desporto, pp2Desporto);
    assignPerguntaValues(p3Desporto, pp3Desporto);
    assignPerguntaValues(pPaises1, perguntasPaises1);
    assignPerguntaValues(pPaises2, perguntasPaises2);
    assignPerguntaValues(pPaises3, perguntasPaises3);
    assignPerguntaValues(pAnimais1, perguntasAnimais1);
    assignPerguntaValues(pAnimais2, perguntasAnimais2);
    assignPerguntaValues(pAnimais3, perguntasAnimais3);

    playerName = req.query.username;

    res.render('game', { playerName });
});

const assignPerguntaValues = (array, pergunta) => { //passar dos dados das pergutnas da DB
  array[0] = pergunta.respostaFalsa6;
  array[1] = pergunta.respostaFalsa5;
  array[2] = pergunta.respostaFalsa1;
  array[3] = pergunta.respostaFalsa2;
  array[4] = pergunta.respostaFalsa3;
  array[5] = pergunta.respostaFalsa4;
  array[6] = pergunta.respostaCerta;
  array[7] = pergunta.pergunta;
};

let players = [];
let questions = [];
let currentQuestion = 0;
let scores = {};
let playerAnswers = {}; 
let answeredPlayers = new Set();
var questArr=[];
let pIDN= []; 

randtheme(); // atribui um tema random quando o codigo é percorrido pela primeira vez

function randtheme() { //escolhe um tema aleatorio
  questions.length = 0;
  const themes = ["desporto", "animais", "paises"];
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  questArr[0]="";
  questArr[1]="";
  questArr[2]="";
  if(randomTheme=="desporto"){
    questRand(p1Desporto,p2Desporto,p3Desporto);
    createQuestion(questArr[0]);
    createQuestion(questArr[1]);
    createQuestion(questArr[2]);

    
  }
  else if(randomTheme=="animais"){
    questRand(pAnimais1,pAnimais2,pAnimais3);
    createQuestion(questArr[0]);
    createQuestion(questArr[1]);
    createQuestion(questArr[2]);
  }
  else{
    questRand(pPaises1,pPaises2,pPaises3);
    createQuestion(questArr[0]);
    createQuestion(questArr[1]);
    createQuestion(questArr[2]);
  }
}
function questRand(p1,p2,p3) { //  a ordem das perguntas aleatorias
  let rn1 = Math.floor(Math.random() * 3);
  let rn2 = Math.floor(Math.random() * 3);
  let rn3 = Math.floor(Math.random() * 3);
  do {
    rn2 = Math.floor(Math.random() * 3);
  } while (rn2 === rn1);
  do {
    rn3 = Math.floor(Math.random() * 3);
  } while (rn3 === rn1 || rn3 === rn2);
  questArr[rn1]=p1;
  questArr[rn2]=p2;
  questArr[rn3]=p3;
}


function createQuestion(perg) { //opçoes da pergunta randoms e posiçao da resposta random 
  const lugarCada = [];

  let rn1 = Math.floor(Math.random() * 6);
  let rn2 = Math.floor(Math.random() * 6);
  let rn3 = Math.floor(Math.random() * 6);
  let rn4 = Math.floor(Math.random() * 6);
  do {
    rn2 = Math.floor(Math.random() * 6);
  } while (rn2 === rn1);
  do {
    rn3 = Math.floor(Math.random() *6);
  } while (rn3 === rn1 || rn3 === rn2);
  do {
    rn4 = Math.floor(Math.random() * 6);
  } while (rn4 === rn1 || rn4 === rn2 || rn4 === rn3);

  lugarCada[0] = perg[rn1];
  lugarCada[1] = perg[rn2];
  lugarCada[2] = perg[rn3];
  lugarCada[3] = perg[rn4];
  var rncerta = Math.floor(Math.random() * 4);
  lugarCada[rncerta] = perg[6];

  questions.push({
    question: perg[7],
    options: [lugarCada[0], lugarCada[1], lugarCada[2], lugarCada[3]],
    answer: rncerta
  });
}

io.on('connection', (socket) => {//qunado um user entra na pagina
  console.log('A user connected');
  if(testa()){

  if (players.length >= 2) {
    socket.emit('gameFull');
    return;
  }

  pIDN.push({ id: socket.id, name: atribuiNome() });
  players.push(socket.id);
  

  if (players.length === 2) {
    io.emit('startGame');
    randtheme();
    sendQuestion();
  } else {
    socket.emit('waitingForPlayers');
  }

  socket.on('answer', (data) => {//recebe dados das respostas jogadores
    const { playerId, answerText, timeTaken } = data;

    // ve se o player id +e oque esta no array dos players
    if (currentQuestion < questions.length && players.includes(playerId) && !answeredPlayers.has(playerId)) { 
      scores[playerId] = scores[playerId] || 0;

      answeredPlayers.add(playerId);
      //verifica se os player responderam
      if (
        questions[currentQuestion].options.includes(answerText) &&
        questions[currentQuestion].options.indexOf(answerText) === questions[currentQuestion].answer &&
        (!scores[playerId])
      ) {
        playerAnswers[playerId] = playerAnswers[playerId] || {};
        playerAnswers[playerId][currentQuestion] = answerText;
      } else {
        playerAnswers[playerId] = playerAnswers[playerId] || {};
        playerAnswers[playerId][currentQuestion] = answerText;
      }

      //se for verade quer dizer que todos os players ja responderam
      if (answeredPlayers.size === players.length) {
        answeredPlayers.clear();
        
        if (currentQuestion + 1 < questions.length) {
          currentQuestion++;
          sendQuestion();
        } else {
          endGame();
        }
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    //checa se o atuak player nao é igual ao socked.id
    players = players.filter((player) => player !== socket.id);
    delete scores[socket.id];
    delete playerAnswers[socket.id];
    answeredPlayers.delete(socket.id);
    io.emit('refresh');

    if (currentQuestion > 0) {
      pIDN=[];
      players = [];
      currentQuestion = 0;
      scores = {};
      playerAnswers = {};
    }
  });
}else{
  socket.disconnect();
  console.log("user disconect");
}
});

 function atribuiNome() { //passa o nome do username para o array com os ids e os nomes

  return playerName;
}

function sendQuestion() {// manda aproxima pergunta
  if (currentQuestion < questions.length) {
    io.emit('newQuestion', { question: questions[currentQuestion] });
  }
}

function endGame() {//depois deresponder a todas as pergutnas
  const playerScores = calculateScores();
  const sortedScores = Object.entries(playerScores).sort((a, b) => b[1] - a[1]); //define uma funçao de comparaçao que define a ordem
  var winnerName;
  let winnerMessage = "Game Over! It's a draw";
  if (sortedScores.length > 0) {
    const highestScore = sortedScores[0][1];//extrai o maior score
    const winners = sortedScores.filter((entry) => entry[1] === highestScore);//filtra o score maior
    if (winners.length === 1) {
      for (let i = 0; i < pIDN.length; i++) {
        const pla = pIDN[i];
        const pl = pla.id;
        if(pl == winners[0][0]){
          winnerName =pla.name;
        }
      }
      nomedb(winnerName);
      winnerMessage = `Game Over! The player ${winnerName} won!`;
    }
  }

  io.emit('gameEnd', {
    pIDN: pIDN,
    scores: playerScores,
    rightAnswers: getRightAnswers(),
    wrongAnswers: getWrongAnswers(),
    questionTexts: questions.map(question => question.question), //usando o map() é extraido o texto das questoes
    playerAnswers,
    winnerMessage
  });

  players = [];
  currentQuestion = 0;
  scores = {};
  playerAnswers = {};
}


function calculateScores() {//calcual os scores
  const playerScores = {};

  Object.keys(playerAnswers).forEach((playerId) => {
    playerScores[playerId] = 0;

    Object.keys(playerAnswers[playerId]).forEach((question) => {
      if (
        playerAnswers[playerId][question] === questions[question].options[questions[question].answer]
      ) {
        playerScores[playerId] ++;
      }
    });
  });

  return playerScores;
}

function getRightAnswers() {//escolhe as respostas certas
  const rightAnswers = {};
  Object.keys(playerAnswers).forEach((playerId) => {
    rightAnswers[playerId] = Object.keys(playerAnswers[playerId]).filter((question) => {
      const questionText = questions[question].question;
      return (
        questions[question].options.includes(playerAnswers[playerId][question]) &&
        questions[question].options.indexOf(playerAnswers[playerId][question]) === questions[question].answer
      );
    });
  });
  return rightAnswers;
}

function getWrongAnswers() {//escolhe as respostas erradas
  const wrongAnswers = {};
  Object.keys(playerAnswers).forEach((playerId) => {
    wrongAnswers[playerId] = Object.keys(playerAnswers[playerId]).filter((question) => {
      const questionText = questions[question].question;
      return (
        !(
          questions[question].options.includes(playerAnswers[playerId][question]) &&
          questions[question].options.indexOf(playerAnswers[playerId][question]) === questions[question].answer
        )
      );
    });
  });
  return wrongAnswers;
}
function testa() { //verifica se esta logado
  console.log("Nome" +playerName)
if (playerName != undefined) {

  return true;
}else{
  return false;
}
};

//---------------------
async function nomedb(nomevencedor){
  var idprofile;
    const users = await user.find({});
    users.forEach(usere => {
      if (usere.username === nomevencedor) {
        idprofile=usere._id;
        // Username matches, perform your desired actions here
      }
    });
  const userd= await user.findById(idprofile).exec();
  if(userd.nvenceu >0){
    userd.nvenceu++;
  }else{
    userd.nvenceu=1;
  }
  await userd.save();
}