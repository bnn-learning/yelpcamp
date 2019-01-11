var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    
var commentRoutes     = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelp_camp_v12", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the db

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Once again Rusty wins cutest dog!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware to add user to res.locals which somehow adds it to every template
// this is used in navbar in header to switch login + signup to username + logout
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// connect app to all routes using express.router
// !!!!! REQUIRES changing routes in routename.js files to shorter stub
// the optional strings "/", "/campgrounds", ..., cause app to add the string to all routes
app.use("/", indexRoutes); // prefixes "/" 
app.use("/campgrounds", campgroundRoutes);// prefixes "/campgrounds" 

// !!!!! REQUIRES option added to require statement
app.use("/campgrounds/:id/comments", commentRoutes); // prefixes "/campgrounds/:id/comments" to routes

// =========================================
//              ROUTES
//=========================================
//  Routes are in modules in routes folder

// start node.js listener
app.listen(process.env.PORT, process.env.IP, function(){
  console.log("yelpcamp started");
});
