var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var _ = require ('underscore');
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/MemoryGameBackendDB';
var Auth = require ('./authentication');


var getUsernameById = function(db, id, callback) {
    var collection = db.collection('users');
    //console.log(id);
    collection.findOne({"_id":new ObjectId(id)}, function(err, doc){
        if(err) callback(err);
        else callback(null, doc);
    });
};



var insertGame = function(options, callback){
    Auth.isAuthorized(options.cookie, function(err){
        if(err){
            callback(err);
        }else{
            var collection = options.db.collection('games');
            collection.insert(new Database(), function(err, result){
                if(err){
                    throw err
                }else{
                    callback(null, result.ops);
                }
                options.db.close()
            })

        }

    });

};



var getGamesFromUser = function(db, user, callback){
    var collection = db.collection('games');
    collection.find({$or:[{loser:user.username}, {winner:user.username}]}).toArray(function(err, docs){
        if(err){
            callback(err);
        }else{
            callback(null, docs)
        }
        db.close()
    });

};
var getGame= function(options, callback){
    //console.log(options);
    var db = options.db;
    var idGame = options.user.idGame;
    var collection= db.collection('games');
    collection.findOne({"_id":new ObjectId(idGame)}, function(err, docs){

        if(err) {
            callback(err);

        }else if (!docs || _.isEmpty(docs)) {
            callback("game not found");
        }else{
            callback(null, docs);
        }


    })
};
var updateGame = function(options, callback){

    Auth.isAuthorized(options.cookie, function(err, boolean) {
        if (err) {
            callback(err);
        } else {
            getGame(options, function (err, game) {
                if (options.user.winner == "" && options.user.loser == "") {
                    callback("no camps fill")
                    return;
                }
                var query;
                if (options.user.winner) {
                    //console.log(3);
                    query = createQueryUpdate('winner', options.user.winner)
                }
                if (options.user.loser) {
                    //console.log(4);
                    query = createQueryUpdate('loser', options.user.loser);
                }
                var collection = options.db.collection('games');
                collection.update({_id: new ObjectId(game._id)}, query, function (err, result) {
                    if (err) {
                        //console.log(5);
                        callback(err);
                    } else {
                        //console.log(6);
                        callback(null, result.result);
                    }
                })

            });
        }
    });
};
var createQueryUpdate = function(key, value, gameId){
    var data = eval("({ $set: {"+key+":'"+value+"'} })");
    return data;
};






function Database(){
    this.winner = "";
    this.loser = "";
    this.initDate = new Date();
}

var addUserToBd = function(db, user, callback){
    var collection = db.collection('users');
    var token =  Auth.generateToken(user.username, user.password);
    user = _.extend(user, {token:token});
    delete user.password;
    collection.findOne({token:token}, function(err, result){
        /*console.log(err);
        console.log(result);*/
        if(err) callback(err);
        else if(!result) {
            collection.insert(user, function (err, result) {
                if (err) callback(err);
                else {
                    callback(null, result.ops);
                }
            })
        }else{
            callback(null, "user already exists");
        }
    })
};

function User(username){
    this.username = username;
    this.cookie = Auth.generateCookie(this.username);
}

var deleteGame = function(db, options, callback){
    Auth.isAuthorized(options.cookie, function(err, boolean) {
        if (err) {
            callback(err);
        } else {


            var collection = db.collection('games');
            collection.remove({"_id": new ObjectId(options.id)}, function (err, result) {

                if (err) throw err;
                else {
                    callback(null, result);
                }
            })
        }
    });
};


Database.deleteGame = function(options, callback){
    MongoClient.connect(url, function(err, db){
        deleteGame(db, options, callback);
    })
};

Database.restart = function(callback){
    MongoClient.connect(url, function(err, db){
        var collectionUser = db.collection('users');
        var collectionGame = db.collection('games');
        collectionUser.remove({}, function(err){
            if(err) throw err;
            else {
                collectionGame.remove({}, function(err){
                    if(err) throw err;
                    else{
                        callback(null);
                    }
                })
            }
        });

    })
};
Database.addNewUser = function(options, callback){

    var userModel = new User(options.username);
    MongoClient.connect(url, function(err, db){
        addUserToBd(db, _.extend(userModel, options), callback);
    })
};

Database.addGameToUser = function(options, callback){


    MongoClient.connect(url, function(err, db){
        if(err) throw err;
        else insertGame({db:db, cookie:options.cookie}, callback)
    })
};

Database.updateGameFromUser = function(options, callback){
    MongoClient.connect(url, function(err, db){
        options = _.extend(options, {db:db});

        if(err)throw err;
        else {
            updateGame(options, callback);
        }

    })

};
Database.getGamesFromUser = function(idUser, callback){

    MongoClient.connect(url, function(err, db){

        if(err){
            throw err;
        }else{
            getUsernameById(db, idUser, function(err, user){
                //console.log(user);
                if(err) callback(err);
                else if(!_.isEmpty(user)){
                    getGamesFromUser(db, user,callback)
                }else{
                   callback('user not found');
                }
            });
        }
    })
};





var getAllDocument = function(options, callback){
    var collection = options.db.collection(options.document);
    collection.find({}).toArray(function(err, res){
      //console.log(res);
        if(err) throw err;
        else{
            callback (null, res)
        }
    })
};
Database.getAllGames = function(callback){
    MongoClient.connect(url, function(err, db){
        if(err) throw err;
        else{
            getAllDocument({db:db, document:'games'}, callback);
        }
    })
};

Database.getAllUsers = function(callback){
    MongoClient.connect(url, function(err, db){
        if(err) throw err;
        else{
            getAllDocument({db:db, document:'users'}, callback);
        }
    })
};


module.exports = Database;
