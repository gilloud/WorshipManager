var keystone = require('keystone'),
async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
	locals = res.locals;
	
	// Init locals
	locals.section = 'statistiques';
	locals.filters = {
		category: req.params.category
	};
	locals.data = {
		posts: [],
		categories: [],
		theusers : []
	};
	
	// Load all categories
	view.on('init', function(next) {
		
		keystone.list('User').model.find().where().populate('competences').exec(function(err, users) {

			locals.data.theusers = users;
			

			next();
		});
		
	});

	view.on('init',function(next){

		var now = new Date();
		var nowplus = new Date();
		var nowplusplus = new Date();

		nowplus.setDate(now.getDate());
		nowplusplus.setDate(now.getDate() + 45);

		keystone.list('EventDate').model.find().where({eventDate: {$gt: nowplus}},{eventDate: {$lt: nowplusplus}}).exec(function(err, events) {
			locals.data.events = events;
			next();
		});

	});

	view.on('init', function(next) {

		async.each(locals.data.theusers,function(user, next) {

			keystone.list('Registration').model.count().where({$and: [{eventDate: {$in: locals.data.events}}, {competence: {$in: user.competences}}, {
				person: user.id
			}
			]}).exec(function(err, count) {
				user.nbResponses = count;
				next();	
			});

		}, function(err) {
			next(err);
		});

	});


	view.on('init',function(next){
		async.each(locals.data.theusers,function(user, next) {

			if(user.competences.length>0)

			{

				user.percent_filled_f = user.nbResponses / (user.competences.length * locals.data.events.length) * 100;

				user.percent_filled = user.percent_filled_f.toFixed(0);
				if (user.percent_filled > 100)
				{
					user.percent_filled = 100;
					user.percent_filled_f = 1;
				}

				console.log(user.name.first);
				user.red = parseInt(255* (1-(user.percent_filled_f/100)));
				console.log(user.red);
				user.green = parseInt(255* (0+ (user.percent_filled_f/100)));
				console.log(user.green);
				user.blue = 0;

				user.hred = user.red.toString(16);
				console.log(user.hred);
				user.hgreen = user.green.toString(16);
				console.log(user.hgreen);
				user.hblue = user.blue.toString(16);

				if (user.hred.length == 1 ){user.hred = '0'+user.hred;}
				if (user.hgreen.length == 1 ){user.hgreen = '0'+user.hgreen;}
				if (user.hblue.length == 1 ){user.hblue = '0'+user.hblue;}

				user.hexcolor = '#'+user.hred+user.hgreen+user.hblue;
			}
		});

		 locals.data.theusers.sort(function(a, b){return a.percent_filled - b.percent_filled});
		next();
	});

	// Render the view
	view.render('statistiques');
	
};
