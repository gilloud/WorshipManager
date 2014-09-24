var keystone = require('keystone'),
        async = require('async'),
        Registration = keystone.list('Registration');

function sleep(ms) {
    var start = new Date().getTime(), expire = start + ms;
    while (new Date().getTime() < expire) {
    }
    return;
}


exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
            locals = res.locals;
    // Init locals
    locals.section = 'disponibilite';

    locals.formData = req.body || {};

    /*locals.filters = {
     category: req.params.category
     };*/

    locals.data = {
        registrations: [],
        competences: [],
        events: [],
        bootstrapsize: '1',
        nbdayslock: 6,
        nbCompetencesEnableGlobal: 2
    };
    // Load all categories
    view.on('init', function(next) {
        if (!locals.user)
        {
            return next('not connected');
        }

        keystone.list('Registration').model.find().where('person', locals.user.id).sort('eventDate competence').populate('competence eventDate').exec(function(err, reg) {
            if (err || !reg.length) {
                console.log('aa', err);
                return next(err);
            }
            locals.data.registrations = reg;

            async.forEach(locals.data.registrations, function(registration, next2) {
        
                if(registration.registered === true)
                {
                    keystone.list('Registration').model.find().where({$and: [{'person': {$ne: locals.user.id}},{'eventDate':registration.eventDate.id},{'competence':registration.competence.id},{'availability':{$in: ['D', 'SN']}}]}).populate('person').exec(
function(err, reg2) {
    registration.remplacements = reg2;

                                        next2(err);

}
                        );
                }
            }, function(err) {
                next(err);
            });

            //console.log('registrations', locals.data.registrations);
            next();
        });
    });
    view.on('init', function(next) {
        var today = new Date();
        keystone.list('EventDate').model.find().where({eventDate: {$gt: today}}).sort('eventDate').exec(function(err, results) {

            if (err || !results.length) {
                return next(err);
            }

            locals.data.events = results;
            //console.log('events:', locals.data.events);
            next();
        });
    });
    view.on('init', function(next) {
        if (!locals.user)
        {
            next('not connected');
        }
        keystone.list('User').model.findOne().where('_id', locals.user.id).populate('competences').exec(function(err, user) {

            locals.data.competences = user.competences;

            // bootstrapize est une fonctionnalité permettant de faire passer bootrstap sur une colonne au lieu de deux
            // quand la personne a plus de 5 compétences car 5x2 colonnes + 2 colonnes de date = 12, soit le max dans un modèle
            // en tableau
            locals.data.bootstrapsize = '2';
            if (user.competences.length > 5)
            {
                locals.data.bootstrapsize = '1';
            }
            //console.log('competences:', locals.data.competences);
            next();
        });
    });

    view.on('post', function(next) {

        if (!locals.user)
        {
            next('not connected');
        }
        for (var key in locals.formData)
        {
            var local_val = locals.formData[key];
            if (local_val !== 'C')
            {

                var a_key = key.split('-');
                var found = a_key[0];
                var eventId = a_key[1];
                var competenceId = a_key[2];
                //console.log(eventId + '|' + competenceId + '|' + locals.user.id + '>' + local_val + '>');
                if (competenceId !== 'all')
                {
                if (found === 'UPDATE')
                {

                    // console.log('updating');
                    keystone.list('Registration').model.update({$and: [{'person': locals.user.id}, {'competence': competenceId}, {'eventDate': eventId}]}, {availability: local_val}).exec();
                }
                else
                {
                    // console.log('create');
                    var newRegistration = new Registration.model({
                        availability: locals.formData[key],
                        person: locals.user.id,
                        competence: competenceId,
                        eventDate: eventId
                    });
                    newRegistration.save();


                    }
                }
            }
        }

        return res.redirect('/disponibilite');


    });
    view.render('disponibilite');
};
