var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var url = 'mongodb://localhost:27017/myproject';
var insertGameToUser = function(db, jsonObject, callback){
    var collection = db.collection('users');
    collection.insert([jsonObject], function(err, result){
        if(err){
            throw err
        }else{
            callback({data:jsonObject});
        }
    })
}

function Database(){
    this.user= null;
    this.initDate= null;
    this.finishDate = null;
    this.rivalName = null;
    this.winner = null;

}

Database.addGameToUser = function(idUser, callback){

};
Database.deleteGameFromUser = function(idGame, idUser, callback){

};
Database.updateGameFromUser = function(idGame, idUser, callback){

};
Database.getGamesFromUser = function(idUser, callback){

};
Database.getGameFromUser = function(idGame, idUser, callback){

};

module.exports = Database;
