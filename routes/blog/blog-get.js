let Post = require('../../models/post')
let DataUri = require('datauri')
let _ = require('lodash')

module.exports = async (req, res) => {    
    let blogTitle = req.params.blogTitle
    let posts = await Post.promise.find(blogTitle);
    let blogObj = {
      blogTitle : blogTitle
    } 
    if(_.isEmpty(posts)) {
      blogObj.blogPosts = [];      
    }else {
      blogObj.blogPosts = _.map(posts, function(post) {
        let duri = new DataUri
        let img = duri.format("." + post.image.contentType.split("/").pop() , post.image.data)
        let imgURL = `data:${post.image.contentType};base64,${img.base64}`
        post.displayImage = imgURL
        post.displayDate = ""
        
        if(post.dateCreated) {
          if(post.dateUpdated){
            if(post.dateUpdated > post.dateCreated) {
              post.displayDate = post.dateUpdated.toString()
            }else {
              post.displayDate = post.dateCreated.toString()
            }                
          }else{
            post.displayDate = post.dateCreated.toString();
          }
        } else if(post.dateUpdated) {
          post.displayDate = post.dateUpdated.toString()
        }

        return post
      })
    }
    res.render('blog.ejs', blogObj)    
}