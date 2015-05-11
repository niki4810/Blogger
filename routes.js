let isLoggedIn = require('./middleware/isLoggedIn')
let multiparty = require('multiparty')
let then  = require('express-then')
let Post = require('./models/post')
let fs = require('fs')
let DataUri = require('datauri')
let _ = require('lodash')

module.exports = (app) => {
  let passport = app.passport

  app.get('/', (req, res) => {
    res.render('index.ejs')
  })

  app.get('/login', (req, res) => {
    res.render('login.ejs', {message: req.flash('error')})
  })

  app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  } ))

  app.get('/signup', (req, res) => {
    res.render('signup.ejs', {message: req.flash('error')})
  })
  
  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }))

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs', {
      user: req.user,
      message: req.flash('error')
    })
  })

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  app.get('/post/:postId?',isLoggedIn, then(async (req, res) => {
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
  }))

  app.post('/post/:postId?',isLoggedIn, then(async (req, res) => {
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
    if(!_.isEmpty(file)) {
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
  }))


app.get('/blog/:blogTitle', then(async (req, res) => {    
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
  }))
}
