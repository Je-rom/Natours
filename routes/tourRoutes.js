const express = require('express');
const tourController = require('./../controller/tourController');
const authController = require('./../controller/authController')

//mounted router
const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.getCheapTours, tourController.getAllTours);

router.route('/tour-stats').get(authController.protected, tourController.getTourStats);
router.route('/monthly-plan/:year').get(authController.protected, tourController.getMontlyPlan);
router
  .route('/')
  .get(authController.protected, tourController.getAllTours)
  .post(authController.protected, tourController.createTour);
router
  .route('/:id')
  .get(authController.protected, tourController.getTourById)
  .patch(authController.protected,tourController.updateTour)
  .delete(authController.protected,authController.userRole('admin', 'lead-guide'),tourController.deleteTour);

module.exports = router;
//params middleware
// router.param('id', tourController.chekId);
