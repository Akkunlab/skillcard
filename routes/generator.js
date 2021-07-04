var express = require('express');
var router = express.Router();
var json = require('../src/server/skill_item_list.json');

/* GET generator page. */
router.get('/', function(req, res) {
  res.render('generator', {
    title: 'スキル作成',
    skill_list: json.list,
    skill_list_name: json.listName
  });
});

module.exports = router;
