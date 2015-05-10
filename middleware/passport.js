let LocalStrategy = require('passport-local').Strategy
let nodeifyit = require('nodeifyit')
let User = require('../models/user')

module.exports = (app) => {
  let passport = app.passport

  passport.serializeUser(nodeifyit(async (user) => user._id))
  passport.deserializeUser(nodeifyit(async (id) => {
    return await User.promise.findById(id)
  }))

  let getUserNameRegEx = function(username) {
    let regexp = new RegExp(username, 'i')
    let query = {
      username: {$regex: regexp}
    }
    return query  
  }

  passport.use(new LocalStrategy({
    // Use "email" field instead of "username"
    usernameField: 'username',
    failureFlash: true
  }, nodeifyit(async (username, password) => {
    let user    
    if(username.indexOf('@') !== -1) {      
      let email = username.toLowerCase()
      user = await User.promise.findOne({email: email})
      if (!user || email !== user.email) {
        return [false, {message: 'Invalid email'}]
      }
    }else {      
      user = await User.promise.findOne(getUserNameRegEx(username))
      if (!user || username !== user.username) {
        return [false, {message: 'Invalid username'}]
      }
    }
  
    if (!await user.validatePassword(password)) {
      return [false, {message: 'Invalid password'}]
    }
    return user
  }, {spread: true})))


  passport.use('local-signup', new LocalStrategy({
    // Use "email" field instead of "username"
    usernameField: 'email',
    failureFlash: true,
    passReqToCallback: true
  }, nodeifyit(async (req, email, password) => {    
      email = (email || '').toLowerCase()
      // Is the email taken?
      if (await User.promise.findOne({email})) {
        return [false, {message: 'That email is already taken.'}]
      }
      let {username, title, description} = req.body
      
      if(await User.promise.findOne(getUserNameRegEx(username))) {
       return [false, {message: 'That username is already taken.'}] 
      }
      // create the user
      let user = new User()
      user.username = username
      user.email = email
      user.blogTitle = title      
      user.blogDescription = description
      
      // Use a password hash instead of plain-text
      user.password = await user.generateHash(password)
      try{
        return await user.save()
      }catch(e) {
        return [false, {message: e.message}]
      }      
  }, {spread: true})))
}
