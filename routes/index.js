// use express Router to handle all routes instead of app
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//=======================================
// root route
// Display Landing Page

router.get("/", function(req, res){
  res.render("landing");
});

//======================================================
// AUTH ROUTES
//================================

// display register form
router.get("/register", function(req, res) {
    res.render("register");
});

// sign up new user from register form
router.post("/register", function(req, res){
  // create new user from form data
  var newUser = new User({username: req.body.username});
  // create new user with username and hashed password in DB
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    // login new user and send to campgrounds page
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Thank you for registering " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

// display login form route
router.get("/login", function(req, res){
  res.render("login");
});

// handle login logic
// use passport authenticator to check username and password
router.post("/login", passport.authenticate("local",
    {
      successRedirect: "/campgrounds",
      failureRedirect: "/login"
    }), function(req, res){
});

// logout route using passport
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "You are logged out");
  res.redirect("/campgrounds");
});

// export express router with Auth Routes 
module.exports = router;
// export isLoggedIn middleware
