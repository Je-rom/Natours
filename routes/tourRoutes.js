const express = require('express');
const tourController = require('./../controller/tourController');
const authController = require('./../controller/authController')

//mounted router
const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.getCheapTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMontlyPlan);
router
  .route('/')
  .get(authController.protected, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
//params middleware
// router.param('id', tourController.chekId);
