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

Data.prototype.getUILabels = function (lang = "en") { // Hämtar UILabels
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}
Data.prototype.createPoll = function(lang="en", gameCode, numberAllegations, theme, lifeLine) { //Skapar pollen 
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
    poll.answers = [];
    poll.sneakDict = {};
  }
  return this.polls[gameCode];
}

Data.prototype.submitConfessions = function(gameCode, allegations, name, isHost) { // Skapar en spelare när allegations läggs till
  const poll = this.polls[gameCode];
  if (typeof poll !== "undefined") {
    let thePlaya = {
      name: name,
      allegations: allegations,
      points: 0,
      isHost: isHost,
      currentAnswer: "",
      fiftyfifty: true,
      visible: false,
      sneakPeak: true
    }
    poll.players.push(thePlaya)
  }
  
};

Data.prototype.randomAllegation = function(gameCode){ //Tar fram en random allegation och den som skrivit den 
  const poll = this.polls[gameCode];
  const players = poll.players;
  let randomPlayerIndex = Math.floor(Math.random()*players.length); //Tar fram ett random index från listan med spelare
  let correctAnswer = players[randomPlayerIndex]; //Tar fram spelaren på indexet i fråga
  let playerAllegations = correctAnswer.allegations; //Tar fram den spelaren lista med allegations 

  if (playerAllegations.length > 0){ //Kollar så att spelarens allegations-lista inehåller minst en allegation 
    const randomAllegationIndex = Math.floor(Math.random()*playerAllegations.length); //Tar fram ett random index från spelarens allegation-lista
    const randomAllegation = playerAllegations[randomAllegationIndex]; //Tar fram den allegation som sedan ska visas i playingGame vyn

    playerAllegations.splice(randomAllegationIndex, 1); //Här ska den aktuella allegation tas bort 
    
    poll.counter = poll.counter - 1; // Minskar counter med 1 för varje gång funktionen körs
    poll.correctAnswer = correctAnswer.name; // Sparar namnet på den spelare som allegation tillhör i pollen
    poll.randomAllegation = randomAllegation; // Sparar den allegation som ska visas i pollen
    if (poll.counter === 0) { 
      return false
    }
    return true
  }
  else if (poll.counter > 0) { //Om personen som slumpats fram inte har några allegations i sin lista så körs funktionen igen 
    return this.randomAllegation(gameCode);
  }
  else {
    return false
  }
};

Data.prototype.getRandomAllegation = function(gameCode){ //returnerar pollen till playingGame vyn (kallas i socket)
  const poll = this.polls[gameCode];
  return poll;
}

Data.prototype.countAllegations = function(gameCode){ //Räknar hur många allegations som finns totalt (kallas när spelet startas)
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

Data.prototype.findCurrentPlayer = function(gameCode, name) { //Funktion som letar upp vilken spelare som är den som gått in i data?
  const poll = this.polls[gameCode];
  const players = poll.players;
  for (let player of players) {
    if (player.name === name) {
      return player
    }
  }
}

Data.prototype.compareAnswers = function (gameCode, name){ // Jämför den aktuella spelarens svar med det rätta svaret lagrat i poll
  const poll = this.polls[gameCode];
  const players = poll.players;
  const currentPlayer = this.findCurrentPlayer(gameCode, name);
  const correctAnswer = poll.correctAnswer;
  const playerAnswer = currentPlayer.currentAnswer;
  if (playerAnswer === correctAnswer){
    currentPlayer.points += 5;
  }
}

Data.prototype.scoreBoard = function (gameCode){ //Skapar 3 arrays med de spelare som hamnar på 1:a, 2:a och 3:e plats 
  const poll = this.polls[gameCode];
  players = poll.players
  
  let pointsArray = [];
  let array1st = [];
  let array2nd = [];
  let array3rd = [];

  for (let i = 0; i < players.length; i++){ //Skapar en array innehållande alla spelares poäng 
    pointsArray.push(players[i].points)
  }
  pointsArray.sort((a, b) => b - a); // Sorterar arrayen från högst poäng till lägst 
  const uniquePoints = [...new Set(pointsArray)]; //Skapar en array med bara unika element 
  
  for (let i = 0; i < players.length; i++) { //Fyller arrayerna med de spelare som hamnar på pallplats 
    if (players[i].points === uniquePoints[0]) {
      array1st.push(players[i]);
    } 
    else if (players[i].points === uniquePoints[1]) {
      array2nd.push(players[i]);
    } 
    else if (players[i].points === uniquePoints[2]) {
      array3rd.push(players[i]);
    }
  };

  return { 
    array1st,
    array2nd, 
    array3rd
  };
};

Data.prototype.getPoll = function(gameCode) { //Hämter pollen
  if (typeof this.polls[gameCode] === "undefined") {
    return {}
  }
  return this.polls[gameCode];
}

Data.prototype.getPlayers = function(gameCode) { //Härtar arrayen med spelare 
  const poll = this.polls[gameCode];
  if (typeof poll === "undefined") {
    return {};
  
  }
  return poll.players
  
}

Data.prototype.addQuestion = function(pollId, q) { //Används inte? 
  const poll = this.polls[pollId];
  console.log("question added to", pollId, q);
  if (typeof poll !== 'undefined') {
    poll.questions.push(q);
  }
}

Data.prototype.editQuestion = function(pollId, index, newQuestion) { // Används inte? 
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    poll.questions[index] = newQuestion;
  }
}

Data.prototype.getQuestion = function(pollId, qId=null) { // Används inte?
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

Data.prototype.submitAnswer = function(gameCode, name, answer) { //Används inte?
  const poll = this.polls[gameCode];
  const players = poll.players;
  let currentPlayer = this.findCurrentPlayer(gameCode, name);
  currentPlayer.currentAnswer = answer;
}

Data.prototype.addConfessions = function (gameCode, allegations, name) { //Används inte?
  const poll = this.polls[gameCode];  
  console.log("CONFESSION ADDED ", gameCode, allegations, name);  
  if (typeof poll !== 'undefined') {
    poll.players.push(thePlaya)
  // this.polls[gameCode].allegations = confessions;
    // Returna något??
  }
};

Data.prototype.checkName = function (gameCode, checkName) { //Kollar om namnet man vill använda redan finns eller inte
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

Data.prototype.allegationsLeft = function (gameCode) { //Tar fram hur mång allegations som totalt finns kvar 
  const poll = this.polls[gameCode];
  const aL = poll.totalAllegations - poll.counter;
  return aL
}

Data.prototype.usedSneakPeak = function (gameCode, name) { //Ändrar till false för aktuella spelaren så att sneak-peak-knapp inte syns
  const poll = this.polls[gameCode];
  const player = this.findCurrentPlayer(gameCode, name);
  player.sneakPeak = false;
}

Data.prototype.changeFiftyFifty = function (gameCode, name){ //Ändrar till flase för aktuella spelaren så att 50/50-knapp inte syns
  const poll = this.polls[gameCode];
  const player = this.findCurrentPlayer(gameCode, name);
  player.fiftyfifty = false; 
}

export { Data };

