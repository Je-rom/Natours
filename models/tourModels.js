const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "a tour must have a name"],
      unique: true,
      trim:true,
      maxLength: [40, 'a tour should have less or 40 characters'],
      minlength: [5, 'a tour should have more than 5 characters']
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
      enum: {
        values: ['easy', 'meduim', 'difficult'],
        message: 'level has to be easy, meduim or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'ratings cannot be less than 1.0'],
      max: [5, 'ratings cannot be more than 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "a tour must have a price"]
    },
    priceDiscount:{
      type: Number,
      validate: {
        validator: function(val){
          return val < this.price //price discount should be less than the price, the this keyword wont work on update tour api only to create
        },
        message: '{VALUE} should not be more than the price amount'
      }
      },
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
  });

  module.exports = Tour;