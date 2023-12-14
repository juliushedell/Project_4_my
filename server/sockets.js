function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());
  
  socket.on('pageLoaded', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function(lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('createPoll', function(d) {
    socket.emit('pollCreated', data.createPoll(d.lang, d.gameCode, d.numberAllegations, d.theme));
  });

  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, {q: d.q, a: d.a});
    socket.emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('editQuestion', function(d) {
    data.editQuestion(d.pollId, d.index, {q: d.q, a: d.a});
    socket.emit('questionEdited', data.getAllQuestions(d.pollId));
  });

  socket.on('joinPoll', function(gameCode) {
    socket.join(gameCode);
    socket.emit('pullPoll', data.getPoll(gameCode));
  });

  socket.on('getPoll', function(pollId) {
    socket.join(pollId);
    io.to(pollId).emit('pullPoll', data.getPoll(pollId))
  });

  socket.on('getPlayers', function(gameCode) {
    io.to(gameCode).emit('pullPlayer', data.getPlayers(gameCode));
  })

  socket.on('runQuestion', function(d) {
    io.to(d.pollId).emit('newQuestion', data.getQuestion(d.pollId, d.questionNumber));
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  });

  socket.on('submitConfessions', function(d) {
    data.submitConfessions(d.gameCode, d.allegations, d.name, d.isHost);
    io.to(d.gameCode).emit('confessionsSubmitted', data.getConfessions(d.gameCode))
  });

  //ska ta fram en random allegation varje gång som en fråga ska presenteras 
  socket.on('randomAllegation', function(d){
    data.randomAllegation(d.gamecode);
    let poll = data.getRandomAllegation(d.gameCode);
    io.to(d.gameCode).emit('getRandomAllegation', poll);

  });

  //ska räkna allegations när spelet startar OBS endast en gång 
  socket.on('CountAllegations', function(d){
    data.countAllegations(d.gamecode);
    
  });

  socket.on("sendCode", function (gameCode) {
    socket.emit("recieveCode", gameCode);
  });

  socket.on('checkName', function (d) {
    const checkedName = data.checkName(d.gameCode, d.name);
    socket.emit('nameChecked', checkedName);
  });
 
}

export { sockets };