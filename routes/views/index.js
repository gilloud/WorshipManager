var keystone = require('keystone'), async = require('async');


exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
    locals.section = 'home';
    locals.data = {
        competences: 0,
        nbResponses: 0,
        percent_filled: 0,
        nbevents: 0
    };
    view.on('init', function(next) {
        if (locals.user)
        {
        keystone.list('User').model.findOne().where('_id', locals.user.id).populate('competences').exec(function(err, user) {

            locals.data.competences = user.competences;
            //   next();
            var now = new Date();
            var nowplus = new Date();
            nowplus.setDate(now.getDate() + 6);
            keystone.list('EventDate').model.find().where({eventDate: {$gt: nowplus}}).exec(function(err, events) {
                locals.data.nbevents = events.length;
                keystone.list('Registration').model.count().where({$and: [{eventDate: {$in: events}}, {competence: {$in: locals.data.competences}}, {
                    person: locals.user.id
                }
                ]}).exec(function(err, count) {
                    locals.data.nbResponses += count;


                    next();
                });
            });
            });
        } else
        {
            next();
        }
    });
    view.on('init', function(next) {

                locals.data.percent_filled = locals.data.nbResponses / (locals.data.competences.length * locals.data.nbevents) * 100;
        locals.data.percent_filled = locals.data.percent_filled.toFixed(0);
        if (locals.data.percent_filled > 100)
        {
            locals.data.percent_filled = 100;
        }
        
        next();
    });
   
	// Render the view
	view.render('index');
	
};
