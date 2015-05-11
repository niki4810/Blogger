let Post = require('../../models/post')
let _ = require('lodash')
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
      blogPostObj.blogPosts = posts
    }

    res.render('profile.ejs', blogPostObj)
}