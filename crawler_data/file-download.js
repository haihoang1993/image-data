const fs = require('fs')
const Path = require('path')
const Axios = require('axios')
const imageFolder = Path.resolve(__dirname) + '/images/';
let indexSession=0;

var ListSession=[
    '".eJxVzE0OwiAQQOG7sDYEOgXEy5BxoAEtxfCzary72oXR_fvezhyOHt1oobqILbILm6QBCxoEGutJBam8ggXniQDPCheNVsiZBDv94ivSPWz-7R-13AJ1PnpaG6fReslHyNORbpiDK9WFjGn9ur9Z-nykUFaDsez5AuoxN_w:1h8qyO:2ZVzU3qWykozAwRI_FQKu8RGVpU"'
];

function getSession(){
    let arr=[
        '".eJxVzE0OwiAQQOG7sDYEOgXEy5BxoAEtxfCzary72oXR_fvezhyOHt1oobqILbILm6QBCxoEGutJBam8ggXniQDPCheNVsiZBDv94ivSPWz-7R-13AJ1PnpaG6fReslHyNORbpiDK9WFjGn9ur9Z-nykUFaDsez5AuoxN_w:1h8qyO:2ZVzU3qWykozAwRI_FQKu8RGVpU"'
    ];
    let ss=indexSession;
    if(indexSession<arr.length-1){
        indexSession++;
    } else {
        indexSession=0;
    }
    return arr[ss];
}

async function downloadImage(url, pathFileSave, nameFile = 'test.jpg',sseionID) {
    // let name = obj.id + "_" + typeSize + ".jpg";
    console.log("name szie:", nameFile);

    // const path = Path.resolve(__dirname, 'images/'+obj.category, Path.basename(url));
    const path = Path.resolve(pathFileSave, nameFile);
    console.log(path);
    console.log("session:",sseionID);
    let options = {
        method: 'GET',
        dest: imageFolder,
        url: url,
        encoding: 'binary',
        responseType: 'stream',
        headers:
            {
                'cookie': 'sessionid='+sseionID,
                'cache-control': 'no-cache'
            }
    };

      //  console.log('callback');
    // console.log("opption:",options);
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

    let tagTemp=tag;
    do {
        tagTemp=tagTemp.replace(' ','-');
    } while (tagTemp.indexOf(' ')!==-1);
    return "https://pixabay.com/images/download/"+tagTemp+"-" + id + ".jpg?attachment";
}

var FileDownLoadManeger = {

    downloadImageByID: async (id, pathFileSave, nameFile = 'test.jpg',tag="",type='jpg',session) => {
        console.log("ss temp:",session)
        let rl= await  downloadImage(getLinkById(id,tag), pathFileSave, nameFile,session);
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

module.exports = {FileDownLoadManeger,ListSession};