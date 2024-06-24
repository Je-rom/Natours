const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const globalErrorHandler = require('./controller/errorController')
const AppError = require ('./utils/appError');
const rateLimit = require('express-rate-limit');
const helmet = require ('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')


const app = express();
app.use(express.static("public"))

//security http headers
app.use(helmet());

// rate limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP address, please try again in an hour'
})

app.use('/api', limiter)

//middlewares
app.use(morgan('dev'));

app.use(express.json()); //parses JSON request bodies and attaches the parsed data to req.body.
//data sanitization against noSql query injection
app.use(mongoSanitize());
//sanitize against xss- clean user input from html code
app.use(xss())

//for logging, authentication checks, setting headers, or any other custom logic, it applies to all routes/request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'hello bro', app: 'Natours' });
});

app.use('/api/v1/users', userRouter); //user middleware
app.use('/api/v1/tours', tourRouter); //tour middleware

//middle to handle unhandled routes
app.all("*", (req, res, next)=>{
  next(new AppError(`can't find ${req.originalUrl} in the server`, 404));
});

//global error handler
app.use(globalErrorHandler);
module.exports = app;
