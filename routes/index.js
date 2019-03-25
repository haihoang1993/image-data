var express = require('express')
;
var router = express.Router();
var DataPixabay = require('../src/data/DataPixabay');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* GET home page. */
router.get('/data/:category',async function (req, res, next) {
    let category = req.params.category;
    let num = parseInt(req.query.num);
    let page = parseInt(req.query.page);
    console.log("p:", category);
    console.log("p:", num);
    console.log("p:", page);

    res.setHeader('Access-Control-Allow-Credentials', false);
    res.setHeader('Content-Type', 'application/json');

    if(!num||!page){
        console.log("error null");
        res.send({error:"prammer"})
        return;
    }
    let data = new DataPixabay();
    let check= await data.downLoadImgge(category,page,num);
    res.send(check);
});

module.exports = router;
