var express = require('express');
var router = express.Router();
var Database  = require('../models/database');
var game = new Database();
var _ = require('underscore');
/* GET users listing. */

router.get('/:username', function(req,res, next){
  // TODO return a user and his ID
  res.status(200).send({data:1});
});
router.post('/', function(req, res, next){
    console.log(req.body);
    console.log(req.body.username);
    if(req.body.username) {

        Database.addNewUser(req.body.username, function (err, data) {
            if (err) res.status(400).send({err: err})
            else res.status(200).send({data: data});
        })
    }else{
        console.log()
        res.status(400).send({err:"parameters incorrect"})
    }
});
router.get('/:idUser/games', function(req, res, next) {
  // TODO return all games of an User

    console.log("peticio arrivada");
    var id = req.params.idUser;
    if(id){
        Database.getGamesFromUser(id, function(err, games){
            if(err){
                res.status(400).send({data:err});
            }else{
                res.status(200).send({data:games});
            }
        });
    }else{
        next("id must be a number");
    }
});
router.post('/:idUser/games', function(req,res, next){
  // TODO return the game that is post in the db


    if(id) {

        Database.addGameToUser(id, function (err, game) {

            if (err) {

                next(err);
            } else {
                res.status(200).send({data: game});
            }
        })
    }else{
        next("id must be a number");
    }


});
router.put('/:idUser/games/:id', function(req, res, next){



        var database = new Database();
        console.log(database);
        console.log(req.body);
        database = _.extend(database, req.body);
        database = _.extend(database, {idGame:req.params.id, idUser:req.params.idUser});
        console.log(database);
        Database.updateGameFromUser(database,  function(err, game){
           if(err){
               next(err);
           } else{
               res.status(200).send({data:game});
           }

        });



});
router.get('/:idUser/games/:id', function(req, res, next){
    var idUser = parseInt(req.params.idUser);
    var idGame = parseInt(req.params.id);
    if(idGame && idUser) {
        Database.getGameFromUser(idGame, idUser, function(err, game){
           if(err){
               next(err);
           } else{
               res.status(200).send({data:game});
           }
        });
    }
    else{
        next('ids must be a number');
    }
});
router.delete('/:idUser/games/:id', function(req, res, next){
    var idUser = parseInt(req.params.idUser);
    var idGame = parseInt(req.params.id);
    if(idGame && idUser){
        Database.deleteGameFromUser(idGame, idUser, function(err, rows){
            if(err){
                next(err);
            }else{
                res.status(200).send({data:rows});
            }
        })
    }else{
        next('ids must be a number');
    }
});


module.exports = router;
