// post.js
let mongoose = require('mongoose')

let PostSchema = mongoose.Schema({
	title: {
		type:String,
		required: true
	},
    content: {
		type:String,
		required: true
	},
    image: {
		data:Buffer,
		contentType: String
	},
	dateCreated: Date,
	dateUpdated: Date,
	blogTitle:String	
})

module.exports = mongoose.model('Post', PostSchema)