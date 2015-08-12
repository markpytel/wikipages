var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// Notice the 'mongodb' protocol; Mongo is basically a kind of server,

// which handles database requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/wikistack');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'mongodb connection error:'));

// making schema objects using mongoose.Schema


var pageSchema = new mongoose.Schema({
  title:    {type: String, required: true},
  urlTitle: {type: String, required: true},
  content:  {type: String, required: true},
  status:   {type: String, enum: ['open', 'closed']},
  date:     {type: Date, default: Date.now},
  author:   {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

pageSchema.pre('validate', function(next){
	if (!this.urlTitle) {
		this.urlTitle = this.title.replace(/\s+/g,"_").replace(/\W/g,"")
	}
	next();
})

pageSchema.virtual('route').get(function (){
	return '/wiki/' + this.urlTitle;
});

var userSchema = new mongoose.Schema({
  name: {
  	first: {type: String, required: true}, 
  	last: {type: String}
  },
  email: {type: String, required: true, unique: true}
});

userSchema.virtual('name.full').set(function (name) {
  var split = name.split(' ');
  this.name.first = split[0];
  this.name.last = split[1];
});

userSchema.virtual('name.full').get(function (name) {
  return this.name.first + (!!this.name.last ? " " + this.name.last : "");
});

userSchema.statics.findOrCreate = function (userObj) {
	var User = this;
	return User.findOne({email: userObj.email})
	.then(function (user) {
		if (!user) {
			var user = new User({email: userObj.email});
			user.name.full = userObj.name;
			return user.save();
		}
		else return user;
	});
};



// building model objects from the schema using mongoose.model

var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);

// virtual route





// exporting our models

module.exports = {
  Page: Page,
  User: User
};

