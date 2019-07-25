const express = require('express');
const router = express.Router();

const cheerio = require('cheerio')
  , fs = require('fs')
  , request = require('request');


const getUrl = (options) => new Promise((resolve, reject) => {
  request(options.url, (err, res, html) => {
    if (err) {
      reject(err);
    }

    const $ = cheerio.load(html);
    const page = $('body').children().toArray().filter(c => c.type === 'tag');
    // this will need to be recursive
    let contents = page.filter(p => $(p).html().indexOf(options.searchTerm)>=0);
    resolve(contents.map(c => $(c).contents()));
  })
});

/* GET home page. */
router.get('/', function (req, res, next) {
  let options = {
    url: 'http://www.apple.com',
    searchTerm: 'apple'
  };
  getUrl(options)
    .then(results => {
      // would prefer to stream the results rather than wait
      res.render('index', { title: `Crawl results`, data: {options, results }});
    })
    .catch(e => {
      console.log(e.stack);
    });
});

module.exports = router;
