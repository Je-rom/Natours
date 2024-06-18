const express = require('express');
const Tour = require('./../models/tourModels')
const apiFeatures = require('./../utils/apiFeatures');


exports.getAllTours = async (req, res) => {
  try {
    //execute query
    const features = new apiFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
    const allTours = await features.query; 
  
    res.status(200).json({
      status: "success",
      results: allTours.length,
      message: "Fetched all tours",
      data: {
        allTours
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: 'Could not find tours'
    })
  }
};

exports.getTourById = async (req, res) => {
  try {
    const getToursById = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      message: `found tour`,
      data: getToursById
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: 'Tour not found'
    })
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)
    res.status(201).json({
      status: "success",
      message: "successfully created tour",
      data: {
        newTour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error
    })
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: 'success',
      message: 'successfully updated tour',
      data: {
        updateTour
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error
    })
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const deletTour = await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success',
      message: 'successfully deleted tour',
      data: {
        deletTour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error
    }) 
  }
};

exports.getCheapTours=(req, res, next)=>{
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

exports.getTourStats = async (req, res)=>{
  try {
    const stats = await Tour.aggregate([
    {
      $match: {ratingsAverage:  {$gte: 4.5}}
    },
    {
      $group: 
      {
        _id: {$toUpper: '$difficulty'},
        numTours: {$sum: 1},
        numRatings: {$sum : '$ratingsQuantity'},
        avgRating: {$avg: '$ratingsAverage'},
        avgPrice: {$avg: '$price'},
        minPrice: {$min: '$price'},
        maxPrice: {$max: '$price'}
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    message: 'successfully fetched tour',
    data: {
      stats
    }
  });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error
    }) 
  }
};

exports.getMontlyPlan = async (req, res)=>{
try {
  const year = req.params.year * 1
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: 
      {
        startDates: {$gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`)},
      }
    },
    {
      $group: 
      {
        _id: {$month: '$startDates'},
        numTourStats: {$sum: 1},
        tours: { $push: '$name'}
      }
    },
    {
      $addFields:{month : '$_id'}
    },
    {
      $project: {_id: 0}
    }
  ]);
    res.status(200).json({
    status: 'success',
    message: 'successfully fetched tour',
    result: Tour.length,
    data: {
      plan
    }
  });
} catch (error) {
  res.status(400).json({
      status: "failed",
      message: error
    }) 
}
}


   // if (allTours.length === 0) {
    //   return res.status(404).json({
    //     status: "fail",
    //     message: "No tours found matching the query parameters"
    //   });
    // }