var CatFactWords = require("./catfactswordswords.js");
var moment = require("moment");
var catFactWait = 15; //mins between catfact
var lastCatfact = moment([2016, 1, 1]);

module.exports = function(payload, callback){
    callback(getRandomFact())
}

function IsLastCatFactTooRecent(){
  var a = moment();
  var b = moment(lastCatfact);
  var minsBetweenCatfacts = a.diff(b, 'minutes');
  if (minsBetweenCatfacts < catFactWait) return true;
  return false;
}

function getRandomFact() {
  if (IsLastCatFactTooRecent()) {
    return ({messageToSend:"Please wait before getting another CatFact", dm:true});
  }
  lastCatfact = moment();
  return CatFactWords[Math.floor(Math.random() * CatFactWords.length)];
}

console.log("You are using catfacts. Don't forget ", getRandomFact() );
lastCatfact = moment([2016, 1, 1]); //reset catfacts last time