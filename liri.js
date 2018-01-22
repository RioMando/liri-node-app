//To red and set environment variables with dotenv package
require("dotenv").config();

//Import keys.js file with Spotify and Tweeter's keys
var keys = require("./keys.js");

var Twitter = require('twitter');

//Variables to store the keys 
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

console.log(spotify);

