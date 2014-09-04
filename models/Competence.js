var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * PostCategory Model
 * ==================
 */

var Competence = new keystone.List('Competence', {
	autokey: { from: 'name', path: 'key', unique: true }
});

Competence.add({
	name: { type: String, required: true },
	poids: { type: Number,initial:true }
});

Competence.relationship({ ref: 'User', path: 'competences' ,refPath:'competences'});

Competence.defaultColumns = 'name, poids';

Competence.register();
