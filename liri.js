require("dotenv").config();

var request = require("request");
var axios = require("axios");
var moment = require('moment');
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var optionUser = process.argv[2];
var inputUser = process.argv[3];


userInputs(optionUser, inputUser); 

function userInputs (optionUser, inputUser) {
    switch (optionUser) {
        case "concert-this":
        concertThis(inputUser);
        break;

        case "spotify-this-song":
        spotifyThis(inputUser);
        break;

        case "movie-this":
        movieThis(inputUser);
        break;

        case "do-what-it-says":
        doWhat();
        break;

        default:
        console.log("Nope! Try with some of this \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says");
    }
}


function concertThis(inputUser) {
    var queryURL = "https://rest.bandsintown.com/artists/" + inputUser + "/events?app_id=codingbootcamp"
    request (queryURL, function(error, response, body){
        if (!error && response.statusCode === 200) {
            var concerts = JSON.parse(body);
            for (var i = 0; i <concerts.length; i++) {
                var dateConcert = concerts[i].datetime;
                var dateFormat = "MM/DD/YYYY";
                var convDateConcert = moment(dateConcert);
                console.log("==--==--==--CONCERTS--==--==--==");
                console.log(i);
                console.log("Name of the Venue: " + concerts[i].venue.name);
                console.log("Location: " + concerts[i].venue.country + ", " + concerts[i].venue.city);
                console.log("Date: " + convDateConcert.format("MM/DD/YY"));
            }
        } else {
            console.log("ERROR!")
        }       
    });
}

function spotifyThis(inputUser) {
    if (inputUser === undefined) {
        inputUser = "The Sign";
    }
    spotify.search (
        {
            type: "track",
            query: inputUser
        },
        function (err, data) {
            if (err) {
                console.log("ERROR!: " + err);
                return;
            }
            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log("==--==--==--SONGS--==--==--==");
                console.log(i);
                console.log("Song name: " + songs[i].name);
                console.log("Preview song: " + songs[i].preview_url);
                console.log("Album: " + songs[i].album.name);
                console.log("Artist: " + songs[i].artists[0].name);
            }
        }
    );
};

function movieThis(inputUser) {
    var queryUrl = "http://www.omdbapi.com/?t=" + inputUser + "&y=&plot=short&apikey=trilogy";
    if (inputUser === undefined) {
        inputUser = "Mr. Nobody";
    }
    axios.get(queryUrl).then(
        function(response) {
          console.log("==--==--==--MOVIE--==--==--==");
          console.log("Title: " + response.data.Title);
          console.log("Year: " + response.data.Year);
          console.log("IMDB Rating: " + response.data.imdbRating);
          console.log("Country: " + response.data.Country);
          console.log("Language: " + response.data.Language);
          console.log("Plot: " + response.data.Plot);
          console.log("Actors: " + response.data.Actors);
        }
      );
}

function doWhat() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        userInputs(dataArr[0], dataArr[1]);
       });
}

