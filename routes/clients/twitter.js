/**
 * Created by ryanhoyda on 7/9/17.
 */

//require twitter
var Twitter = require("twitter");

//require keys
var keys = require("./keys.js");
//console.log(keys);

//creating new twitter client, and passing keys.twitterKeys to constructor
var twitter = new Twitter(keys.twitterKeys);
//console.log(twitter);


//I'm a comment

var TwitterClient = {
   profileLink: '',

    //https://dev.twitter.com/rest/reference/post/statuses/update
    post: function(status) {
        twitter.post('statuses/update', {status: 'I am a tweet'}, function (error, tweet, response) {
            if (!error) {
                console.log(tweet);
            } else {
                console.log(error);
            }
        });
    },


    //https://dev.twitter.com/rest/reference/get/trends/place
    trend: function(woeid){

    },

    //https://dev.twitter.com/rest/reference/get/users/search
    findUsers : function(query){

    },

    //https://dev.twitter.com/rest/reference/post/account/update_profile
    updateProfile: function(username, profileArgs){

    }

};

TwitterClient.post();
