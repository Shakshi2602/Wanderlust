const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const listingController = require("../controllers/listings.js");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

(router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isloggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing),
  ),
  //NEW ROUTE
  router.get("/new", isloggedIn, listingController.renderNewForm),
  router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
      isloggedIn,
      isOwner,
      upload.single("listing[image]"),
      validateListing,
      wrapAsync(listingController.updateListing),
    )
    .delete(isloggedIn, isOwner, wrapAsync(listingController.destroyListing)),
  //EDIT ROUTE
  router.get(
    "/:id/edit",
    isloggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm),
  ),
  (module.exports = router));
