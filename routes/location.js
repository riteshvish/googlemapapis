var express = require('express');
var router = express.Router();
var LocationCtrl = require('./../controllers/location');
var Tag = require('./../controllers/tag');
var USLocation = require('./../controllers/usersavedlocation');

/* GET Location listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.route('/search')
  .get(LocationCtrl.search)


router.route('/search/list')
  .get(LocationCtrl.findAll);


router.route('/tag')
  .post(Tag.create).get(Tag.findAll);

router.route('/tag/:tag_id')
  .get(Tag.findOne).put(Tag.update).delete(Tag.deletetag);


router.route('/save')
  .post(USLocation.create).get(USLocation.findAll);

router.route('/save/:saved_id')
  .get(USLocation.findOne).delete(USLocation.deletesaved);



module.exports = router;