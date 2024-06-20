const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please input a name'],
    minLength: [5, 'User name cannot be less than 5 characters'],
    maxLength: [50, 'User name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please input your email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please input a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please input your password'],
    minLength: [8, 'Password must be at least 8 characters'],
  },
  confirmPassowrd: {
    type: String,
    required: [true, 'Confirm Password is required'],
    validate: {
      validator: function (e) {
        //only works when we create a new obkect or save;
        return e === this.password;
      },
      message: 'Confirm password does not match with the password',
    },
  },
  photo: String,
});

//hash password(document middleware)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassowrd = undefined; //required input not required to persist to the db
  next();
});

//create model
const User = mongoose.model('User', userSchema);



module.exports = User;
