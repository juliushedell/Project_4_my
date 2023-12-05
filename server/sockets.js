function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());
  
  socket.on('pageLoaded', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function(lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('createPoll', function(d) {
    socket.emit('pollCreated', data.createPoll(d.lang, d.pollId, d.name, d.numberAllegations, d.theme, d.allegations));
  });
//----------------------------------------------------------------
  socket.on('createGame', function(gameSetup) {
    socket.emit('gameCreated', data.createGame(gameSetup.game_id, gameSetup.lang, gameSetup.name_of_host, gameSetup.no_allegations,gameSetup.the_theme));
  });
//----------------------------------------------------------------
  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, {q: d.q, a: d.a});
    socket.emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('editQuestion', function(d) {
    data.editQuestion(d.pollId, d.index, {q: d.q, a: d.a});
    socket.emit('questionEdited', data.getAllQuestions(d.pollId));
  });

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId);
    socket.emit('newQuestion', data.getQuestion(pollId))
    socket.emit('dataUpdate', data.getAnswers(pollId));
  });

  socket.on('getPoll', function(pollId) {
    socket.join(pollId);
    socket.emit('pullPoll', data.getPoll(pollId))
  });

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

  socket.on('addConfessions', function(gameCode, conf) {
    data.addConfessions(gameCode, conf);
  })
  // tar emot confessions ?
  //Behöver lägga till io.emit för att kunna skicka vidare !
  // socket.on('addConfessions', function(confessions){
    //data.addConfessions(confessions)

  //})
 
}

export { sockets };