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