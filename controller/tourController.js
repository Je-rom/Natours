const express = require('express');
const Tour = require('./../models/tourModels')

exports.getAllTours = async (req, res) => {
  try {
    //build query
    //filter
    const queryObj = {...req.query} //creates a copy of the query parameters in the url
    const excludeFields = ['page', 'sort', 'limit', 'fields']
    excludeFields.forEach(e=> delete queryObj[e])

    let query = Tour.find(queryObj)//creates a mongoose query object, find all documents in the tour collection that match the query parameters
    
    //sort
      if(req.query.sort){
        query = query.sort(req.query.sort)
      }
  
    const allTours = await query; //execute query
    //response
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

   // if (allTours.length === 0) {
    //   return res.status(404).json({
    //     status: "fail",
    //     message: "No tours found matching the query parameters"
    //   });
    // }