var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * EventDate Model
 * ==========
 */

var EventDate = new keystone.List('EventDate', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

EventDate.add({
    title: {type: String, required: true},
    president: {type: Types.Relationship, ref: 'User', index: true, initial: true},
    description: {type: Types.Textarea, required: false, initial: true},
    eventDate: {type: Types.Date, index: true, required: true, initial: true}
});


EventDate.defaultColumns = 'title, eventDate,president,description';
EventDate.register();
