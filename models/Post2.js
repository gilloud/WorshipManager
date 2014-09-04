var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post2 = new keystone.List('Post2', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Post2.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true }
});

Post2.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Post2.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
//Post2.register();
