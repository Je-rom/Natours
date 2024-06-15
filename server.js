const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app');

dotenv.config({path: './.env'});

const DB = process.env.CONNECTION_STRING;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('DB connection successful!'))
.catch((err) => console.error('DB connection error:', err));

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "a tour must have a name"],
    unique: true,
  },
  price: {
    type: Number,
    default: 4.5,
  },
  rating: {
    type: Number,
    required: [true, "a tour must have a price"]
  }
});

const Tour = mongoose.model("Tour", tourSchema)
const tourDb = new Tour({
  name: "englnd",
  price: 699,
  rating: 4.0
});
tourDb.save().then(doc=>{
  console.log(doc, 'saved')
}).catch(err=>{
  console.log(err,'couldnt save')
});



app.listen(7000, () => {
  console.log('listening on port 7000');
});
