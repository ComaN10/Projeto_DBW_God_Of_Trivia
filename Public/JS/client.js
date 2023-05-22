document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

//display block e none é para tirar os elementos da pagina, dependendo da etapa
  socket.on('waitingForPlayers', () => {
    document.getElementById('status').innerText = 'Waiting for players...';
    document.getElementById('status1').style.display = 'block';
    document.getElementById('status2').style.display = 'none';
  });

  socket.on('gameFull', () => {
    document.getElementById('status').innerText = 'Game is already full.';
    document.getElementById('status1').style.display = 'block';
    document.getElementById('status2').style.display = 'none';
  });

  socket.on('startGame', () => {
    if( document.getElementById('result').style.display != 'block'){
      document.getElementById('status').style.display = 'none';
      document.getElementById('status1').style.display = 'none';
      document.getElementById('status2').style.display = 'none';
      document.getElementById('questionForm').style.display = 'block';
      document.getElementById('result').setAttribute("value","true");
    }
    else{
      document.getElementById('bPlayAgain').remove();
    }
  });

  socket.on('refresh', () => {
    if (document.getElementById('result').getAttribute('value') === 'true') {//só pode dar refresh se o jogo começou
      const urlParams = new URLSearchParams(window.location.search);
      const username = urlParams.get('username');
  
      var meta = document.createElement('meta');
      meta.httpEquiv = 'refresh';
      meta.content = `0;URL=/game?username=${encodeURIComponent(username)}`;
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  });

  socket.on('newQuestion', (data) => {
    document.getElementById('status').style.display = 'none';
    document.getElementById('question').style.display = 'block';
    document.getElementById('options').style.display = 'block';
    document.getElementById('question').innerText = data.question.question;
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    data.question.options.forEach((option, index) => {
      const optionButton = document.createElement('button');
      optionButton.setAttribute("class","resposta");
      optionButton.innerText = option;
      optionButton.addEventListener('click', () => submitAnswer(option));
      optionsContainer.appendChild(optionButton);
    });
  });

  

  socket.on('gameEnd', (data) => {


    if( document.getElementById('status').innerText != 'Game is already full.'){
      document.getElementById('status').style.display = 'none';
      document.getElementById('questionForm').style.display = 'none';
      document.getElementById('result').style.display = 'block';
      document.getElementById('result').setAttribute('value', 'false');
    
      const resultContainer = document.getElementById('resultContainer');
      resultContainer.innerHTML = '';
    
      const winnerMessage = data.winnerMessage;
      const winnerElement = document.createElement('div');
      winnerElement.innerHTML = `<h2 class="rTitulo">${winnerMessage}</h2>`;
      resultContainer.appendChild(winnerElement);

      Object.keys(data.scores).forEach((playerId) => {
        const score = data.scores[playerId];
        const rightAnswers = data.rightAnswers[playerId];
        const wrongAnswers = data.wrongAnswers[playerId];

        // procura o nomepalyer com o socket.id
        var playerN;
        for (let i = 0; i < data.pIDN.length; i++) {
          const pla = data.pIDN[i];
          const pl = pla.id;
          if(pl == playerId){
            playerN =pla.name;
          }
        }

        const scoreElement = document.createElement('div');
        scoreElement.innerHTML = `<br><strong class="respostaReduzida" >Player ${playerN}: Score - ${score}</strong><br>`;
        

        if (rightAnswers.length > 0) {
          rightAnswers.forEach((question, index) => {
            const questionText = data.questionTexts[question];
            const answer = data.playerAnswers[playerId][question];
            scoreElement.innerHTML += `<span class="respostaReduzida" ><i style="color: green;">Right Answer</i> in the question: "${questionText}". The answer was: "${answer}"</spans><br>`;
          });
        } else {
          scoreElement.innerHTML += `<span class="respostaReduzida" ><i style="color: green;">Right Answers:</i> None</spans><br>`;
        }
        
        if (wrongAnswers.length > 0) {
          wrongAnswers.forEach((question, index) => {
            const questionText = data.questionTexts[question];
            const answer = data.playerAnswers[playerId][question];
            scoreElement.innerHTML += `<span class="respostaReduzida" ><i style="color: red;">Wrong Answer</i> in the question: "${questionText}". The answer was: "${answer}"</spans><br>`;
          });
        } else {
          scoreElement.innerHTML += `<span class="respostaReduzida" ><i style="color: red;">Wrong Answers:</i> None</spans><br>`;
        }

        resultContainer.appendChild(scoreElement);
      });

    }
  });

  function submitAnswer(answerText) { // foi escolhida um opçao
    document.getElementById('question').style.display = 'none';
    document.getElementById('options').style.display = 'none';
    document.getElementById('status').style.display = 'block';
    document.getElementById('status').innerText = 'Waiting for other players...';
    socket.emit('answer', { playerId: socket.id, answerText });
  }
});
