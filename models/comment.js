// post.js
let mongoose = require('mongoose')

let CommentSchema = mongoose.Schema({
	commentText: {
		type:String,
		required: true
	},
    username: {
		type:String,
		required: true
	},
	postId: String,
	dateCreated: Date,
	dateUpdated: Date
})

module.exports = mongoose.model('Comment', CommentSchema)