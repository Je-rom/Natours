const express = require('express');
const tourController = require('./../controller/tourController');

//mounted router
const router = express.Router();
//params middleware
router.param('id', tourController.chekId);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour); //chaining middlewares
router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
