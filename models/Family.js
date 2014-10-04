var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Family Model
 * ==========
 */

var Family = new keystone.List('Family', {
    map: {name: 'name'},
    autokey: {path: 'slug', from: 'name', unique: true}
});

Family.add({
    name:{ type: String, required: true , initial:true}

});

Family.relationship({ ref: 'User', path: 'family' ,refPath:'family'});


Family.defaultColumns = 'name';
Family.register();
