var request = require('request');
var cheerio = require('cheerio');
var DataPixabay = require('./src/data/DataPixabay');

// let data = new DataPixabay('anima', 1);
// data.getDataSaveFile();

// for (let index = 1; index <= 1; index++) {
//
//     let data = new DataPixabay('backgrounds', index);
//     data.getDataSaveFile();
//
// }
let data = new DataPixabay();
// data.downLoadImgge('backgrounds',1)
async function  doMain(){
    // let check= await data.downLoadImgge("backgrounds",13,1);
    let check= await data.checkHasFile("backgrounds","4026086");
    console.log("error:",check);
}

doMain();