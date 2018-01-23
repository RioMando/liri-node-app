//To red and set environment variables with dotenv package
require("dotenv").config();

//Import keys.js file with Spotify and Tweeter's keys
var keys = require("./keys.js");

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

// Variables to store the keys
console.log(keys.spotify); 

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

console.log("Here: " + process.env.TWITTER_CONSUMER_KEY) 


// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
var request = require("request");

// Store all of the arguments in an array
var nodeArgs = process.argv;
var fs = require("fs");

var option = process.argv[2];
var movieName = process.argv[3];
var valid = false;

switch (option) {
	case "my-tweets":
	valid = true;	
	myTweets();
	break;

	case "spotify-this-thing":
	valid = true;
	spotifyThis();
	break;

	case "movie-this":
	valid = true;
	movie();
	break

	case "do-what-it-says":
	valid = true;
	doWhatItSays();
	break
}

//In case that the given option is not in the above 4
if (!valid){
	console.log("Not a valid option. Try Again!");
}

// 
function myTweets() {
	console.log("Here goes the code for Tweeter");
}

function spotifyThis() {
	console.log("Here goes the code for Spotify");
}

function movie() {
	//Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    //This line is just to help us debug against the actual URL.
	// console.log(queryUrl);
// fs.readFile("movies.txt", "utf8", function(error, data) {
	request(queryUrl, function(error, response, body) {

		// If the request is successful
		if (!error && response.statusCode === 200) {

			// Parse the body of the site and recover just the imdbRating
			// (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
			console.log("\n\nMovie Title: " + JSON.parse(body).Title + 
				"\nRelease Year: " + JSON.parse(body).Year +
				"\n" + JSON.parse(body).Ratings[0].Source + ": " + JSON.parse(body).Ratings[0].Value +
				"\n" + JSON.parse(body).Ratings[1].Source + ": " + JSON.parse(body).Ratings[1].Value +
				"\nCountry: " + JSON.parse(body).Country +
				"\nLanguage: " + JSON.parse(body).Language +
				"\nActors: " + JSON.parse(body).Actors +
				"\n\nPlot: " + JSON.parse(body).Plot
			); //End console.log
		}
	});
}

function doWhatItSays() {
	console.log("Here goes theJSON.parse(body).Year code for Do Wat It Says");
};

function notAnOption() {
	console.log("Not a valid option");
}


