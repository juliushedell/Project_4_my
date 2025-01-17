function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());
  
  socket.on('pageLoaded', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function(lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('createPoll', function(d) {
    socket.emit('pollCreated', data.createPoll(d.lang, d.gameCode, d.numberAllegations, d.theme, d.lifeLine, d.name));
  });

  socket.on('getPoll', function(gameCode) {
    socket.join(gameCode);
    io.to(gameCode).emit('pullPoll', data.getPoll(gameCode))
  });

  socket.on('submitAnswer', function(gameCode, name, answer) {
    data.submitAnswer(gameCode, name, answer);
    const player = data.lockAnswer(gameCode, name);
    socket.emit('currentPlayer', player)
    io.to(gameCode).emit('answers', answer)
  });

  socket.on('updateSneakDict', function (gameCode, playerList) {
    const sneakDict = data.updateSneakDict(gameCode, playerList);
    socket.emit('sneakDict', sneakDict)
  })

  socket.on('submitConfessions', function(d) {
    data.submitConfessions(d.gameCode, d.allegations, d.name, d.isHost);
    io.to(d.gameCode).emit('confessionsSubmitted', data.getPlayers(d.gameCode))
  });

  socket.on('randomAllegation', function(gameCode){
    data.randomAllegation(gameCode);
  });

  //ska räkna allegations när spelet startar OBS endast en gång 
  socket.on('countAllegations', function(gameCode){
    data.countAllegations(gameCode);
  });

  socket.on('checkGameCode', function (gameCode) {
    socket.emit('isGameCodeOK', data.checkGameCode(gameCode));
  });

  socket.on('checkName', function (d) {
    const checkedName = data.checkName(d.gameCode, d.name);
    socket.emit('nameChecked', checkedName);
  });

  socket.on('startPoll', function (gameCode) {
    io.to(gameCode).emit('startGame');
  });

  socket.on('jumpToNextAllegation', function (gameCode) {
    io.to(gameCode).emit('nextAllegation');
  });

  socket.on('removePlayer', function(d) {
    data.removePlayer(d.gameCode, d.name)
    io.to(d.gameCode).emit('pullPlayer', data.getPlayers(d.gameCode))
  })

  socket.on('getPlayers', function (gameCode) {
    io.to(gameCode).emit('pullPlayer', data.getPlayers(gameCode))
  })

  socket.on('getPlayerList', function(gameCode, rightAnswer) {
    const playerList = data.randomPlayers(gameCode, rightAnswer);
    socket.emit('playerList', playerList);
  })
  
  socket.on('getScoreboard', function(gameCode) {
    const theScoreboard = data.scoreBoard(gameCode);
    socket.emit('scoreBoard', theScoreboard );
  })

  socket.on('compareAnswer', function(gameCode) {
    data.compareAnswers(gameCode);
  })

  socket.on('allegationsLeft', function(gameCode) {
    const aL = data.allegationsLeft(gameCode);
    socket.emit('allegationsRemaining', aL);
  })

  socket.on('changeFiftyFifty', function(gameCode, name) {
    data.changeFiftyFifty(gameCode, name);
    
  })
  socket.on('findCurrentPlayer', function(gameCode, name) {
    let player = data.findCurrentPlayer(gameCode, name);
    socket.emit('currentPlayer', player);
  })

  socket.on('endPoll', function(gameCode) {
    io.to(gameCode).emit('endTheGame')
  })

  socket.on('usedSneakPeak', function(gameCode, name) {
    data.usedSneakPeak(gameCode, name);
  })

  socket.on('lockGame', function(gameCode) {
    data.lockGame(gameCode);
  })

}

export { sockets };