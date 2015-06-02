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
router.get('/', function(req, res, next){
    Database.getAllUsers(function(err, users){
        if(err) throw err;
        else{
            res.status(200).send
            ({data:users});
        }
    })
});
router.post('/', function(req, res, next){
    //console.log(req.body);
    //console.log(req.body.username);
    if(req.body.username && req.body.password) {
        Database.addNewUser(req.body, function (err, data) {
            if (err) res.status(400).send({err: err})
            else {
                res.cookie('cookie', data.cookie);
                res.status(200).send({data: data});
            }
        })
    }else{

        res.status(400).send({err:"parameters incorrect"})
    }
});
router.get('/:idUser/games', function(req, res, next) {
  // TODO return all games of an User

    //console.log("peticio arrivada");
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
    if (!req.headers.cookie){
        res.status(400).send({data:"not permisions to do a post"})
       return next();
    }

    var id = req.params.idUser;
    if(id) {

        Database.addGameToUser({id:id, cookie:req.headers.cookie}, function (err, game) {

            if (err) {

                next(err);
            } else {
                //console.log(game);
                res.status(200).send({data: game});
            }
        })
    }else{
        next("id must be a number");
    }
});

router.put('/:idUser/games/:id', function(req, res, next){
    /*console.log(req.headers.cookie);*/
    //console.log(1111111);
    //console.log(req.body);
    if(!req.headers.cookie || !req.body){
        res.status(400).send({data:"not permisions to do a put"})
        return next()
    }else {

        var database = new Database();

        database = _.extend(database, req.body);
        database = _.extend(database, {idGame: req.params.id, idUser: req.params.idUser});

        Database.updateGameFromUser({user: database, cookie: req.headers.cookie}, function (err, game) {
            if (err) {
                next(err);
            } else {
                //console.log("------------------")
                //console.log(game);
                res.status(200).send({data: game});
            }

        });

    }
});



router.get('/:idUser/games/:id', function(req, res, next){
    var idUser = req.params.idUser;
    var idGame = req.params.id;

    if(idGame && idUser ) {
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
    var idUser = req.params.idUser;
    var idGame = req.params.id;
    var cookie = req.headers.cookie;

    if(idGame && idUser && cookie){
        Database.deleteGame({idGame:idGame, cookie:cookie}, function(err, rows){

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
