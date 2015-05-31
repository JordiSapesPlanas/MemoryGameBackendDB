var express = require('express');
var router = express.Router();
var Database = require ('../models/database');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/restart', function(req, res, next){

    Database.restart(function (err, result) {
        if(err) throw err;
        else{
            res.status(200).send({data:'OK'})
        }

    })
});
router.get('/games', function(req, res){
   Database.getAllGames(function(err, result){
       if(err) throw err;
       else{
           res.status(200).send({data:result});
       }
   })
});

module.exports = router;
