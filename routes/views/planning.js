var keystone = require('keystone'),
        async = require('async');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
            locals = res.locals;

    // Init locals
    locals.section = 'planning';
    locals.filters = {
        category: req.params.category
    };
    locals.data = {
        events: [],
        oldevents: [],
        countCompetences: 0,
        countDispo: 0
    };

    // Load all categories
    view.on('init', function(next) {
        var today = new Date();
        locals.data.countCompetences = 0;
        locals.data.countDispo = 0;

        keystone.list('User').model.find().where().exec(function(err, users) {
            if (err || !users.length) {
                return next(err);
            }
            async.each(users, function(user, next) {
                locals.data.countCompetences += user.competences.length;
            }, function(err) {
                next(err);
            });
        });

        keystone.list('EventDate').model.find().where({eventDate: {$gt: today}}).sort('eventDate').populate('president').exec(function(err, results) {
            if (err || !results.length) {
                return next(err);
            }
            locals.data.events = results;
            async.each(locals.data.events, function(event, next) {

                keystone.list('Registration').model.count().where({$and: [{eventDate: event._id}, {availability: {$in: ['D', 'SN']}}]}).exec(function(err, count) {
                    event.countDispo = count;
                });
                keystone.list('Registration').model.count().where({$and: [{eventDate: event._id}, {availability: {$in: ['D', 'SN', 'ND']}}]}).exec(function(err, count) {
                    event.nbResponses = count;
                });
            }, function(err) {
            });

           

            next();
        });


    });


    view.on('init', function(next) {
        var today = new Date();

        keystone.list('EventDate').model.find().where({eventDate: {$lt: today}}).sort('eventDate').populate('president').exec(function(err, results) {
            if (err || !results.length) {
                return next(err);
            }
            locals.data.oldevents = results;

            next();
        });

    });


    // Render the view
    view.render('planning');

};
