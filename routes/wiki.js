var express = require('express');
var router = express.Router();
var models = require('../models/');
var Page = models.Page;
var User = models.User;



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.post('/', function(req, res, next){
	//console.log(req.body);

	User.findOrCreate({email: req.body.email, name: req.body.name })
	.then(function (user) {
		var page = new Page({
			title: req.body.title,
			content: req.body.content,
			author: user._id
		})
		return page.save();
	})
	.then(function(page){
		res.redirect(page.route)
	}).then(null, next);


  // STUDENT ASSIGNMENT:
  // make sure we only redirect *after* our save is complete!
  // note: `.save` returns a promise or it can take a callback.
	// page.save().then(function(page){
	// 	console.log(page.route)
	// 	console.log(page)
	// 	console.log(page.model.toString())
	// 	  res.redirect(page.route)
	// }).then(null, next);
	// -> after save -> res.redirect('/');


});

router.get('/add', function(req, res, next){
	res.render('addpage');
});

router.get('/:pagetitle', function(req, res, next){
	var pagetitle = req.params.pagetitle;
	var pageStore;

	Page.findOne({'urlTitle': pagetitle})
	.populate('author').exec().then(function(page){
		res.render('wikipage', {author: page.author, page: page})
	})
	.catch(next);

	
})

module.exports = router;
