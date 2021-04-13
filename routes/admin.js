var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('admin', { title: 'Admin?' });
});

/* GET hash password. */
router.get('/hash/:password', function (req, res, next) {

  let password = req.params.password;

  console.log('password: ' + password);

  var passwordHash = require('password-hash');

  var hashedPassword = passwordHash.generate(password);

  console.log('hash ' + hashedPassword); // sha1$3I7HRwy7$cbfdac6008f9cab4083784cbd1874f76618d2a97

  res.render('admin', { title: 'Admin?' });
});



// entering a new quote
router.get('/newQuote', function (req, res, next) {
  res.render('newQuote', { title: 'Create New Quote', failure: false });
});

// saving a quote
router.post('/saveQuote', function (req, res, next) {
  var sqlite3 = require('sqlite3').verbose()
  var db = new sqlite3.Database('intp.db')

  let username = req.param('username');
  let password = req.param('password');
  let author = req.param('author');
  let quote = req.param('quote');

  var passwordHash = require('password-hash');
  const hash = 'sha1$6fe02e13$1$e3305e781c0c6ff9db9af2e85aa8be1281de48d9';
  

  if (username !== 'jrhd437' && passwordHash.verify(password, hash)) {
    res.render('newQuote', { title: 'Create New Quote', failure: true });
  } else if (quote.length > 250) {
    res.render('admin', { title: 'Too many chars!' });
  } else {
    var stmt = db.prepare('INSERT INTO quotes ("Author", "Quote") VALUES (?, ?) ')
    stmt.run(author, quote)
  }

  res.render('newQuote', { title: 'Admin', username: username, password: password, author: author });
});

// when admin wants to tweet
router.post('/tweet', function (req, res, next) {

  var passwordHash = require('password-hash');
  const hash = 'sha1$6fe02e13$1$e3305e781c0c6ff9db9af2e85aa8be1281de48d9';
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database('intp.db');
  var Twit = require('twit');

  if(req.body.username !== undefined && req.body.username == 'jrhd437'){
    if(req.body.password !== undefined && passwordHash.verify(req.body.password, hash)){

      var T = new Twit({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET,
        timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
        strictSSL: true,     // optional - requires SSL certificates to be valid.
      })

      db.each('SELECT * FROM quotes WHERE ID = ? LIMIT 1', randomInteger(1, 763), function (err, row) {
        let tweet = row.Quote + " -" + row.Author + " #INTP";
        T.post('statuses/update', { status: tweet }, function (err, data, response) {
          console.log(data);
          console.log(err);
          res.render('tweet', { title: 'Admin', tweet: data.text });
        })
      })

    } else {
      res.render('bye', { title: 'Bad credentials... bad, bad credentials...' });
    }
  } else {
    res.render('bye', { title: 'I have no idea who you are.' });
  }


});


function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = router;