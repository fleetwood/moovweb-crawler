const Crawler = require('./../classes/Crawler')
    , crawler = new Crawler();


const init = (app) => {
    app.post('/api/search', (req, res, next) => {
        let options = req.body;
        crawler.getUrl(options)
            .then(results => {
                let contents = results.map(r => {
                    return {count: r.results.length, url: r.url, results: r.results};
                });
                res.render('partials/searchResults', {
                    // data: { options, results, count: results.length},
                    data: {options, results: contents},
                    layout: false
                });
            })
            .catch(e => {
                res.render('partials/error', { e, layout: false });
            });
    });
};

module.exports = {
    init
};
