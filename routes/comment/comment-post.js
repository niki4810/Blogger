let Comment = require('../../models/comment')
require('songbird')

module.exports = async (req, res) => {
	let postId = req.params.postId
	let commentText = req.body.txtComment
	let comment = new Comment() 
	let dateCreated = new Date()
	comment.commentText = commentText
	comment.username = req.user.username
	comment.postId = postId
	comment.dateCreated = dateCreated
	comment.dateUpdated = dateCreated
	let result = await comment.promise.save()
	console.log('created new comment')
	console.log(result);
	if(req.body.isProfilePage){
		res.redirect('/profile')
	}else {
		res.redirect(`/blog/${encodeURI(req.body.blogTitle)}`)		
	}	
}