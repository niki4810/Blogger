let Post = require('../../models/post')
let Comment = require('../../models/comment')
let _ = require('lodash')
let moment = require('moment')

require('songbird')
module.exports = async (req, res) => {	
    let blogTitle = req.user.blogTitle
    let posts = await Post.promise.find({blogTitle: blogTitle});
    let blogPostObj = {
    	user : req.user,
    	message: req.flash('error')
    }

    if(_.isEmpty(posts)) {
      blogPostObj.blogPosts = [];      
    }else {
        for(let i=0;i<posts.length; i++) {
            let comments = await Comment.promise.find({postId: posts[i].id}); 
            if(_.isEmpty(comments)){
                posts[i].comments = []
            }else {
                posts[i].comments = comments
            }
            for(let j=0;j<posts[i].comments.length; j++){
                let lastModified = posts[i].comments[j].dateUpdated                
                posts[i].comments[j].displayDate = moment(lastModified).format("MMM Do YY")
                let commentText = posts[i].comments[j].commentText
                if(commentText.length > 140){
                    posts[i].comments[j].displayCommentText = commentText.substr(0,140) + "..."
                }else {
                    posts[i].comments[j].displayCommentText = commentText
                }
            }
        }

        blogPostObj.blogPosts = posts            
    }

    res.render('profile.ejs', blogPostObj)
}