let isLoggedIn = require('./middleware/isLoggedIn')
let multiparty = require('multiparty')
let then  = require('express-then')
let Post = require('./models/post')
let fs = require('fs')
let DataUri = require('datauri')
let _ = require('lodash')

let blogGet = require('./routes/blog/blog-get')
let postGet = require('./routes/post/post-get')
let postPost = require('./routes/post/post-post')

module.exports = (app) => {
  let passport = app.passport

  app.get('/', (req, res) => {
    res.render('index.ejs')
  })

  // Login page routes
  app.get('/login', (req, res) => {
    res.render('login.ejs', {message: req.flash('error')})
  })

  app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  } ))

  // Sign up page routes
  app.get('/signup', (req, res) => {
    res.render('signup.ejs', {message: req.flash('error')})
  })
  
  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }))

  //Logout page routes 
  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  // Profile page routes
  app.get('/profile', isLoggedIn, (req, res) => {
    // let posts = await Post.promise.find(req.user.blogTitle);
    // if(_.isEmpty(posts)) {
    //   blogObj.blogPosts = [];      
    // }else {

    // }
    res.render('profile.ejs', {
      user: req.user,
      message: req.flash('error')
    })
  })


  // Blog Post Page routes 
  app.get('/post/:postId?',isLoggedIn, then(postGet))

  app.post('/post/:postId?',isLoggedIn, then(postPost))

  // Blog page routes
  app.get('/blog/:blogTitle', then(blogGet))
}
