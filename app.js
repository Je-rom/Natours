const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');

const app = express();

//middleware
app.use(morgan('dev'));

app.use(express.json()); //parses JSON request bodies and attaches the parsed data to req.body.

//for logging, authentication checks, setting headers, or any other custom logic, it applies to all routes/request
app.use((req, res, next) => {
  console.log('sup');
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'hello bro', app: 'Natours' });
});

app.use('/api/v1/users', userRouter); //middleware
app.use('/api/v1/tours', tourRouter); //middleware

module.exports = app;
