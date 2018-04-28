var express = require('express');
var router = express.Router();
var User = require('./../controllers/users');
var routeguard = require('./../middlewares/routeguard');
var LocationCtrl = require('./../controllers/location');


router.route('/signup')
  .post(User.signup)

router.route('/login')
  .post(User.login)

router.route('/verify')
  .get(routeguard.secure, User.verify);

router.route('/analytics')
  .get(routeguard.secure, LocationCtrl.analytics);

router.route('/logout')
  .put(routeguard.secure, User.logout);

//
// router.route('/details')
//   .get(User.findOne);
//
// router.route('/details:/user_id')
//   .get(User.findById);
//
// router.route('/list')
//   .get(User.findAll);



module.exports = router;