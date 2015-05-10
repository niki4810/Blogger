// user.js
let mongoose = require('mongoose')
let bcrypt = require('bcrypt')
require('songbird')

let UserSchema = mongoose.Schema({
	username: {
		type:String,
		required: true
	},
    email: {
		type:String,
		required: true
	},
    password: {
		type:String,
		required: true
	},
	blogTitle: String,
	blogDescription: String
})

UserSchema.methods.generateHash = async function(password) {
	return await bcrypt.promise.hash(password, 8)
}

UserSchema.methods.validatePassword = async function(password) {
	return await bcrypt.promise.compare(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)