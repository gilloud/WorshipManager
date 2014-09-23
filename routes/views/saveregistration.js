var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
    locals.section = 'saveregistration';
	locals.filters = {
        registration: req.params.registration,
        action: req.params.action,
	};
	locals.data = {
		
	};
	
	
	// Load the current category filter
	view.on('init', function(next) {
	var toRegister = false;

        if (locals.filters.action === 'add')
        {
            toRegister = true;
        }


        if (req.params.registration) {
        keystone.list('Registration').model.update({'_id': req.params.registration}, {registered: toRegister}).exec();
            console.log(toRegister);
            next();
        } 
		
	});
	// Render the view
    view.render('saveregistration');

};
