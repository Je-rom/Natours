const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  const jwtToken = jwt.sign({_id: newUser._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES})
  res.status(201).json({
    status: 'success',
    jwtToken,
    data: {
      user: newUser,
    },
  });
});

exports.signin = catchAsync(async(req, res, next)=>{
  
})
