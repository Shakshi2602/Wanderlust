const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  valiateReview,
  isloggedIn,
  isReviewAuthor,
} = require("../middleware.js");

const reviewController = require("../controllers/review.js");

//REVIEW ROUTE(POST ROUTE)
router.post(
  "/",
  isloggedIn,
  valiateReview,
  wrapAsync(reviewController.createReview),
);

//REVIEW ROUTE(DELTE ROUTE)
router.delete(
  "/:reviewId",
  isloggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview),
);

module.exports = router;
