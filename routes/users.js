var express = require('express');
var router = express.Router();
var models = require('../models/');
var Page = models.Page;
var User = models.User;

/* GET users listing. */
router.get('/', function(req, res, next) {

	User.find().exec().then(function(userlist){
		console.log(userlist)
		  res.render('users', {data: userlist});
	})

});

router.get('/:userId', function(req, res, next){
	var userId = req.params.userId;
	var lookUpArray = [
	User.findOne({_id: userId}).exec(),
	Page.find({author: userId}).exec()
	]


	Promise.all(lookUpArray).then(function(answerArray){
		var user = answerArray[0];
		var pages = answerArray[1];
		res.render('user', {user: user, data: pages})
	});
})

module.exports = router;
