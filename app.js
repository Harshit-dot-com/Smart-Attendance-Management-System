const express = require("express");
require('dotenv').config();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const localStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const fs = require("fs");
const { spawn } = require("child_process");

var database = require('./database');
var flash = require('connect-flash');

function deg2rad(deg) {
  return deg * (Math.PI/180)
}





app.use(session({
  secret : 'ourlittlesecret',
  cookie : {maxAge : 60000},
  saveUninitialized : false,
  resave : false
}));
app.use(flash());





app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://0.0.0.0:27017/samDB",function(err){
  if(err){
    console.log("p");
  }
  else{
    console.log("s");
  }
})

const userSchema = new mongoose.Schema({
  name:{
      type: String,
      required: true
  },
  CollegeId:{
    type:Number,
    required: true,
    unique: true
  },

  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  googleId: String,
  position: {
    type: String,
    required: true
  }
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());



passport.serializeUser(function(user, done) {

  done(null, user.id);

});



passport.deserializeUser(function(id, done) {

  User.findById(id, function(err, user) {

    done(err, user);

  });

});
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/SAM",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({
     username: profile.id,
     googleId: profile.id
   }, function(err, user) {
     return cb(err, user);
   });
 }
));
app.get("/",function(req,res){
  res.redirect("/login")
})
app.get("/auth/google",
  passport.authenticate("google",{scope:['profile']})
);
app.get("/auth/google/SAM",
passport.authenticate('google',{failureRedirect:'/login'}),
function(req,res){
  res.redirect('/home-std');
});
app.get("/home-std",function(req,res){

  if(req.isAuthenticated()){
    res.render("home-std");
  }
    else{
      res.redirect("/login");
    }
  });

  app.get('/home-teacher',function(req,res){
    if(req.isAuthenticated()){
      res.render("teacher");
    }
      else{
        res.redirect("/login");
      }

  });

app.get("/view", function(request, response, next){
//select COLUMN_NAME from INFORMATION_SCHEMA.COLUMNS where table_name = 'sample_data';

    	var query = `SELECT * FROM bt${x}`

    	database.query(query, function(error, data){

    		if(error)
    		{
    			throw error;
    		}
    		else
    		{
          data.forEach(function(data1){
            for(var i = 1;i<=30;i++){


            }
          })

    			response.render('sample_data', {Roll_no:x,title:'SAMS', action:'list', sampleData:data, message:request.flash('success')});
    		}

    	});

    });
app.get('/view2',function(req,res){
  res.render('view2');
})
app.post('/view2',function(req,res){
  var y = req.body.CollegeId;
  var query = `SELECT * FROM bt${y}`

  database.query(query, function(error, data){

    if(error)
    {
      throw error;
    }
    else
    {
      // data.forEach(function(data1){
      //   for(var i = 1;i<=30;i++){
      //
      //
      //   }
      // })

      res.render('sample_data', {Roll_no:y, title:'SAMS', action:'list', sampleData:data, message:req.flash('success')});
    }

  });
});
let k = 0;
app.get("/host",function(req,res){
  k = 1;
  setTimeout(function(){
    k = 0;
  },60000);
  res.redirect("/home-teacher");
})
let data = 0;
app.post("/api",function(req,res){
  data = req.body;
  console.log(data.lat);
});

let data2;

app.post("/api2",function(req,res){
  data2 = req.body;
});

app.get("/take",function(req,res){
      console.log(data.lon);
      let lat1 = data.lat;
      let lat2 = data2.lat;
      let lon1 = data.lon;
      let lon2 = data2.lon;
      var R = 6371;
      var dLat = deg2rad(lat2-lat1);
      var dLon = deg2rad(lon2-lon1);
      var f =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
        var c = 2 * Math.atan2(Math.sqrt(f), Math.sqrt(1-f));
        var d = R * c;
        var e = Math.round(d*1000);
        var dataToSend;
        let data4;
        if(k==1){
        const python = spawn("python", ["Recognizer.py", 0]);
        python.stdout.on("data", (data) => {
          data4 = `${data}`;
          console.error(`stderr: ${data}`);
        });

        python.on("exit", (code) => {
          console.log(`child process exited with ${code}, ${dataToSend}`);
        });
      }
        setTimeout(function(){
          console.log(data4);
          console.log(k);
          console.log(e);
          console.log(req.user.CollegeId);
          if(e<30 && k===1 && data4==req.user.CollegeId){
            var g = req.user.CollegeId;
            var query = `UPDATE bt${g} SET day_1='P' WHERE subject='SE';`
            database.query(query,function(error,data){
              if(error){
                throw error
              }
              else{
                console.log("go");
              }
            })
          }
          res.redirect('/home-std');
        },25000);

})


