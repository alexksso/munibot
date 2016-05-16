// Load required packages
var User = require('../models/user');

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
  console.log("email for new user: "+req.body.email);
  var user = new User({
    email: req.body.email,
    password: req.body.password 
   });

  user.save(function(err) {
    if (err)
      res.send(err);
    else
      res.json({ message: 'New muni user added to the locker room!' });
  });
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
  console.log("loading user with id "+req.user._id);
  res.json(req.user);
  /*User.find({ userId: req.user._id }, function(err, users) {
    if (err)
      res.send(err);

    res.json(req.user);
  });*/
};