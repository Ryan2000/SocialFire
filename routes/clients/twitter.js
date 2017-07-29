/**
 * Created by ryanhoyda on 7/9/17.
 */



var oauth = require('oauth');

function TwitterClient(oauth, accessToken, accessTokenSecret){
    this.oauth = oauth;
    this.accessToken = accessToken;
    this.accessTokenSecret;

    this.updateStatus = function(status, callback){
        this.oauth.post(
            "https://api.twitter.com/1.1/statuses/update.json",
        this.accessToken,
        this.accessTokenSecret,
            {"status": status},
        function(error, data){
            if (callback){
                callback(error, data);
            }
        });
    }
}



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
