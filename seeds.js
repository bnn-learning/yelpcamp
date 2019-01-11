// remove all objects from db and add some new ones
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment     = require("./models/comment");

var data = [
    {   name: "Misty Mountain",
        image: "https://www.outsideonline.com/sites/default/files/styles/img_850-width_flex-height/public/2018/09/17/big-agnes-big-house-deluxe.jpg",
        description: "Hey, what kinda party is this? There's no booze and only one hooker. Is the Space Pope reptilian!? The key to victory is discipline, and that means a well made bed. You will practice until you can make your bed in your sleep. I guess because my parents keep telling me to be more ladylike. As though! For the last time, I don't like lilacs! Your 'first' wife was the one who liked lilacs! You won't have time for sleeping, soldier, not with all the bed making you'll be doing."
    },
    {   name: "Camp Betz",
        image: "https://www.outsideonline.com/sites/default/files/styles/img_850-width_flex-height/public/2018/09/17/nemo-wagontop-four-person.jpg",
        description: "Whoa a real live robot; or is that some kind of cheesy New Year's costume? Eeeee! You'll have all the Slurm you can drink when you're partying with Slurms McKenzie! I've been there. My folks were always on me to groom myself and wear underpants. What am I, the pope?"
    },
    {   name: "Outside Campground",
        image: "https://www.outsideonline.com/sites/default/files/styles/img_850-width_flex-height/public/2018/09/17/therm-a-rest-tranquility-6.jpg",
        description: "I don't 'need' to drink. I can quit anytime I want! You guys go on without me! I'm going to go… look for more stuff to steal! Oh, I don't have time for this. I have to go and buy a single piece of fruit with a coupon and then return it, making people wait behind me while I complain."
    }
];

function seedDB(){
    
    // remove all campgrounds
    Campground.remove({}, function(err){
        //if(err){
        //    console.log(err);
        //} else {
        //    console.log("removed campgrounds");
        //}
        //// add the seed campgrounds from the data array
        //data.forEach(function(seed){
        //     Campground.create(seed, function(err, campground){
        //         if(err){
        //             console.log(err);
        //         } else {
        //             console.log("added a campground");
        //             // create comment
        //             Comment.create(
        //                 {
        //                     text  : "This place is great, but I wish there was internet",
        //                     author: "Homer"
        //                }, function(err, comment){
        //                    if(err){
        //                        console.log(err);
        //                    } else {
        //                        campground.comments.push(comment);
        //                        campground.save();
        //                        console.log("Created new comment");
        //                    }
        //                }
        //                )
        //         }
        //     });
        //});
    });
}

module.exports = seedDB;