const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const {promisify} = require('util');


const signToken = id =>{
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES})
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  const jwtToken = signToken(newUser.id)
  res.status(201).json({
    status: 'success',
    jwtToken,
    data: {
      user: newUser,
    },
  });
});

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

  const jwtToken = signToken(user.id)
  res.status(200).json({
    status: 'success',
    message: 'successfully logged in',
    data:{
      user: user,
      token: jwtToken,
    }
  })
});

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
  //to the next route handler, grant access
  next();
})
