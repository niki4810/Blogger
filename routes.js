let isLoggedIn = require('./middleware/isLoggedIn')
let multiparty = require('multiparty')
let then  = require('express-then')
let Post = require('./models/post')
let fs = require('fs')

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

  app.get('/post/:postId?', (req, res) => {
    let postId = req.params.postId
    if(!postId){      
      res.render('post.ejs', {
        post: {},
        verb: 'Create'
      })    
    }
  })

  app.post('/post/:postId?', then(async (req, res) => {
    let postId = req.params.postId
    if(!postId){     
      let post = new Post()
      let[{title: [title], content: [content]}, {image: [file]}] = await new multiparty.Form().promise.parse(req)
      post.title = title
      post.content = content
      post.image.data = await fs.promise.readFile(file.path)
      post.image.contentType = file.headers['content-type']
      await post.save()
      res.redirect(`/blog/${encodeURI(req.user.blogTitle)}`)
      return
    }
  }))
}
