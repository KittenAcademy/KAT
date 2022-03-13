import JokeWords from "./jokewords";
import moment from "moment";
let jokeWait = 1; //mins between catfact
let lastJoke = moment([2016, 1, 1]);

export default function () {
  return getRandomJoke();
}

function IsLastJokeTooRecent() {
  let a = moment();
  let b = moment(lastJoke);
  let minsBetweenJokes = a.diff(b, "minutes");
  if (minsBetweenJokes < jokeWait) return true;
  return false;
}

function getRandomJoke() {
  if (IsLastJokeTooRecent()) {
    return "Please wait before getting another Joke";
    // return ({ messageToSend: "Please wait before getting another Joke", dm: true });
  }
  lastJoke = moment();
  return JokeWords[Math.floor(Math.random() * JokeWords.length)];
}

console.log("You are using jokes. Don't forget ", getRandomJoke());
lastJoke = moment([2016, 1, 1]); //reset catfacts last time
