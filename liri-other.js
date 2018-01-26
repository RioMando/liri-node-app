var moment = require("moment-timezone");

//To red and set environment variables with dotenv package
require("dotenv").config();

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

//Import keys.js file with Spotify and Tweeter's keys
var keys = require("./keys.js");

// Variables to store the keys
// console.log(keys.spotify);
// console.log(keys.twitter);
// console.log(keys.spotify.id);
// console.log(keys.spotify.secret);

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

// console.log("Here: " + process.env.TWITTER_CONSUMER_KEY) 


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
var movieSongName = process.argv[3];
var valid = false;

switch (option) {
	case "my-tweets":
	valid = true;	
	myTweets();
	break;

	case "spotify-this-song":
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
	console.log("\n" + option + " Is not a valid option. Try Again!\n\nValid options are:");
	console.log("  my-tweets\n  spotify-this-song\n  movie-this\n  do-what-it-says");
}

// 
function myTweets() {
	var params = {screen_name: '', count:20, user_id: 955267080353468416};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {	
	    if (!error) {
	    	tweetResponse = tweets;
	    	counterTw = 0;
	    	
	    	timeArry = [];
	    	displayTweets();
	    	// console.log(tweets);
		}//End of if(!error)
	});// End of client.get

} //End of myTweets

function displayTweets() {
   	if (counterTw < tweetResponse.length) {
		console.log("\n\n" + tweetResponse[counterTw].text + "\n" +  tweetResponse[counterTw].created_at);
		var time = tweetResponse[counterTw].created_at;	
		console.log(tweetResponse[0]);
	 var timeArry = time.split(" ");
	 console.log("Array splice: ", timeArry);
	 timeArry.splice(3, 0, timeArry[5]);
	 timeArry.splice(5, 2);
	 timeArry.splice(0, 1);
	 console.log(timeArry);
	 var displayTime = "";
	 // for (var j=0; j<4; j++) {
		 // displayTime = displayTime + timeArry[j] + " ";
		 
	// }
	displayTime = timeArry[0] + " "+timeArry[1] + " "+timeArry[2] + " "+timeArry[3];
	console.log(displayTime);
	
	var timeCT = moment.utc(displayTime, 'MMM DD YYYY HH:mm:ss').tz('America/Chicago').format("YYYY-MM-DD HH:mm");
	console.log("Time comverted:" +timeCT);

	// var newYork    = moment.tz(displayTime, "America/New_York");
	// var losAngeles = newYork.clone().tz("America/Los_Angeles");
	// var london     = newYork.clone().tz("Europe/London");
	// newYork.format();
	// losAngeles.format();
	// london.format();

	counterTw++;
	// displayTweets();
	} //End if-loop
	
} //End of displayTweets 


function spotifyThis() {
	console.log("Here goes the code for Spotify");

//Option 1:
// spotify.search({ type: 'track', query: movieSongName, limit: 1 }, function(err, data) {
//   if (err) {
//     return console.log('Error occurred: ' + err);
//   }
// console.log(data); 
// var info = data;
// console.log(data.tracks.items[0]); 
// console.log("Name: " + data.album); 
// });

  //Option 2:
	spotify
		.search({ type: 'track', query: movieSongName, limit: 1 })
  		.then(function(response) {
  			
  			// console.log(response);
  			var infoSong = JSON.stringify(response); 
    		console.log("\nArtist: " + response.tracks.items[0].album.artists[0].name);
    	
    		// console.log("\n: " + infoSong.tracks.items);


    	

	    	fs.writeFile("infoSong.txt", infoSong, function(err) {
	    		if (err) {
	      			return console.log(err);
	    		}
      		});

      		//================================
  //     		fs.readFile("infoSong.txt", "utf8", function(err, data) {
		//     if (err) {
		//       return console.log(err);
		//     }
		// console.log("Final Info: " + data);
  //   });
      		//=========================================

    	// console.log(response);
  		})
  	.catch(function(err) {
    console.log(err);
  });
}


function movie() {
	//Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieSongName + "&y=&plot=short&apikey=trilogy";

    //This line is just to help us debug against the actual URL.
	// console.log(queryUrl);
// fs.readFile("movies.txt", "utf8", function(error, data) {
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
	console.log("Here goes theJSON.parse(body).Year code for Do Wat It Says");
};

function notAnOption() {
	console.log("Not a valid option");
}


