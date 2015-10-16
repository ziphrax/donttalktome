var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	name: String,
	firstName: String,
	lastName: String,
	EmailAddress: String,
	DateOfBirth: Date,
	status: String,
	created: Date,
	updated: Date,
	owner: String,
	address : String,
	phone_tel: String,
	phone_mob: String,
	phone_work: String,
	admin: Boolean,
	password: String,
	location: { type: {}, index: '2dsphere', sparse: true }
},{strict: false})
	.index({ location: '2d' })
	.pre('save', function (next) {
	  var value = this.get('location');

	  if (value === null) return next();
	  if (value === undefined) return next();
	  if (!Array.isArray(value)) return next(new Error('Coordinates must be an array'));
	  if (value.length === 0) return that.set(path, undefined);
	  if (value.length !== 2) return next(new Error('Coordinates should be of length 2'))

	  next();
});

module.exports = mongoose.model('User',UserSchema);
