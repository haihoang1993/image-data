// Public
var request = require('request');
var cheerio = require('cheerio');
const fs = require('fs');
const axios = require('axios'),
    path = require("path"),
    mkdirp = require('mkdirp'),
    FileDownLoadManeger = require('../../crawler_data/file-download');

const imageFolder = path.resolve(__dirname) + '/data_raw_pixabay';
const imageFolderFileDown = path.resolve(__dirname) + '/data_img_down';

module.exports = DataPixabay;

function DataPixabay(link = '') {
    this.linkGetData = link;
};

function DataPixabay(category, page) {
    this.category = category;
    this.page = page;
    this.linkGetData = 'https://pixabay.com/en/photos/?cat=' + category + '&pagi=' + page;
}

DataPixabay.prototype.setData = function (idCategory, page) {
    this.linkGetData = 'https://pixabay.com/en/photos/?cat=' + idCategory + '&pagi=' + page;
    console.log("link get:", this.linkGetData);
};

async function checkHasFile(idCategory, idPhoto) {
    let urlF = imageFolderFileDown + '/' + idCategory + '/' + idPhoto + ".jpg";
    let check = await fs.existsSync(urlF);
    if (check) {
        const stats = await fs.statSync(urlF);
        const fileSizeInBytes = stats.size;
        if (fileSizeInBytes < 7000) {
            check = false;
        } else {
            check = true;
        }
    }
    console.log("check has file:", check);
    return check;
}

DataPixabay.prototype.checkHasFile = async function (idCategory, idPhoto) {
    return await checkHasFile(idCategory, idPhoto);
};

DataPixabay.prototype.downLoadImgge = async (category, page, countFile = 1) => {
    let result = {};
    let numError = 0;
    let fileDataJson = imageFolder + "/" + category + "/" + "page_" + page + '.json';
    let readFile = fs.readFileSync(fileDataJson, 'utf8');

    let listItem = JSON.parse(readFile.toString());
    console.log("list:", listItem.length);

    let listItemDonw = listItem.filter((item) => {
        return item.isDownload;
    });

    let listItemNotDown = listItem.filter((item) => {
        return !item.isDownload
    });

    // console.log("list not:",listItemNotDown);
    // let cut = countFile;
    // let newList = [];
    // if (listItemNotDown.length <= countFile)
    //     newList =listItemNotDown ;
    // else
    //     newList = listItemNotDown.splice(0, cut);

    let urlF = imageFolderFileDown + '/' + category + '/' + 'page_' + page + '/';
    let check = await fs.existsSync(urlF);

    if (!check) {
        mkdirp(urlF, function (err) {
            if (err) console.error(err);
            else console.log('Done!')
        });
    }
    let listDownload=[];
    await asyncForEach(listItemNotDown, (async (item, index, arr) => {
        if (index <= (countFile - 1)) {
            let checkHasfile = await checkHasFile(category, item.id);
            console.log("item:", item);
            let tag = item.tag.split(', ')[0].toLowerCase();
            let tempCheck=item;
            if (!checkHasfile) {
                let down = -1;
                let temp = item.url.indexOf("/illustrations/");
                let temp3 = item.url.indexOf("/vectors/");
                if (temp !== -1 || temp3!==-1) {
                    down = -100;
                    result = {...result, errImgPng: true}
                }
                if(down!==-100) {
                    try {
                        down = await FileDownLoadManeger.downloadImageByID(item.id, urlF, item.id + ".jpg", tag);
                    } catch (e) {
                        // let temp = item.url.indexOf("/illustrations/");
                        // let temp3 = item.url.indexOf("/vectors/");
                        // if (temp !== -1 || temp3!==-1) {
                        //     down = -100;
                        //     result = {...result, errImgPng: true}
                        // }
                    }
                }
                if (down === -1) {
                    numError++;
                    tempCheck={...tempCheck,err:numError}
                } else if (down === -100) {
                    let im = await {...item, isDownload: true, isErrPng: true};
                    listItemNotDown[index] = im;
                    tempCheck={...tempCheck,isErrPng: true}
                } else {
                    tempCheck={...tempCheck,err: 0,isDownload: true};
                    let im = await {...item, isDownload: true};
                    listItemNotDown[index] = im;
                    console.log("im:test", down);
                }
                listDownload.push(tempCheck);
            } else {
                let im = await {...item, isDownload: true};
                listItemNotDown[index] = im;
                // console.log("im:test", down);
            }
        }
    }));
    let listMerge = [...listItemDonw, ...listItemNotDown];
    await fs.writeFileSync(fileDataJson, JSON.stringify(listMerge), function (err) {
        if (err) throw err;
        console.log('Saved file!');
    });
    result = {...result, coutError: numError,logDowload:listDownload, listImage: listMerge};
    // console.log("list c:", listMerge);

    return result;
};

DataPixabay.prototype.getData = async function () {
    try {
        const response = await axios.get(this.linkGetData);
        // console.log("test ax:",response);
        let listResutl = toDataFromHtmRaw(response.data);
        return listResutl;
    } catch (error) {
        console.error(error)
    }

};

DataPixabay.prototype.getDataSaveFile = async function () {
    let list = await this.getData();
    // console.log("list:", list);
    let urlF = imageFolder + '/' + this.category + '/';
    let check = await fs.existsSync(urlF);
    if (!check) {
        mkdirp(urlF, function (err) {
            if (err) console.error(err)
            else console.log('Done!')
        });
    }
    fs.writeFile(imageFolder + '/' + this.category + '/page_' + this.page + ".json", JSON.stringify(list), function (err) {
        if (err) throw err;
        console.log('Saved file url_img.json!');
    });
};

let toDataFromHtmRaw = (htmlRaw) => {
    let $ = cheerio.load(htmlRaw);
    let listItemResult = [];
    $('div.item').each(function (i, element) {

        let im = getObjByElement($, this, element);
        listItemResult.push(im);
    });
    // console.log("done get:",listItemResult.length);
    return listItemResult;
};

let getObjByElement = ($, T, element) => {
    let e = element;

    let tempElementLink = $(T).find('div div em').attr('data-href');
    let link = $(T).find('a').attr('href');
    let tag = $(T).find('a img').attr('alt');

    let newObj = {};

    newObj = {...newObj, id: parseInt(getIDfromLink(tempElementLink)), url: link, tag: tag, isDownload: false};
    return newObj;
};

let getIDfromLink = (link = "") => {
    let tem = link.split("/");
    return tem[tem.length - 2];
};

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}