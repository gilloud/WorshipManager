/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var _ = require('underscore'),
        keystone = require('keystone'),
        middleware = require('./middleware'),
        importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
    views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {

    // Views
    app.get('/', routes.views.index);
    //app.get('/blog/:category?', routes.views.blog);
    //app.get('/blog/post/:post', routes.views.post);
    //app.get('/blog2/:category?', routes.views.blog2);
    //app.get('/blog2/post2/:post', routes.views.post2);
    app.all('/disponibilite', routes.views.disponibilite);
    app.all('/planning', routes.views.planning);
    app.all('/planning/:eventid', middleware.requireUser,routes.views.planningevent);
    app.all('/sendmail/:eventid', middleware.requireUser, routes.views.sendmail);
    app.all('/planning/save/:registration/:action', middleware.requireUser, routes.views.saveregistration);
    app.all('/contact', routes.views.contact);
    app.all('/me', routes.views.me);
    app.all('/statistiques', routes.views.statistiques);

    // NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
    // app.get('/protected', middleware.requireUser, routes.views.protected);

};
