var moment = require("moment-timezone");

//To red and set environment variables with dotenv package
require("dotenv").config();

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

//Import keys.js file with Spotify and Tweeter's keys
var keys = require("./keys.js");

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
var request = require("request");

// Store all of the arguments in an array
var nodeArgs = process.argv;
var fs = require("fs");

//Global Variables
var counterTw = 0;
var tweetResponse = [];
var displayTime = "";
var timeCT = ";"

var option = process.argv[2];
var nameMovieOrSong = process.argv[3];
var valid = false;

options(option);

function options (option) {
	switch (option) {
		case "my-tweets":
		valid = true;	
		myTweets();
		break;

		case "spotify-this-song":
		valid = true;
		if (!nameMovieOrSong) {
			nameMovieOrSong = "The Sign";
		}
		console.log("\nLooking for \'" + nameMovieOrSong + "\' song.");
		spotifyThis();
		break;

		case "movie-this":
		valid = true;
		if (!nameMovieOrSong) {
			nameMovieOrSong = "Mr. Nobody.";
		}
		movie();
		break

		case "do-what-it-says":
		valid = true;
		doWhatItSays();
		break
	}

	//In case that the given option is not in the above 4
	if (!valid){
		console.log("\n" + option + " Is not a valid option. Try Again!\n\nValid options are:");
		console.log("  my-tweets\n  spotify-this-song\n  movie-this\n  do-what-it-says");
	}
}

 
function myTweets() {
	var params = {screen_name: '', count:20, user_id: 955267080353468416};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {	
	    if (!error) {
	    	tweetResponse = tweets;
	    	counterTw = tweetResponse.length-1;

			for (counterTw; counterTw >= 0; counterTw--) {
				var time = tweetResponse[counterTw].created_at;	
				var timeDlls = moment.utc(time, 'ddd MMM DD HH:mm:ss Z <YYYY></YYYY>').tz('America/Chicago').format("lll");
				console.log("\n" + timeDlls);
				console.log(tweetResponse[counterTw].text);
			}//End of if(!error)
		}
	});// End of client.get
} //End of myTweets

function spotifyThis() {

	spotify.search({ type: 'track', query: nameMovieOrSong, limit: 1 })
  	.then(function(response) {
  			
		// console.log(response);
		var infoSong = JSON.stringify(response); 
   		fs.writeFile("infoSong.txt", infoSong, function(err) {
    		if (err) {
      			return console.log(err);
    		}

    	//Variables to be used for the option that more that 1 artist perform a track
    	var artists = "";
    	var long = response.tracks.items[0].album.artists.length;

    	//Variables to store the values to be displayed
    	var song = response.tracks.items[0].name;

        // This is in case that more than 1 singer performs the track. (i.e. Track: Despacito Artist: Luis Fonsi, Daddy Yankee )
    	for (var i = 0; i<long ; i++) {
    		artists = artists + response.tracks.items[0].album.artists[i].name + ". ";
    	}
   		var album = response.tracks.items[0].album.name;
   		var link = response.tracks.items[0].external_urls.spotify;

   		//Display of the information on screen
		console.log("\n\nSpotify response:\n\nSong: " + song);
   		console.log("\nArtist: " + artists);
    	console.log("\nAlbum: " + album);
   		console.log("\nSpotify's link: " + link);   	

   		});
	})
  	.catch(function(err) {
    	console.log(err);
	});
}


function movie() {
	//Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + nameMovieOrSong + "&y=&plot=short&apikey=trilogy";

    //This line is just to help us debug against the actual URL.
	// console.log(queryUrl);
	request(queryUrl, function(error, response, body) {

		// If the request is successful
		if (!error && response.statusCode === 200) {
			var movieInfo = JSON.parse(body);
			
			// Parse the body of the site and recover just the imdbRating
			console.log("\n\nMovie Title: " + movieInfo.Title + 
				"\nRelease Year: " + movieInfo.Year +
				"\n" + movieInfo.Ratings[0].Source + ": " + movieInfo.Ratings[0].Value +
				"\n" + movieInfo.Ratings[1].Source + ": " + movieInfo.Ratings[1].Value +
				"\nCountry: " + movieInfo.Country +
				"\nLanguage: " + movieInfo.Language +
				"\nActors: " + movieInfo.Actors +
				"\n\nPlot: " + movieInfo.Plot
			); //End console.log
		}
	});
}

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(err, data) {
	    if (err) {
	      return console.log(err);
	    }
	    // Break down the information from random.txt usiing comma ","
	    doWhat = data.split(",");
	    option = doWhat[0];
		nameMovieOrSong = doWhat[1];
		valid = false;
		//calling function option
		options (option);
  	});
}

