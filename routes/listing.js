const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isloggedIn, isOwner, valiateListing } = require("../middleware.js");

//INDEX ROUTE
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }),
);

//NEW ROUTE
router.get("/new", isloggedIn, (req, res) => {
  console.log(req.user);
  res.render("listings/new.ejs");
});

//SHOW ROUTE
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing not found!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }),
);

//CREATE ROUTE
router.post(
  "/",
  isloggedIn,
  valiateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  }),
);

//EDIT ROUTE
router.get(
  "/:id/edit",
  isloggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }),
);

//UPDATE ROUTE
router.put(
  "/:id",
  isloggedIn,
  isOwner,
  valiateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  }),
);

//DELETE ROUTE
router.delete(
  "/:id",
  isloggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  }),
);

module.exports = router;
