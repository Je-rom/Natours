const express = require('express');
const Tour = require('./../models/tourModels');
const apiFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllTours = catchAsync(async (req, res, next) => {
  //execute query
  const features = new apiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const allTours = await features.query;
  res.status(200).json({
    status: 'success',
    results: allTours.length,
    message: 'Fetched all tours',
    data: {
      allTours,
    },
  });
});

exports.getTourById = catchAsync(async (req, res, next) => {
  const getToursById = await Tour.findById(req.params.id);
  if (!getToursById) {
    return next(new AppError('Invalid Id, Tour not found with that Id', 404));
  }
  res.status(200).json({
    status: 'success',
    message: `found tour`,
    data: getToursById,
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    message: 'successfully created tour',
    data: {
      newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updateTour) {
    return next(new AppError('Invalid tour Id', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'successfully updated tour',
    data: {
      updateTour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const deletTour = await Tour.findByIdAndDelete(req.params.id);
  if (!deletTour) {
    return next(new AppError('Invalid tour Id', 404));
  }
  res.status(204).json({
    status: 'success',
    message: 'successfully deleted tour',
    data: {
      deletTour,
    },
  });
});

//middleware
exports.getCheapTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    message: 'successfully fetched tour',
    data: {
      stats,
    },
  });
});

exports.getMontlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStats: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    message: 'successfully fetched tour',
    result: Tour.length,
    data: {
      plan,
    },
  });
});