app.get("/login",function(req,res){
  res.render('index');
});
app.get("/forgot-pass",function(req,res){
  res.render("pass-reset");
});
// app.post("/forgot-pass",function(req,res){
//   username: req.body.username
//   User.findOne({username},(err,user){
//     if(err || !user){
//       console.log("error");
//     }
//   }
//
// })
app.get("/reset-confirm",function(req,res){
  res.render("reset-confirm");
})
app.get("/logout",function(req,res){
  req.logout(function(err){
    if(err){
      console.log("fail");
    }
    else{
      res.redirect("/login");
    }
  });

})

app.post("/register",function(req,res){
  const a1 = new User({
    name : req.body.name,
    username:req.body.username,
    position:req.body.position,
    CollegeId: req.body.CollegeId
  });

console.log(x);
User.register(a1,req.body.password,function(err,user){
  if(err){
    console.log(err);
  }
  else{

    if(req.body.position==='student'){
    let a = req.body.CollegeId;
var query = `create table bt${a} (subject VARCHAR(100) PRIMARY KEY,day_1 varchar(2) DEFAULT '-', day_2 varchar(2) DEFAULT '-',day_3 varchar(2) DEFAULT '-',day_4 varchar(2) DEFAULT '-',day_5 varchar(2) DEFAULT '-',day_6 varchar(2) DEFAULT '-',day_7 varchar(2) DEFAULT '-',day_8 varchar(2) DEFAULT '-', day_9 varchar(2) DEFAULT '-', day_10 varchar(2) DEFAULT '-',day_11 varchar(2) DEFAULT '-',day_12 varchar(2) DEFAULT '-',day_13 varchar(2) DEFAULT '-',day_14 varchar(2) DEFAULT '-', day_15 varchar(2) DEFAULT '-', day_16 varchar(2) DEFAULT '-', day_17 varchar(2) DEFAULT '-', day_18 varchar(2) DEFAULT '-', day_19 varchar(2) DEFAULT '-', day_20 varchar(2) DEFAULT '-', day_21 varchar(2) DEFAULT '-', day_22 varchar(2) DEFAULT '-', day_23 varchar(2) DEFAULT '-', day_24 varchar(2) DEFAULT '-', day_25 varchar(2) DEFAULT '-', day_26 varchar(2) DEFAULT '-', day_27 varchar(2) DEFAULT '-', day_28 varchar(2) DEFAULT '-', day_29 varchar(2) DEFAULT '-', day_30 varchar(2) DEFAULT '-');`;


   database.query(query,function(error,data){
   if(error){
   throw error;
   }
   else{
   console.log("lfg");
   }
 });
 var query1 =`insert into bt${a} (subject) values ('SE')`
 var query2 =`insert into bt${a} (subject) values ('SC')`
 var query3 =`insert into bt${a} (subject) values ('WMN')`
 var query4 =`insert into bt${a} (subject) values ('TOC')`
 database.query(query1,function(error,data){
 if(error){
 throw error;
 }
 else{
 console.log("lfg");
 }
 });
 database.query(query2,function(error,data){
 if(error){
 throw error;
 }
 else{
 console.log("lfg");
 }
});
database.query(query3,function(error,data){
if(error){
throw error;
}
else{
console.log("lfg");
}
});
database.query(query4,function(error,data){
if(error){
throw error;
}
else{
console.log("lfg");
}
});
}
    passport.authenticate("local")(req,res,function(){
      if(req.body.position==='student'){
      var dataToSend;
      const python = spawn("python", ["Generate_Dataset.py",req.body.name, req.body.CollegeId]);
      python.stdout.on("data", (data) => {
        console.log(`${data}`);
      });

      python.on("exit", (code) => {
        console.log(`child process exited with ${code}, ${dataToSend}`);
      });
    }
      res.redirect("/login");
    })
  }
});

});
let x = 1;
app.post("/login",function(req,res){
const user = new User({
  position: req.body.position,
  username: req.body.username,
  password: req.body.password

});

req.login(user, function(err){
  console.log(user);
  if(err){
    console.log(err);
  }
  else{
    passport.authenticate("local")(req,res,function(){
      x = req.user.CollegeId;

      if(req.user.position==="student" && req.body.position==="student"){
      res.redirect("/home-std");
    }
    if(req.user.position==="teacher" && req.body.position==="teacher"){
      res.redirect("/home-teacher");
    }
    })
  }
})
});


app.listen(3000,function(){
  console.log("Success!");
})
