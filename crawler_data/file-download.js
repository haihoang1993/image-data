const fs = require('fs')
const Path = require('path')
const Axios = require('axios')
const imageFolder = Path.resolve(__dirname) + '/images/';

function getSession(){
    let arr=[
        '".eJxVjMsOwiAQRf-FtWmgFCr-DBmHaYp9YGCIC-O_i10Y3d57znkKD5VnXwtlP0OZxUX0atROWy1hdAENKROMnmDoUcPZwGTBSTWgFCfBVBhTWiI175HyQqGtP8kr4EJ7aO89pxshd5XjWjqshdN2gF080B028il72iCuX-8vFj8dJY2zenTi9Qb3HD-w:1h86tE:1lp5GnAeDUf4AwYhFbafrkEd10w"'
    ];
    let num=Math.floor((Math.random() * arr.length) + 1)-1;
    console.log("num random:",num);
    return arr[num];
}

async function downloadImage(url, pathFileSave, nameFile = 'test.jpg') {
    // let name = obj.id + "_" + typeSize + ".jpg";
    console.log("name szie:", nameFile);

    // const path = Path.resolve(__dirname, 'images/'+obj.category, Path.basename(url));
    const path = Path.resolve(pathFileSave, nameFile);
    console.log(path);
    let options = {
        method: 'GET',
        dest: imageFolder,
        url: url,
        encoding: 'binary',
        responseType: 'stream',
        headers:
            {
                'cookie': 'sessionid='+getSession(),
                'cache-control': 'no-cache'
            }
    };
    console.log("opption:",options);
    // axios image download with response type "stream"

    const response = await Axios(options);
    // console.log('res code:',response.code);
       // console.log("load img:",response);

       // pipe the result stream into a file on disc

       // return a promise and resolve when download finishes
       return new Promise(async (resolve, reject) => {

           // if(response.code)
           response.data.pipe(fs.createWriteStream(path));
           response.data.on('end', async () => {

               resolve(1);
               // if(fileSizeInBytes<1000){
               //     reject(-2);
               // } else {
               //     console.log("ok man");
               //     resolve(1);
               // }
           });

           response.data.on('error', () => {
               console.log("error");
               reject(-1);
           })
       });
}

function getLinkById(id,tag) {
    // https://pixabay.com/images/download/angel-4060395.jpg?attachment
    //  https://pixabay.com/images/download/dawn-3793717.jpg?attachment
    // return "https://pixabay.com/images/download/dawn-" + id + ".jpg?attachment";
    let tagTemp=tag.replace(' ','-')
    return "https://pixabay.com/images/download/"+tagTemp+"-" + id + ".jpg?attachment";
}

var FileDownLoadManeger = {

    downloadImageByID: async (id, pathFileSave, nameFile = 'test.jpg',tag="",type='jpg') => {
        let rl= await downloadImage(getLinkById(id,tag), pathFileSave, nameFile);
        const path1= Path.resolve(pathFileSave, nameFile);
        const stats =await fs.statSync(path1.toString());
        const fileSizeInBytes = stats.size;
        console.log("size:",fileSizeInBytes);
        if(rl===-1||fileSizeInBytes<7000){
            return -1;
        } else {
            return 1;
        }
    },

    getFilesizeInBytes: (filename = '/Volumes/ide/work-hai/imagestore/images-store-data/crawler_data/images/test/4060710_full.jpg') => {
        const stats = fs.statSync(filename);
        const fileSizeInBytes = stats.size;
        return fileSizeInBytes;
    }
}

module.exports = FileDownLoadManeger;