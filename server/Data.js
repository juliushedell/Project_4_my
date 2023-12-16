'use strict';
const languages = ["en", "se"];
import {readFileSync} from "fs";

// Store data in an object to keep the global namespace clean
function Data() {
  this.polls = {};
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

Data.prototype.getUILabels = function (lang = "en") {
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}
Data.prototype.createPoll = function(lang="en", gameCode, numberAllegations, theme, lifeLine) {
  if (typeof this.polls[gameCode] === "undefined") {
    let poll = {};
    poll.lang = lang;
    this.polls[gameCode] = poll;
    console.log("poll created", gameCode, poll);
    poll.numberAllegations = numberAllegations;
    poll.theme = theme;
    poll.players = [];
    //tillagt för playingGame
    poll.counter = 0; 
    poll.randomAllegation = "";
    poll.correctAnswer = "";
    poll.totalAllegations = 0;
    poll.lifeLine = lifeLine;
  }
  return this.polls[gameCode];
}

Data.prototype.submitConfessions = function(gameCode, allegations, name, isHost) {
  const poll = this.polls[gameCode];
  if (typeof poll !== "undefined") {
    let thePlaya = {
      name: name,
      allegations: allegations,
      points: 0,
      isHost: isHost,
      currentAnswer: "",
      sneakPeak: true
    }
    poll.players.push(thePlaya)
  }
  
};

Data.prototype.randomAllegation = function(gameCode){
  const poll = this.polls[gameCode];
  const players = poll.players;
  let randomPlayerIndex = Math.floor(Math.random()*players.length);
  let correctAnswer = players[randomPlayerIndex];
  let playerAllegations = correctAnswer.allegations;

  if (playerAllegations.length > 0){
    const randomAllegationIndex = Math.floor(Math.random()*playerAllegations.length);
    const randomAllegation = playerAllegations[randomAllegationIndex];

    playerAllegations.splice(randomAllegationIndex, 1); //Här ska den aktuella allegation tas bort 
    
    poll.counter = poll.counter - 1; 
    poll.correctAnswer = correctAnswer.name;
    poll.randomAllegation = randomAllegation;
    if (poll.counter === 0) {
      return false
    }
    return true
  }
  else if (poll.counter > 0) {
    return this.randomAllegation(gameCode);
  }
  else {
    return false
  }
};

Data.prototype.getRandomAllegation = function(gameCode){
  const poll = this.polls[gameCode];
  return poll;
}

Data.prototype.countAllegations = function(gameCode){
  const poll = this.polls[gameCode];
  const players = poll.players;
  poll.counter = players.length * poll.numberAllegations;
  poll.totalAllegations = players.length * poll.numberAllegations;
}

Data.prototype.getConfessions = function(gameCode) {
  const poll = this.polls[gameCode];
  if (typeof this.polls[gameCode] === "undefined") {
    console.log("HEJHEJ",players)
    return poll.players;
  }
  return []
}

Data.prototype.findCurrentPlayer = function(gameCode, name) {
  const poll = this.polls[gameCode];
  const players = poll.players;
  for (let player of players) {
    if (player.name === name) {
      return player
    }
  }
}

Data.prototype.compareAnswers = function (gameCode, name){
  const poll = this.polls[gameCode];
  const players = poll.players;
  const currentPlayer = this.findCurrentPlayer(gameCode, name);
  const correctAnswer = poll.correctAnswer;
  const playerAnswer = currentPlayer.currentAnswer;
  if (playerAnswer === correctAnswer){
    currentPlayer.points += 5;
  }
}

Data.prototype.scoreBoard = function (gameCode){
  const poll = this.polls[gameCode];
  let players = poll.players.slice(); // Create a copy of players array
  players.sort((a, b) => b.points - a.points); // Sort players by points in descending order
  const uniquePoints = [...new Set(players)];
  let array1st = [];
  let array2nd = [];
  let array3rd = [];
  
  for (let i = 0; i < players.length; i++) {
    if (players[i].points === uniquePoints[0]) {
      array1st.push(players[i]);
    } else if (players[i].points === uniquePoints[1]) {
      array2nd.push(players[i]);
    } else if (players[i].points === uniquePoints[2]) {
      array3rd.push(players[i]);
    }
  };

  return { 
    array1st,
    array2nd, 
    array3rd
  };
};

Data.prototype.getPoll = function(gameCode) {
  if (typeof this.polls[gameCode] === "undefined") {
    return {}
  }
  return this.polls[gameCode];
}

Data.prototype.getPlayers = function(gameCode) {
  const poll = this.polls[gameCode];
  if (typeof poll === "undefined") {
    return {};
  
  }
  return poll.players
  
}

Data.prototype.addQuestion = function(pollId, q) {
  const poll = this.polls[pollId];
  console.log("question added to", pollId, q);
  if (typeof poll !== 'undefined') {
    poll.questions.push(q);
  }
}

Data.prototype.editQuestion = function(pollId, index, newQuestion) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    poll.questions[index] = newQuestion;
  }
}

Data.prototype.getQuestion = function(pollId, qId=null) {
  const poll = this.polls[pollId];
  console.log("question requested for ", pollId, qId);
  if (typeof poll !== 'undefined') {
    if (qId !== null) {
      poll.currentQuestion = qId;
    }
    return poll.questions[poll.currentQuestion];
  }
  return []
}

Data.prototype.submitAnswer = function(gameCode, name, answer) {
  const poll = this.polls[gameCode];
  const players = poll.players;
  let currentPlayer = this.findCurrentPlayer(gameCode, name);
  currentPlayer.currentAnswer = answer;
}

Data.prototype.addConfessions = function (gameCode, allegations, name) {
  const poll = this.polls[gameCode];  
  console.log("CONFESSION ADDED ", gameCode, allegations, name);  
  if (typeof poll !== 'undefined') {
    poll.players.push(thePlaya)
  // this.polls[gameCode].allegations = confessions;
    // Returna något??
  }
};

Data.prototype.checkName = function (gameCode, checkName) {
  const poll = this.polls[gameCode];
  const players = poll.players;

  if (poll && players) {
    const playerExists = players.some(player => player.name === checkName);
    if (playerExists) {
      return true
    }
    else {
      return false
    }
  }
  else {
    console.log("poll eller players existerar inte")
  }
};

Data.prototype.getConfessions = function(gameCode) {
  const poll = this.polls[gameCode];
  if (typeof poll === "undefined") {
    return [];
  }
  return poll.players;
};

Data.prototype.randomPlayers = function (gameCode, rightAnswer) {
  const poll = this.polls[gameCode];
  const players = poll.players;
  const randPlayers = [];
  let i = 0;
  if (players.length > 4) {
    while (i < 3) {
      const randomIndex = Math.floor(Math.random() * players.length);
      const randomPlayer = players[randomIndex].name;
      if (randomPlayer !== rightAnswer && !randPlayers.includes(randomPlayer)) {
        randPlayers.push(randomPlayer);
        i += 1;
      }
    }
    randPlayers.push(rightAnswer);
  }
  else {
    for (let playa of players) {
      randPlayers.push(playa.name)
    }
  }
  randPlayers.slice().sort(() => Math.random() - 0.5);
  return randPlayers;
};

Data.prototype.allegationsLeft = function (gameCode) {
  const poll = this.polls[gameCode];
  const aL = poll.totalAllegations - poll.counter;
  return aL
}

export { Data };



