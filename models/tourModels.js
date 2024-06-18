const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "a tour must have a name"],
      unique: true,
      trim:true
    },
    duration: {
      type: Number,
      required: [true, "a tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "a tour must have a group size"],
    },  
    difficulty: {
      type: String,
      required: [true, "a tour must have a difficulty"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "a tour must have a price"]
    },
    priceDiscount:Number,
    summary:{
      type: String,
      trim: true,
      required: [true, "a tour must have a summary"]
    },
    description:{
      type: String,
      trim:true
    },
    imageCover:{
      type: String,
      required: [true, "tour must have an image cover"]
    },
    images:[String],
    createdAt:{
      type: Date,
      default: Date.now()
    },
    startDates:[Date],
    secretTour:{
      type: Boolean,
      default:false
    }
  });
  
  //model
  const Tour = mongoose.model("Tour", tourSchema)
  //query hook
  tourSchema.pre('find', function(next){
    this.find({secretTour: {$ne: true}})
    next();
  })

  module.exports = Tour;