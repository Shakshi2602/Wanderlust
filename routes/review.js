const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const valiateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(errMsg, 400);
  } else {
    next();
  }
};

// router.post("/", async (req, res) => {
//   let listing = await Listing.findById(req.params.id);
//   let newReview = new Review(req.body.review);
//   listing.reviews.push(newReview);
//   await newReview.save();
//   await listing.save();
//   req.flash("success", "New Review Created!");
//   res.redirect(`/listings/${listing._id}`);

//REVIEW ROUTE(POST ROUTE)
router.post("/", async (req, res) => {
  // console.log(req.params);

  let listing = await Listing.findById(req.params.id);
  // console.log(listing);

  let newReview = new Review(req.body.review);

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
