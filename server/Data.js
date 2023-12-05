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
Data.prototype.createPoll = function(lang="en", pollId, name, numberAllegations, theme, allegations) {
  if (typeof this.polls[pollId] === "undefined") {
    let poll = {};
    poll.lang = lang; 
    poll.questions = [];
    poll.answers = [];
    poll.currentQuestion = 0;              
    this.polls[pollId] = poll;
    console.log("poll created", pollId, poll);

    // Tillagt
    poll.name = name;
    poll.numberAllegations = numberAllegations;
    poll.theme = theme;
    poll.allegations = allegations;
  }
  return this.polls[pollId];
}

Data.prototype.getPoll = function(pollId) {
  if (typeof this.polls[pollId] === "undefined") {
    return {}
  }
  return this.polls[pollId];
}

//----------------------------------------------------------------
 Data.prototype.createGame = function(game_id, lang="en", name_of_host, no_allegations,the_theme) {
   if (typeof this.polls[game_id] === "undefined") {
     let poll = {};
     poll.lang = lang;  
     poll.name_of_host = '';
     poll.no_allegations = 50;
     poll.the_theme = '';              
     this.polls[game_id] = poll;
     console.log("poll created", game_id, poll);
   }
   return this.polls[game_id];
 }
//----------------------------------------------------------------
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

Data.prototype.addConfessions = function (gameCode, confessions) {
    this.polls[gameCode].allegations = confessions;
    // Returna något??
};

export { Data };



