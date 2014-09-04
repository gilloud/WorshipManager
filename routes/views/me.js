var keystone = require('keystone'),
        async = require('async'),
        bcrypt = require('bcrypt-nodejs')
        ;

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
            locals = res.locals;
    // Init locals
    locals.section = 'me';
    locals.filters = {
    };
    locals.data = {
        competences: []
    };
    locals.formData = req.body || {};
    // Load all categories
    view.on('init', function(next) {

        if (!locals.user)
        {
            next('not connected');
        } else {
            keystone.list('User').model.findOne().where('_id', locals.user.id).populate('competences').exec(function(err, user) {

                locals.data.competences = user.competences;
                next();
            });
        }
    });
    view.on('post', function(next) {

        if (!locals.user)
        {
            next('not connected');
        }
        

        if (locals.formData.password !== '') {
            bcrypt.genSalt(10, function(err, salt) {
                if (err)
                    return res.redirect('/me');

                bcrypt.hash(locals.formData.password, salt, function() {
                }, function(err, hash) {
                    if (err)
                        return res.redirect('/me');

                    // override the cleartext password with the hashed one
                    locals.formData.password = hash;
                    keystone.list('User').model.update({'_id': locals.user.id}, locals.formData).exec(function(err, numAffected, c) {
                    });
                });
            });
        } else {
            console.log('je ne change pas le passwod');
            delete locals.formData.password;
            keystone.list('User').model.update({'_id': locals.user.id}, locals.formData).exec(function(err, numAffected, c) {
            });
        }
        
        return res.redirect('/me');
    });
    // Render the view
    view.render('me');
};


/*
 * { __v: 5, _id: 53eb1c2ad1470ca02324925f, email: 'gilles@pilloud.fr', facebookLoginId: 'gilles@pilloud.fr',
 *  googleLoginId: 'gilles.pilloud@gmail.com', isAdmin: true, password: '$2a$10$z7iUuQp2.Lu7y2FMuYREKuHd3mGeTp6oULdl683RYyQSDTpfOD0V.', social: { '[object Object]': {} }, competences: [ 53eb25003cc9d630198d0e0d, 53ebd679f6132cdc14915460, 53ebd6cef6132cdc14915461, 53ebd6dcf6132cdc14915462, 53ebd66ef6132cdc1491545f ], name: { first: 'Gilles', last: 'PILLOUD' } }
 *
 */