const express = require('express');
const Tour = require('./../models/tourModels')

exports.getAllTours = async (req, res) => {
  try {
    const allTours = await Tour.find();
    res.status(200).json({
      status: "success",
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

