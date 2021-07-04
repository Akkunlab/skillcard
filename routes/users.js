var express = require('express');
var pool = require('../src/server/mysql');
var router = express.Router();

/* GET user page. */
router.get('/', function (req, res) {

  if (!req.query.id || req.query.id.length !== 50) { // 除外
    undefinedSkillCard(res);
    return;
  }

  pool.getConnection(function (err, connection) {

    connection.query(
      `SELECT * FROM users WHERE parameter='${req.query.id}'`,
      function(err, results) {

        if (!results.length) { // 除外
          undefinedSkillCard(res);
          return;
        };

        res.render('users', {
          title: 'スキルカード',
          skillcard: results[0].skillcard
        });

      }
    );

  });

});

function undefinedSkillCard(res) {
  res.render('users', {
    title: 'スキルカード',
    skillcard: undefined
  });
}
  
module.exports = router;
