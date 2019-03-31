var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Geocodio = require('geocodio');
var config = {
    api_key: '131b00b50af7b9705d0bdc3bb10670aad05c90c'
};

var geocodio = new Geocodio(config);

mongoose.connect('mongodb+srv://bizy:bizylife@bizlife-e3myd.mongodb.net/test?retryWrites=true/bizylife', { useNewUrlParser: true }, function (error) {
    if (error) {
        console.log(error);
    }
});

//honey: 10, name: username, password: unsecure password, location: place person lives, money: none, tasks: array
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: String,
  password: String,
  location: String,
  coords:{
    x: Number,
    y: Number
  },
  money: Number,
  honey: Number,
  tasks: [{
    progress: {type:String, default:"new"},
    money: Number,
    honey: Number,
    text: String
  }]
});
const User = mongoose.model('UserSchema', UserSchema, 'users');

//honey, money, location
const TaskSchema = new Schema({
  money: Number,
  honey: Number,
  location: String
});
const Task = mongoose.model('TaskSchema', TaskSchema, 'tasks');

//get random integer from 0 to 1 less than inputted integer
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//maintains all users in memory
var users = {
  coords:[

  ]
};

var a = 0;
User.find({},function (err, docs) {
  for(var i in docs){
    users.coords[a] = [docs[i].toObject()._id, docs[i].toObject().coords.x, docs[i].toObject().coords.y];
    console.log(users.coords[a]) 
    a++;
  } 
});














/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Signup/signup', { title: 'Express' });
});

/* POST map page */
router.post('/submit', function(req, res, next) {
  
  console.log(req.body.name)
  //39.9496428, -75.59349399999999
  let xCoord = "39." + getRandomInt(99999999999)
  let yCoord = "-75." + getRandomInt(99999999999)


  User.findOne({name: req.body.name}, function (err, user) {
    if (err) return console.error(err);

    //add error handling to not add already existing users
    if(user){
      console.log("user already exists")
    }else{
      var newUser = new User({
        name: req.body.name,
        password: req.body.password,
        location: req.body.location,
        coords:{
          x: parseFloat(xCoord),
          y: parseFloat(yCoord)
        },
        money: 0,
        honey: 10,
        tasks: []
      })
      newUser.save(function(err, docs){
        
      });
      console.log("user saved")
      
      
    }

  });

  res.render('Map/map', { 
    name: req.body.name, 
    location: req.body.location,
    introHidden: true,
    coords:{
      x: parseFloat(xCoord),
      y: parseFloat(yCoord),
    },
    money: 0,
    honey: 10
  });
});

router.get('/submit', function(req, res, next) {

})




/* display all users as dots */
router.get('/users', function(req, res){
  //keep users stored in memory
  res.json(users);
});

/* displays individual users stats */
router.get('/user/:name', function(req, res){
  console.log(req)
  
  User.findById(req.params.name, function(er, doc){
      res.json(doc)
  })
});




/* POST tasks page. */
router.post('/tasks', function(req, res, next) {
  console.log(req.body.id)
  User.find({name:req.body.id}, function(er, docs){
    res.render('Task Board/tasks', { documents:docs, name:req.body.id });
  })
  
});


/* GETs all tasks for page. */
router.get('/tasks/:name', function(req, res, next) {
  // if (err) return console.error(err);

  // console.log(req.params)
  User.findOne({name:req.params.name}, function(er, docs){
    console.log(docs)
    res.json(docs)
  })
});

/* GET tasks page. */
router.get('/task/:name', function(req, res, next) {
  User.findById(req.params.name, function(er, doc){
    console.log(doc.name)
    res.render('Task Board/assignTask', { userid: req.params.name, name: doc.name});
  })
});

router.post('/sendTask', function(req, res, next) {
  console.log(req.body.id)

  User.findByIdAndUpdate(req.body.id, {$push: {tasks:{money: req.body.money, honey: req.body.honey, text: req.body.text}}}, {upsert:true}, function(err, doc){
    res.render('Map/map',{id:req.body.id, name:doc.name})
  })
  
  
});

router.get('/landing', function(req, res, next){
  res.render('Map/map')
})

//error handler
router.get('*', function(req, res, next) {
  res.send('invalid request')    
});








module.exports = router;
