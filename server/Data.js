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

// Ändrat: lagt till name, numberAllegations och theme, tagit bort pollID
Data.prototype.createPoll = function(lang="en", pollId, numberAllegations, theme) {
  if (typeof this.polls[pollId] === "undefined") {
    let poll = {};
    poll.lang = lang;
    this.polls[pollId] = poll;
    console.log("poll created", pollId, poll);
    poll.numberAllegations = numberAllegations;
    poll.theme = theme;
    poll.players = [];
    //tillagt för playingGame
    poll.counter = 0; 
    poll.randomAllegation = "";
    poll.correctAnswer = "";
  }
  return this.polls[pollId];
}

Data.prototype.submitConfessions = function(gameCode, allegations, name, isHost) {
  const poll = this.polls[gameCode];
  console.log("ALLEGATIONS ADDED TO", gameCode, allegations, name);
  if (typeof poll !== "undefined") {
    let thePlaya = {
      name: name,
      allegations: allegations,
      points: 0,
      isHost: isHost
    }
    poll.players.push(thePlaya)
  }
  
}

Data.prototype.randomAllegation = function(gameCode){
  const poll = this.polls[gameCode];
  randomPlayerIndex = Math.floor(Math.random()*poll.players.length);
  correctAnswer = poll.players[randomPlayerIndex];
  playerAllegations = randomPlayer.allegations;

  if (playerAllegations.length > 0){
    const randomAllegationIndex = Math.floor(Math.random()*playerAllegations.length);
    const randomAllegation = playerAllegations[randomAllegationIndex];

    playerAllegations.splice(randomAllegationIndex, 1); //Här ska den aktuella allegation tas bort 
    
    poll.counter = poll.counter --; 
    poll.correctAnswer = correctAnswer
    poll.randomAllegation = randomAllegation

  }
  else{
    this.randomAllegation();
  }
}

Data.prototype.getRandomAllegation = function(gameCode){
  const poll = this.polls[gameCode];
  return poll;
}

Data.prototype.countAllegations = function(gameCode){
  const poll = this.polls[gameCode];
  poll.counter = poll.players.length * poll.numberAllegations; 
}

Data.prototype.getConfessions = function(gameCode) {
  const poll = this.polls[gameCode];
  if (typeof this.polls[gameCode] === "undefined") {
    console.log("HEJHEJ",players)
    return poll.players;
  }
  return []
}

Data.prototype.getPoll = function(pollId) {
  if (typeof this.polls[pollId] === "undefined") {
    return {}
  }
  return this.polls[pollId];
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

Data.prototype.submitAnswer = function(pollId, answer) {
  const poll = this.polls[pollId];
  console.log("answer submitted for ", pollId, answer);
  if (typeof poll !== 'undefined') {
    let answers = poll.answers[poll.currentQuestion];
    if (typeof answers !== 'object') {
      answers = {};
      answers[answer] = 1;
      poll.answers.push(answers);
    }
    else if (typeof answers[answer] === 'undefined')
      answers[answer] = 1;
    else
      answers[answer] += 1
    console.log("answers looks like ", answers, typeof answers);
  }
}

Data.prototype.getAnswers = function(pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    const answers = poll.answers[poll.currentQuestion];
    if (typeof poll.questions[poll.currentQuestion] !== 'undefined') {
      return {q: poll.questions[poll.currentQuestion].q, a: answers};
    }
  }
  return {}
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

Data.prototype.recieveCode = function (gameCode) {
  console.log("game code recieved ", gameCode);

};

Data.prototype.getConfessions = function(gameCode) {
  const poll = this.polls[gameCode];
  if (typeof poll === "undefined") {
    return [];
  }
  return poll.players;
}

export { Data };



