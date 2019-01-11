// use express Router to handle all routes instead of app
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//===========================================
//        CAMPGROUND ROUTES
//=============================================

// display all campgrounds
router.get("/", function(req, res){
  // Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
       res.render("campgrounds/campgrounds", {campgrounds: allCampgrounds, currentUser: req.user});
    }
  });
});

// NEW Route 
// display form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
  //show new campground form
  res.render("campgrounds/new");
});

// CREATE Route
// add new campground to list and display all campgrounds
// associate author with campground and save
// only allow registered users to create campgrounds

router.post("/", middleware.isLoggedIn, function(req, res){
  // get new campground name and image from req

  var name = req.body.campName;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCamp = { name: name, price: price, image: image, description: desc, author: author };

  // create new campground and save to db
  Campground.create(newCamp, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      // redirect back to the campgrounds page
      console.log(newlyCreated);
      res.redirect("/campgrounds");
    }
  });
});

// SHOW Route
// display all the info for a single campground
router.get("/:id", function(req, res){
  
  // find the campground in the DB
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){ 
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

// EDIT Campground route - display edit form to author
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
      res.render("campgrounds/edit", {campground: req.campground });
});

// UPDATE Campground route - update campground in DB
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  // find and update correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if(err){
      req.flash("error", "Error updating campground");
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground information updated");
      res.redirect("/campgrounds/" + req.params.id); // show page
    }
  });
});

// DESTROY ROUTE - delete campground from DB
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground deleted");
      res.redirect("/campgrounds");
    }
  });
});

// export express.router
module.exports = router;
