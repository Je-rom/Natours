const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please input a name'],
    minLength: [5, 'Name cannot be less than 5 characters'],
    maxLength: [50, 'Name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please input your email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please input a valid email'],
  },
  role:{
    type: String,
    enum:['user','admin', 'lead-guide'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please input your password'],
    minLength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'Confirm Password is required'],
    validate: {
      validator: function (e) {
        //only works when we create a new object or save;
        return e === this.password;
      },
      message: 'Confirm password does not match with the password',
    },
  },
  photo: String,
  passwordChangedAt: Date,
});

//hash password(document middleware)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined; //required input not required to persist to the db
  next();
});

//check if user password is correct (instance method)
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword, userPassword)
}

//check if password was changed after the token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  //not changed
  return false;
};

//create model
const User = mongoose.model('User', userSchema);



module.exports = User;
