let Post = require('../../models/post')
let DataUri = require('datauri')

module.exports = async (req, res) => {
    let postId = req.params.postId
    if(!postId){      
      res.render('post.ejs', {
        post: {},
        verb: 'Create'
      })    
      return
    } 

    let post = await Post.promise.findById(postId)
    if(!post) res.send(404, "Not found")

    let duri = new DataUri
    let image = duri.format("." + post.image.contentType.split("/").pop() ,
      post.image.data)
    res.render('post.ejs', {
      post: post,
      verb: 'Edit',
      image: `data:${post.image.contentType};base64,${image.base64}`     
    })
}