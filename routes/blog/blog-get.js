let Post = require('../../models/post')
let Comment = require('../../models/comment')
let DataUri = require('datauri')
let _ = require('lodash')

module.exports = async (req, res) => {    
    let blogTitle = req.params.blogTitle
    let posts = await Post.promise.find({blogTitle: blogTitle});
    let blogObj = {
      blogTitle : blogTitle

    } 
    if(_.isEmpty(posts)) {
      blogObj.blogPosts = [];      
    }else {
      for(let i=0; i< posts.length; i++) {
        let duri = new DataUri
        let img = duri.format("." + posts[i].image.contentType.split("/").pop() , posts[i].image.data)
        let imgURL = `data:${posts[i].image.contentType};base64,${img.base64}`
        posts[i].displayImage = imgURL
        posts[i].displayDate = ""
        
        if(posts[i].dateCreated) {
          if(posts[i].dateUpdated){
            if(posts[i].dateUpdated > posts[i].dateCreated) {
              posts[i].displayDate = posts[i].dateUpdated.toString()
            }else {
              posts[i].displayDate = posts[i].dateCreated.toString()
            }                
          }else{
            posts[i].displayDate = posts[i].dateCreated.toString();
          }
        } else if(posts[i].dateUpdated) {
          posts[i].displayDate = posts[i].dateUpdated.toString()
        }        

        // get a list of comments based on postId
        let comments = await Comment.promise.find({postId: posts[i].id}); 
        if(_.isEmpty(comments)){
          posts[i].comments = []
        }else {
          posts[i].comments = comments
        }
      }
      blogObj.blogPosts = posts
    }
    blogObj.user = req.user
    res.render('blog.ejs', blogObj)    
}