var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  var sqlite3 = require('sqlite3').verbose()
  var db = new sqlite3.Database('intp.db')

  db.each('SELECT * FROM quotes WHERE ID = ? LIMIT 1', randomInteger(1, 763), function (err, row) {
    let tweet = row.Quote + "<br> -" + row.Author;
    res.render('index', { title: 'INTP Quotes',  tweet: tweet});
  })
});

/* GET home page. */
router.get('/json/quote', function (req, res, next) {
  var sqlite3 = require('sqlite3').verbose()
  var db = new sqlite3.Database('intp.db')

  db.each('SELECT * FROM quotes WHERE ID = ? LIMIT 1', randomInteger(1, 763), function (err, row) {
    let tweet = row.Quote + "<br> -" + row.Author;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tweet));
  })
});

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = router;