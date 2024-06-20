const mongoose = require('mongoose');
const dotenv = require('dotenv');
process.on('uncaughtException', (err) => {
  console.log('uncaught Exception, shutting down');
  console.log(err);
    process.exit(1);
});


dotenv.config({ path: './.env' });
const app = require('./app');


const DB = process.env.CONNECTION_STRING;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.error('DB connection error:', err));

const port = process.env.PORT || 7000;

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('unhandled rejection, shutting down');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});



//cross-env
//npm install cross-env --save-dev
//console.log(process.env.NODE_ENV)