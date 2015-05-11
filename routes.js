// require libs
let isLoggedIn = require('./middleware/isLoggedIn')
let then  = require('express-then')

// require route callbacks
let blogGet = require('./routes/blog/blog-get')
let postGet = require('./routes/post/post-get')
let postPost = require('./routes/post/post-post')
let postDelete = require('./routes/post/post-delete')
let profileGet = require('./routes/profile/profile-get')

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
  app.get('/profile', isLoggedIn, then(profileGet))


  // Blog Post Page routes 
  app.get('/post/:postId?',isLoggedIn, then(postGet))

  app.post('/post/:postId?',isLoggedIn, then(postPost))

  app.post('/post-delete/:postId', then(postDelete))

  // Blog page routes
  app.get('/blog/:blogTitle', then(blogGet))
}
