var express = require('express');
var router = express.Router();
var oauth = require('oauth');
//need a library to store sessions as cookies
var cookieParser = require('cookie-parser');
var session = require('express-session');
var keys = require('./clients/keys.js');
var inspect = require('util-inspect');
var TwitterClient = require('./clients/twitter.js');
//using cookieParser
router.use(cookieParser());

router.use(session({secret: 'Shh, its a secret!'}));

//Get our access keys
var _twitterConsumerKey = keys.twitterKeys.consumer_key;
var _twitterConsumerSecret = keys.twitterKeys.consumer_secret;

var consumer = new oauth.OAuth(
    "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",
    _twitterConsumerKey, _twitterConsumerSecret, "1.0A", "http://localhost:3000/callback", "HMAC-SHA1");



router.get('/connect', function(req, res){
    consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
        if (error) {
            console.log(error);
            res.send("Error getting OAuth request token : " + inspect(error), 500);
        } else {
            //session becomes variable on request object
            //every time the browser makes a server request it's attaching a cookie to it
            req.session.oauthRequestToken = oauthToken;
            req.session.oauthRequestTokenSecret = oauthTokenSecret;
            console.log("Double check on 2nd step");
            console.log("------------------------");
            console.log("<<" + req.session.oauthRequestToken);
            console.log("<<" + req.session.oauthRequestTokenSecret);
            res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);
        }
    });
});

router.get('/callback', function(req, res){
    console.log("------------------------");
    console.log(">>"+req.session.oauthRequestToken);
    console.log(">>"+req.session.oauthRequestTokenSecret);
    console.log(">>"+req.query.oauth_verifier);
    consumer.getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
        if (error) {
            res.send("Error getting OAuth access token : " + inspect(error) + "[" + oauthAccessToken + "]" + "[" + oauthAccessTokenSecret + "]" + "[" + inspect(result) + "]", 500);
        } else {
            req.session.oauthAccessToken = oauthAccessToken;
            req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;

            //res.redirect('/trends');
            res.redirect('/postmytweet');
        }
    });
});

router.get('/', function(req, res){
    if(!req.session.oauthRequestToken  || !req.session.oauthRequestTokenSecret){
        res.redirect('/connect');
    } else {
        consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json",
            req.session.oauthRequestToken, req.session.oauthRequestTokenSecret,
            function (error, data, response) {
                if (error) {
                    //console.log(error)
                    res.redirect('/connect');
                } else {
                    var parsedData = JSON.parse(data);
                    res.send('You are signed in: ' + inspect(parsedData.screen_name));
                }
            });
    }
});

router.get('/trends', function(req, res){
    var tweeter = new TwitterClient(consumer, req.session.oauthAccessToken, req.session.oauthAccessTokenSecret);
    tweeter.trends(1, function(error, data, response){
        if(error){
            console.log(require('sys').inspect(error));
        } else {
            console.log(data);
            console.log(response);
        }
    });

//     consumer.get("https://api.twitter.com/1.1/trends/place.json?id=1",
//     req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function(error, data){
//             if(error){
//                 console.log(require('sys').inspect(error));
//             } else {
//                 console.log(data);
//             }
//     });
});


router.get('/postmytweet', function(req, res){
    var tweeter = new TwitterClient(consumer, req.session.oauthAccessToken, req.session.oauthAccessTokenSecret);
    tweeter.updateStatus("Hello Everyone, Happy Friday", function(error, data){
        if(error){
            console.log(error);
        }else{
            console.log(data);
        }
    })
    // consumer.post("https://api.twitter.com/1.1/statuses/update.json",
    //     req.session.oauthAccessToken, req.session.oauthAccessTokenSecret,
    //     {"status":"Kittes scratch things"},
    //     function(error, data) {
    //         if(error)
    //             console.log(require('sys').inspect(error));
    //         else
    //             console.log(data)
    //     });
});

module.exports = router;


//---------------------------------------------//code reference//------------------------------------------------------------------------------------------------//

//https://gist.github.com/JuanJo4/e408d9349b403523aeb00f262900e768

//https://stackoverflow.com/questions/21170531/desktop-applications-only-support-the-oauth-callback-value-oob-oauth-request-t

//---------------------------------------------------------------------------------------------------------------------------------------------//
