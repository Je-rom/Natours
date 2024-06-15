const mongoose = require('mongoose')
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

  module.exports = Tour;