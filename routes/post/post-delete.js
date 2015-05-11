let Post = require('../../models/post')
require('songbird')
module.exports = async (req, res) => {
    let postId = req.params.postId
    console.log(postId)
    if(postId){      
      let post = await Post.promise.findById(postId)
      if(post){
        await post.promise.remove();
        res.redirect('/profile')
      }
    } 
  }