const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

//Each router only has access to its params, set mergeParams to true to allow route nesting
const router = express.Router({ mergeParams: true }); //Mouting router to url
// router.param('id', tourController.checkID);
//Create a check Body middleware
//Check if body contains the name and the price property
//if not send back 404

router.use(authController.protect);
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourAndUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
