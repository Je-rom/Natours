const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const {promisify} = require('util');
const sendMail = require('./../utils/email');
const crypto = require('crypto')



const signToken = id =>{
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES})
}

const createSendToken = (user, statusCode, res)=>{
  const jwtToken = signToken(user.id)
  res.status(statusCode).json({
    status: 'success',
    jwtToken,
    data: {
      user
    },
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role
  });
  createSendToken(newUser, 200, res);
});

//login
exports.signin = catchAsync(async(req, res, next)=>{
  //check if email or password exist or is avaiable
  const {email, password} = req.body
  if(!email || !password){
    return next(new AppError('Please provide your Email and Password', 400))
  }

  //check if user exist(email) and if the password is correct
  const user = await User.findOne({email}).select('+password') //query(document of a collection, then we can use the instance method on the next line)
  if(!user || !(await user.correctPassword(password, user.password))){
    return next(new AppError('Invalid Email or Password', 401))
  }

  user.password = undefined;
  createSendToken(user, 200, res);
});

//protect tour routes
exports.protected = catchAsync( async(req, res, next)=>{
  //check if the token is available
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1]
  }

  if(!token){
    return next((new AppError('You are not logged in, please login', 401)));
  }

  //verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  //check if the verified user with the token still exists
  const verifiedUser = await User.findById(decoded.id)
  if(!verifiedUser){
    return next(new AppError('The user belonging to this token, no longer exists', 401))
  }

  //check if user changed password after the token was issued
  if (verifiedUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }

  req.user = verifiedUser;

  //to the next route handler, grant access
  next();
});

//check user role
exports.userRole = (...role)=>{ //wrapper function
  return (req, res, next)=>{
    if(!role.includes(req.user.role)){
      return next(new AppError('You dont have permission to perform this action, only Admins', 403))
    }
    next();
  }
};


//forgot password
exports.forgotPassword = catchAsync( async (req, res, next)=>{
  //get user from body
  const user = await User.findOne({email: req.body.email})
  if(!user){
    return next(new AppError('User does not exist', 404))
  }

  //generate token
  const resetToken = user.createPasswordResetToken()
  await user.save({validateBeforeSave: false})

  //send to user email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`
  const message =`Forgot password?, Make a request with your new password and confirm password to: ${resetURL}.\n If you didnt make this request, please ignore;`

  try {
    await sendMail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
});


//reset password
exports.resetPassword = catchAsync( async (req, res, next)=>{
  //get the user based on the token
  const userToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

  const user = await User.findOne({passwordResetToken: userToken, passwordResetExpires: {$gt: Date.now()}})

  //check if token has expired
  if(!user){
    return next(new AppError('Reset Token has expired or it is invalid, try again', 400))
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();


  //log user in
  createSendToken(user, 201, res);
});

//update authenticated user password
exports.updatePassword = catchAsync(async(req, res, next)=>{
  //get user
  const user = await User.findById(req.user.id).select('+password')
  if(!user){
    return next(new AppError('User not logged in, please login', 400))
  }

  //check if password is correct
  const {currentPassword} = req.body
  const checkPassword = await user.correctPassword(currentPassword, user.password)
  if(!checkPassword){
    return next(new AppError('Your current password is wrong', 401))
  }

  //update password
  user.password = req.body.password
  user.confirmPassword = req.body.confirmPassword
  await user.save()

  //login user
  createSendToken(user, 200, res);
});
