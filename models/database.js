var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var _ = require ('underscore');
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/MemoryGameBackendDB';


var getUsernameById = function(db, id, callback) {
    var collection = db.collection('users');
    console.log(id);
    collection.findOne({"_id":new ObjectId(id)}, function(err, doc){
        console.log(err);
        console.log(doc)
        if(err) callback(err);
        else callback(null, doc);
    });
};



var insertGame = function(db, callback){
    var collection = db.collection('games');
    collection.insert(new Database(), function(err, result){
        if(err){
            throw err
        }else{
            callback(null, result.ops);
        }
        db.close()
    })
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
    var db = options.db;
    var idGame = options.idGame;
    var collection= db.collection('games');
    collection.findOne({"_id":new ObjectId(idGame)}, function(err, docs){

        if(err) {
            console.log(1)
            callback(err);

        }else if (!docs || _.isEmpty(docs)) {
            callback("game not found");
        }else{
            callback(null, docs);
        }


    })
};
var updateGame = function(options, callback){
    getGame(options, function(err, game){
        console.log(game);
        if(options.winner== "" && options.loser == ""){
            callback("no camps fill")
            return;
        }
        var query;
        if(options.winner){
            query = createQueryUpdate('winner', options.winner)
        }
        if(options.loser){
            query = createQueryUpdate('loser', options.loser);
        }
        var collection = options.db.collection('games');
        collection.update({_id: new ObjectId(game._id)}, query,function(err, result){
            if(err){
                callback(err);
            }else{
                callback(null, result.result);
            }
        })
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
    collection.insert(user, function(err, result){
        if(err) callback(err);
        else {
            console.log(result);
            callback (null, result.ops);
        }
    })
};

function User(){
    this.username = null;
}



var deleteGame = function(db, id, callback){
  var collection = db.collection('games');
    collection.remove({"_id":new ObjectId(id)}, function(err, result){

        if(err) throw err;
        else{
            callback(null, result);
        }
    })
};
Database.deleteGame = function(idGame, callback){
    MongoClient.connect(url, function(err, db){
        deleteGame(db, idGame, callback);
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
Database.addNewUser = function(user, callback){
    var userModel = new User();
    MongoClient.connect(url, function(err, db){
        addUserToBd(db, _.extends(userModel, user) , callback);
    })
};

Database.addGameToUser = function(idUser, callback){
    MongoClient.connect(url, function(err, db){
        if(err) throw err;
        else insertGame(db, callback)
    })
};

Database.updateGameFromUser = function(options, callback){
    MongoClient.connect(url, function(err, db){
        options = _.extend(options, {db:db});
        console.log(options);
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
                console.log(user);
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
      console.log(res);
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
