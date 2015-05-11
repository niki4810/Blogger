let Post = require('../../models/post')
let DataUri = require('datauri')
let multiparty = require('multiparty')
let fs = require('fs')
let _ = require('lodash')
require('songbird')

module.exports = async (req, res) => {
    let postId = req.params.postId
    let[{title: [title], content: [content]}, {image: [file]}] = await new multiparty.Form().promise.parse(req)
    if(!postId){     
      let post = new Post() 
      let dateCreated = new Date();
      post.title = title
      post.content = content
      post.dateCreated = dateCreated
      post.dateUpdated = dateCreated // when creating a new post, date created is equal to date updated
      post.image.data = await fs.promise.readFile(file.path)
      post.image.contentType = file.headers['content-type']      
      post.blogTitle = req.user.blogTitle
      let result = await post.save()
      console.log('created new post')
      console.log(result);
      res.redirect(`/blog/${encodeURI(req.user.blogTitle)}`)
      return
    }

    let post = await Post.promise.findById(postId)
    if(!post) res.send(404, "Could not find the requested post")
    post.title = title
    post.content = content
    if(!_.isEmpty(file) && !_.isEmpty(file.path)) {
      post.image.data = await fs.promise.readFile(file.path)
      post.image.contentType = file.headers['content-type']      
    }
    post.dateUpdated = new Date() 
    post.blogTitle = req.user.blogTitle
    let updatedResult = await post.save()  
    console.log('updated post')
    console.log(updatedResult)
    res.redirect(`/blog/${encodeURI(req.user.blogTitle)}`) 
    return    
}