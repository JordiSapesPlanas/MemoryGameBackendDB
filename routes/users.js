var express = require('express');
var router = express.Router();
var Database  = require('../models/database');
var game = new Database();
/* GET users listing. */

router.get('/:username', function(req,res, next){
  // TODO return a user and his ID
});

router.get('/:idUser/games', function(req, res, next) {
  // TODO return all games of an User
    var id = parseInt(req.params.idUser);
    if(id){
        Database.getGamesFromUser(id, function(err, games){
            if(err){
                next(err);
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
    var id = parseInt(req.params.idUser);
    if(id) {

        Database.addGameToUser(function (err, game) {
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
    var idUser = parseInt(req.params.idUser);
    var idGame = parseInt(req.params.id);
    if(idGame && idUser){
        Database.updateGameFromUser(idGame, idUser, function(err, game){
           if(err){
               next(err);
           } else{
               res.status(200).send({data:game});
           }

        });

    }else{
        next("id's must be a number");
    }

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
