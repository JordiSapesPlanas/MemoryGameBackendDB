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
    collection.find({$or:[{loser:user.name}, {winner:user.name}]}).toArray(function(err, docs){
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
        console.log(err);
        console.log(docs);
        if(err) {
            console.log(1)
            callback(err);

        }else if (!docs || _.isEmpty(docs)) {
            console.log(2)
        }else{
            console.log(3)
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
        console.log(game._id);
        console.log(query);
        var obj = eval();
        console.log(obj)
        collection.update({_id: new ObjectId(game._id)}, query,function(err, result){
            if(err){
                console.log(err);
                callback(err);
            }else{
                console.log(result);
                callback(null, result);
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
    this.finishDate = null;
}

var addUserToBd = function(db, username, callback){
    var collection = db.collection('users');
    collection.insert({username:username}, function(err, result){
        if(err) callback(err);
        else {
            console.log(result);
            callback (null, result.ops);
        }
    })
};

Database.addNewUser = function(username, callback){
    MongoClient.connect(url, function(err, db){
        addUserToBd(db, username, callback);
    })
};

Database.addGameToUser = function(idUser, callback){
    MongoClient.connect(url, function(err, db){
        if(err) throw err;
        else insertGame(db, callback)
    })
};
Database.deleteGameFromUser = function(idGame, idUser, callback){



    /*
    MongoClient.connect(url, function(err, db){

    })*/
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
    console.log(111111)
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
Database.getGameFromUser = function(idGame, idUser, callback){

};

module.exports = Database;
