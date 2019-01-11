var Campground = require("../models/campground");
var Comment = require("../models/comment");
// All the middleware

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
  // is user logged in?
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err || !foundCampground){
        console.log(err);
        res.flash("error", "Campground not found");
        res.redirect("/campgrounds");
      } else {
          // Is user the author of campground?
          if(foundCampground.author.id.equals(req.user._id)){
              req.campground = foundCampground;
              next();
          } else {
              res.flash("error", "You don't have permission to do that");
              res.redirect("/campgrounds/" + req.params.id);
          }
      }
    });
  } else {
      req.flash("error", "Sorry, not allowed");
      res.redirect("back");
  }
}


middlewareObj.checkCommentOwnership = function(req, res, next){
  // is user logged in?
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err || !foundComment){
        console.log(err);
        req.flash("error", "Sorry, that comment does not exist.");
        res.redirect("back");
      } else {
          // Is user the author of comment?
          if(foundComment.author.id.equals(req.user._id)){
              req.comment = foundComment;
              next();
          } else {
              req.flash("error", "You don't have permission to do that.");
              res.redirect("back");
          }
      }
    });
  } else {
      req.flash("error", "Sorry, not allowed");
      res.redirect("/campgrounds/" + req.params.id);
  }
}    

// middleware function to check if user is logged in
middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "Please login first");
  res.redirect("/login");
};

module.exports = middlewareObj;