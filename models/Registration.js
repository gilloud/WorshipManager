var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Registration Model
 * ==========
 */

var Registration = new keystone.List('Registration', {
    map: {name: 'title'},
    autokey: {path: 'slug', from: 'title', unique: true}
});

Registration.add({
    availability: {type: Types.Select, options: 'D, SN, ND, C', default: 'disponible', index: true, initial: true, required: true},
    person: {type: Types.Relationship, ref: 'User', index: true, initial: true, required: true},
    competence: {type: Types.Relationship, ref: 'Competence', index: true, initial: true, required: true},
    eventDate: {type: Types.Relationship, ref: 'EventDate', initial: true, required: true},
    registered: {type: Types.Boolean, initial: true, required: true}
});

Registration.defaultColumns = 'person, availability,competence,eventDate';
Registration.register();
