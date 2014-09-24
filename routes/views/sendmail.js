var keystone = require('keystone'),
	async = require('async'),
        nodemailer = require("nodemailer");

exports = module.exports = function(req, res) {


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });

	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
    locals.section = 'sendmail';
	locals.filters = {
        eventid: req.params.eventid
	};
	locals.data = {
        registration: [],
        event: []
	};
	
	// Load all categories
	view.on('init', function(next) {
		
        keystone.list('Registration').model.find().where({$and: [{eventDate: locals.filters.eventid}, {registered: true}]}).populate('person competence').exec(function (err, results) {
            //console.log('registration',results);
            locals.data.registration = results;
            next(err);
        });
		
    });

    view.on('init', function (next) {

        keystone.list('EventDate').model.findOne({_id: locals.filters.eventid}).populate('president').exec(function (err, result) {
            locals.data.event = result;
            next(err);
        });


    });
    view.on('init', function (next) {
        console.log(locals.data.event);
var date = new Date(locals.data.event.eventDate);
var d = date.getDate();
var monthNames = [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin","Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ];
var m = monthNames[date.getMonth()];
var y = date.getFullYear();
var jolieDate = d+' '+m+' '+y;
        var email = "Voici la liste des personnes faisant partie du groupe de louange pour le <b>"+locals.data.event.title+"</b> du <b>"+jolieDate+"</b> :<br />";
    if (locals.data.event.description !=='')
    {
    email += "<p><u>Description :</u> <i>"+locals.data.event.description+"</i></p>";
     }  

     email += "<p><u>Destinataires de l'e-mail :</u></p><ul>";
     if(locals.data.event.president)
     {
        email += "<li>President : "+locals.data.event.president.name.first+' '+locals.data.event.president.name.last+"</li>";
     }
for (var i = locals.data.registration.length - 1; i >= 0; i--) {
    var reg = locals.data.registration[i];

         email += "<li>"+reg.competence.name+' : '+reg.person.name.first+' '+reg.person.name.last+"</li>";

     }


    email += "</ul><hr />";

    email += 'Inscrivez vos disponibilités sur <a href="http://louange.epe-drac.fr">EpedLouange</a> !<br />';

        transporter.sendMail({
            from: 'Eped Mail Sender <gilles.pilloud@gmail.com>',
            to: 'gilles@pilloud.fr',
            subject: 'Equipe de louange pour le '+locals.data.event.title+" du "+jolieDate,
            generateTextFromHTML: true,
            html: email
        });

keystone.list('EventDate').model.update({'_id':  locals.filters.eventid}, {mailSent: true}).exec();
                    next();

    });
	
	
	// Render the view
    view.render('sendmail');
	
};
