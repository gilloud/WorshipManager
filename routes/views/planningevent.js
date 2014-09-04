var keystone = require('keystone'),
        async = require('async');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
            locals = res.locals;

    // Init locals
    locals.section = 'planningevent';
    locals.filters = {
        eventid: req.params.eventid
    };
    locals.data = {
        competences: [],
        event: []
    };

    // Load all categories
    view.on('init', function(next) {
        keystone.list('Competence').model.find().sort('-poids name').exec(function(err, results) {

            if (err || !results.length) {
                return next(err);
            }

            locals.data.competences = results;
            //console.log('competences', results);

            // Load the counts for each category
            async.each(locals.data.competences, function(competence, next) {

                keystone.list('Registration').model.find().where({$and: [{competence: competence.id}, {eventDate: locals.filters.eventid}, {availability: {$in: ['D', 'SN']}}]}).populate('person competence').exec(function(err, results) {
                    //console.log('registration',results);
                    competence.registrations = results;
                    next(err);
                });

            }, function(err) {
                next(err);
            });

        });
    });

    view.on('init', function(next) {

        keystone.list('EventDate').model.findOne({_id: locals.filters.eventid}).populate('president').exec(function(err, result) {
            locals.data.event = result;
            next(err);
        });


    });


    // Render the view
    view.render('planningevent');

};
