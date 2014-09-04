var keystone = require('keystone'),
	Types = keystone.Field.Types;
var social = require('keystone-social-login');
/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');


User.add({
    name: {type: Types.Name, required: true, initial: true, index: true},
    email: {type: Types.Email, initial: true, required: true, index: true},
    password: {type: Types.Password, initial: true, required: true},
    competences: {type: Types.Relationship, ref: 'Competence', many: true, initial: true}

}, 'Permissions', {
    isAdmin: {type: Boolean, label: 'Can access Keystone', index: true}
});

social.plugin(User);


// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
    return this.isAdmin;
});


/**
 * Relationships
 */

//User.relationship({ref: 'Post', path: 'author'});


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin, competences';
User.register();
