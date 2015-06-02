
var jwt = require('jwt-simple');
var secret = 'quanEn';
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var _ = require ('underscore');
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/MemoryGameBackendDB';


function Auth (username){
    this.username = username;
}
Auth.generateCookie = function(username){
    var foo = {
        username:username,
        random: new Date()
    };
    var token = jwt.encode(foo, secret);
    return token;
};
Auth.decodeCookie  = function(token){
    var decode = jwt.decode(token, secret);
    return token;
};
Auth.isAuthorized = function(token, callback){
    var user = Auth.decodeCookie(token);
    MongoClient.connect(url, function(err, db){
        if(err){
            throw err;
        }else{
            var collection = db.collection('users');
            collection.findOne({"username":user.username}, function(err, doc){
                //console.log(doc);

                if(err) callback(err);
                else if(!_.isEmpty(doc) && doc != undefined) {
                    //console.log(1);
                    callback(null, true);
                }
                else {
                    //console.log(2);
                 callback(null, false)

                }
            });

        }
    });
};
Auth.generateToken = function(username, password){
    var foo = {
        username:username,
        password:password
    };
    var token = jwt.encode(foo, secret);
    return token;
};
module.exports = Auth;