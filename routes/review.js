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

// router.post("/", async (req, res) => {
//   let listing = await Listing.findById(req.params.id);
//   let newReview = new Review(req.body.review);
//   listing.reviews.push(newReview);
//   await newReview.save();
//   await listing.save();
//   req.flash("success", "New Review Created!");
//   res.redirect(`/listings/${listing._id}`);

//REVIEW ROUTE(POST ROUTE)
router.post("/", isloggedIn, valiateReview, async (req, res) => {
  // console.log(req.params);

  let listing = await Listing.findById(req.params.id);
  // console.log(listing);

  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "Review created successfully!");

  res.redirect(`/listings/${listing._id}`);
});

// }),
//REVIEW ROUTE(DELTE ROUTE)
router.delete(
  "/:reviewId",
  isloggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
