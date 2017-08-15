/**
 * Created by ryanhoyda on 7/9/17.
 */



var oauth = require('oauth');
//We need a callback from twitter which is mapped to a HTTP GET
//Therefore, we can't totally encapsulate setting up authentication here

var TwitterClient = function (oauth, accessToken, accessTokenSecret) {
    this.oauth = oauth;
    this.accessToken = accessToken;
    this.accessTokenSecret = accessTokenSecret;


    //post method
    this.updateStatus = function (status, callback) {
        this.oauth.post(
            "https://api.twitter.com/1.1/statuses/update.json",
            this.accessToken,
            this.accessTokenSecret,
            {"status": status},
            function (error, data) {
                if (callback) {
                    callback(error, data);
                }
            });
    };

    this.trends = function (woeid, callback) {
        this.oauth.get("https://api.twitter.com/1.1/trends/place.json?id=" + woeid,
            this.accessToken, this.accessTokenSecret, function (error, data, response) {
                if (callback) {
                    callback(error, data, response);
                }
            });
    };


    this.findUsers = function (q, callback, count, include_entities) {
        var url = "https://api.twitter.com/1.1/users/search.json?q=" + q
        if(count){
            url = url + "&count=" + count;
        }
        if(include_entities){
            url = url + '&include_entities=' + include_entities;
        }

        this.oauth.get(url,
            this.accessToken, this.accessTokenSecret, function (error, data, response) {
                if (callback) {
                    callback(error, data, response)
                }

            });
    };


    this.updateProfile = function(callback, description, name, location, url) {
        var json = "{";
        if(description){
            json = json + '"description": "' + description + '"';
        }
        //other arguments
        if(name){
            json = json + '"name": "' + name + '"';
        }
        if(location){
            json = json + '"location": "' + location + '"';
        }
        if(url){
            json = json + '"url": "' + url + '"';
        }

        json = json + "}";
        json = JSON.parse(json);

        this.oauth.post(
            "https://api.twitter.com/1.1/account/update_profile.json",
            this.accessToken,
            this.accessTokenSecret, json,
            function (error, data) {
                if(callback) {
                    callback(error, data);
                }
            });

        //convert into JSON so we can send it into the POST body

    }



};


//var TwitterClient = {
//    profileLink: '',
//
//     //https://dev.twitter.com/rest/reference/post/statuses/update
//     post: function(status) {
//         twitter.post('statuses/update', {status: 'I am a tweet'}, function (error, tweet, response) {
//             if (!error) {
//                 console.log(tweet);
//             } else {
//                 console.log(error);
//             }
//         });
//     },
//
//
//     //https://dev.twitter.com/rest/reference/get/trends/place
//     trend: function(woeid){
//
//     },
//
//     //https://dev.twitter.com/rest/reference/get/users/search
//     findUsers : function(query){
//
//     },
//
//     //https://dev.twitter.com/rest/reference/post/account/update_profile
//     updateProfile: function(username, profileArgs){
//
//     }
//
// };


module.exports = TwitterClient;