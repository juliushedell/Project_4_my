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
  const length = poll.numberAllegations;
  if (typeof poll !== "undefined") {
    let thePlaya = {
      name: name,
      allegations: allegations,
      points: 0,
      isHost: isHost,
      currentAnswer: "",
      fiftyfifty: true,
      scoreArray: new Array(length).fill(0),
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

Data.prototype.findCurrentPlayer = function(gameCode, name) { //Funktion som letar upp vilken spelare som är den som gått in i data?
  const poll = this.polls[gameCode];
  const players = poll.players;
  for (let player of players) {
    if (player.name === name) {
      return player
    }
  }
}

Data.prototype.compareAnswers = function (gameCode) { // Jämför den aktuella spelarens svar med det rätta svaret lagrat i poll
  const poll = this.polls[gameCode];
  const players = poll.players;
  const currentAllegation = poll.numberAllegations * players.length - poll.counter - 1;
  for (let player of players) {
    if (poll.correctAnswer === player.currentAnswer) {
      player.scoreArray[currentAllegation] = 5;
    }
    player.currentAnswer = "";
  }

  this.summerizePoints(gameCode, poll, players);
}

Data.prototype.summerizePoints = function(gameCode, poll, players) {
  for (let player of players) {
    player.points = player.scoreArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }
}

Data.prototype.scoreBoard = function (gameCode){ //Skapar 3 arrays med de spelare som hamnar på 1:a, 2:a och 3:e plats 
  const poll = this.polls[gameCode];
  const players = poll.players
  
  let pointsArray = [];
  let array1st = [];
  let array2nd = [];
  let array3rd = [];
  let arrayPlacement = [array1st, array2nd, array3rd];

  for (let i = 0; i < players.length; i++){ //Skapar en array innehållande alla spelares poäng 
    pointsArray.push(players[i].points)
  }
  pointsArray.sort((a, b) => b - a); // Sorterar arrayen från högst poäng till lägst 
  const uniquePoints = [...new Set(pointsArray)]; //Skapar en array med bara unika element 
  console.log(pointsArray.sort((a, b) => b - a))
  console.log(uniquePoints)
  for (let i = 0; i < players.length; i++) { //Fyller arrayerna med de spelare som hamnar på pallplats 
    if (players[i].points === uniquePoints[0]) {
      arrayPlacement[0].push(players[i]);
    } 
    else if (players[i].points === uniquePoints[1]) {
      arrayPlacement[1].push(players[i]);
    } 
    else if (players[i].points === uniquePoints[2]) {
      arrayPlacement[2].push(players[i]);
    }
  };
  return arrayPlacement
};

Data.prototype.getPoll = function(gameCode) { //Hämter pollen
  if (typeof this.polls[gameCode] === "undefined") {
    return {}
  }
  return this.polls[gameCode];
}

Data.prototype.getPlayers = function(gameCode) { //Hämtar arrayen med spelare 
  const poll = this.polls[gameCode];
  if (typeof poll === "undefined") {
    return {};
  }
  return poll.players
  
}

Data.prototype.submitAnswer = function(gameCode, name, answer) { //Används inte? Jo det gör den!
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
  let randPlayers = [];
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
  } else {
    for (let playa of players) {
      randPlayers.push(playa.name);
    }
  }
  randPlayers = randPlayers.slice().sort(() => Math.random() - 0.5);
  return randPlayers;
};

Data.prototype.updateSneakDict = function (gameCode, playerList) {
  const poll = this.polls[gameCode];
  const players = poll.players;
  let sneakDict = this.createSneakDict(gameCode, playerList);
  for (let i = 0; i < playerList.length; i++) {
    let counter = 0;
    let name = playerList[i];
    for (let player of players) {
      if (player.currentAnswer === name) {
        counter += 1;
      }
    }
    sneakDict[name] = counter;
  }
  return sneakDict
}

Data.prototype.createSneakDict = function (gameCode, playerList) {
  const poll = this.polls[gameCode];
  let sneakDict = {};
  for (let i = 0; i < playerList.length; i++) {
    const name = playerList[i];
    sneakDict[name] = 0;
  }
  return sneakDict
}

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

