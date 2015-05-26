var express = require('express');
var router = express.Router();
var Game  = require('../models/game');
var game = new Game();
/* GET users listing. */

router.get('/:username', function(req,res, next){
  // TODO return a user and his ID
});

router.get('/:idUser/games', function(req, res, next) {
  // TODO return all games of an User

  res.status(200).send("all partides");
});
router.post('/:idUser/games', function(req,res, next){
  // TODO return the game that is post in the db
  res.status(200);
});
router.put('/:idUser/games/:id', function(req, res, next){
  // TODO return the game modified

});
router.get('/:idUser/games/:id', function(req, res, next){
  // TODO return the game with id :id
});
router.delete('/:idUser/games/:id', function(req, res, next){
  // TODO delete a game with id Game
});

module.exports = router;
