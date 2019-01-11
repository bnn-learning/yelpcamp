
var express = require("express");
var router = express.Router({mergeParams: true}); // !!!!mergeParams required to insert id into route string
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware")

//============================================================
//            COMMENTS ROUTES
//============================================================
// use express Router to handle all routes instead of app
// NOTE: all routes get a string prefix to the url in app. 
//See app.js file -> app.use("/campgrounds/:id/comments", commentRoutes);
// !!!! must set var router = express.Router({mergeParams: true})

// NEW route for Comments
// display form for new comment
// prevent comment unless user is logged in

router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("comments/new",{campground_id: req.params.id, comment: req.comment});
});

// CREATE route for COMMENTS
// add new comment to a campground
// check user login with isLoggedIn
router.post("/", middleware.isLoggedIn, function(req, res){
  // lookup campground using ID
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
        Comment.create(req.body.comment, function(err, comment){
          if(err) {
            req.flash("error", "Error creating comment");
            console.log(err);
          } else {
            // add username and ID to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            // save comment to db
            comment.save();
            // add comment to campground and save campground to db
            campground.comments.push(comment);
            campground.save();
            console.log(comment);
            // show campground
            req.flash("success", "New comment saved");
            res.redirect("/campgrounds/" + campground._id);
          }
      });
    }
  });
});

// EDIT Route for Comments 
// show edit form for Comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
      Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
      });
});

// UPDATE Route for Comments
// take user input from Comment edit form and update comment in DB
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment ){
    if(err) {
      res.redirect("back");
    }   else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DESTROY Route for Comments
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    } else {
      req.flash("success", "Comment Deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// export express router with all comments routes
module.exports = router;