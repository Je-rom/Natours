const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app');

dotenv.config({path: './.env'});
console.log(process.env.NODE_ENV)

const DB = process.env.CONNECTION_STRING;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('DB connection successful!'))
.catch((err) => console.error('DB connection error:', err));

app.listen(7000, () => {
  console.log('listening on port 7000');
});


  // start:prod: "NODE_ENV=production nodemon server.js"