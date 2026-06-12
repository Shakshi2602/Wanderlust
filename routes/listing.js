const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isloggedIn, isOwner, valiateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isloggedIn, valiateListing, wrapAsync(listingController.createListing));

//NEW ROUTE
router.get("/new", isloggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isloggedIn,
    isOwner,
    valiateListing,
    wrapAsync(listingController.updateListing),
  )
  .delete(isloggedIn, isOwner, wrapAsync(listingController.destroyListing));

//EDIT ROUTE
router.get(
  "/:id/edit",
  isloggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

module.exports = router;
