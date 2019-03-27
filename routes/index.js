var express = require('express')
;
var router = express.Router();
var DataPixabay = require('../src/data/DataPixabay');
var {ListSession} =require('../crawler_data/file-download')
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});
router.get('/getData', function (req, res, next) {
    res.render('data', {title: 'Express'});
});

router.get('/data/loadlink', function (req, res, next) {
    let category = req.query.category;
    let num = parseInt(req.query.num);
    let page = parseInt(req.query.page);
    if(!num)
        num=10;
    if(!category||!page){
        res.render('index', {title: 'Express'});
    }
    console.log("pageww:",page);
     res.render('index', {title: 'Express',cate:category,numPage:num,listSession:ListSession,pagew:page});
});

/* GET home page. */
router.get('/data/:category',async function (req, res, next) {
    let category = req.params.category;
    let num = parseInt(req.query.num);
    let page = parseInt(req.query.page);
    let numId=parseInt(req.query.ids);

    console.log("p:", category);
    console.log("p:", num);
    console.log("p:", page);

    res.setHeader('Access-Control-Allow-Credentials', false);
    res.setHeader('Content-Type', 'application/json');

    if(!numId){
        numId=0;
    }

    if(!num||!page){
        console.log("error null");
        res.send({error:"prammer"})
        return;
    }
    let data = new DataPixabay();
    let check= await data.downLoadImgge(category,page,num,ListSession[numId]);
    res.send(check);
});

module.exports = router;
