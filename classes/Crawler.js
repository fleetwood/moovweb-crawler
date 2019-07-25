const cheerio = require('cheerio')
    , fs = require('fs')
    , request = require('request')
    , striptags = require('striptags');

class Crawler {
    constructor() {
        this.depth = 0;
        this.pageCount = 0;
        this.results = []
    }

    getUrl(options) {
        this.depth = options.depth || 0;
        this.paageCount = options.pageCount || 0;
        return new Promise((resolve, reject) => {
            this.parseUrl(options)
                .then(result => {
                    this.results.push(result);
                    if (this.pageCount > 0) {
                        this.pageCount--;
                    }
                    else {
                        resolve(this.results);
                        this.results = [];
                    }
                })
                .catch(e => reject(e));
        }); 
    }

    parseUrl(options) {
        return new Promise((resolve, reject) => {
            request(options.url, (err, res, html) => {
                if (err) {
                    reject(err);
                }

                const $ = cheerio.load(html);
                const page = $('body').children().toArray();
                const parse = page.filter(c => c.type === 'tag');
                const pages = []; // TODO: get all links on page
                // TODO: parse recsurviely
                this.parseTerms($, options,  parse)
                    .then(contents => {
                        resolve({ url: options.url, children: page, term: options.searchTerm, results: contents});
                    })
                    .catch(e => reject(e));
            });
        });
    }

    parseTerms($, options, parse) {
        return new Promise((resolve, reject) => {
            try {
                let contents = parse.map(p => {
                    let content = striptags($(p).html(), ['strong', 'i', 'a']);
                    let index = content.indexOf(options.searchTerm);
                    // found a match
                    if (index >= 0) {
                        let min = index;
                        let max = index;
                        // go backwards to the next tag element
                        while(content.charAt(min).match(/^<>/)) {
                            min--;
                        }
                        // and foward to the next tag element
                        while(content.charAt(max).match(/^<>/)) {
                            max++;
                        }
                        // strip unnecessary tags
                        content = striptags(content.substr(min, max));
                        // make sure we didn't begin inside a tag
                        if (content.indexOf('>')>=0) {
                            content = content.substr(content.indexOf('>')+1)
                        }
                        return content.trim();
                    }
                });
                resolve(contents.filter(f => f));
            }
            catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = Crawler;
