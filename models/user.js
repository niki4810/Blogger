// user.js
let mongoose = require('mongoose')
let bcrypt = require('bcrypt')
let nodeify = require('bluebird-nodeify')

require('songbird')

const SALT = bcrypt.genSaltSync(10)
const PEPPER = 'azxcv034957025lknvz897sadf325h'

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
	blogTitle:{
		type: String,
		required: true,
		unique: true
	},
	blogDescription: String
})

UserSchema.methods.generateHash = async function(password) {
	console.log(SALT)
	console.log(PEPPER)
	let saltNPepper = SALT + PEPPER;
	console.log(saltNPepper)
	return await bcrypt.promise.hash(password, saltNPepper)
}

UserSchema.methods.validatePassword = async function(password) {
	return await bcrypt.promise.compare(password, this.password)
}

UserSchema.pre('save', function (callback) {
	nodeify(async() => {
		if(!this.isModified('password')) return callback()			
		this.password = await this.generateHash(this.password)
	}(), callback)	
})

UserSchema.path('password').validate((pw) => {
	return pw.length >=4 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw)
})

UserSchema.path('username').validate((uname) => {
	return (/[A-Z]/.test(uname) || /[a-z]/.test(uname)) && /[0-9]/.test(uname);
})

module.exports = mongoose.model('User', UserSchema)