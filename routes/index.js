const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { 
    domain: req.get('host'),
    protocol: req.protocol,
    title: '#FriTease',
    layout: 'layout',
    title: `Crawl results`});
});

module.exports = router;
