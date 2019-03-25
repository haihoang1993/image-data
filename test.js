const FileDownLoadManeger = require('./crawler_data/file-download');

// MongoDB.connectDB().then(()=>{
//     console.log("connect db ok");
//   },(err)=>{
//      console.log("connect DB error:",err);
//   });
//
// DatabaseManager.getPhotoByID(3851173).then(photos=>{
//     console.log("Photo:",photos[0]);
//     let p=photos[0];
//     p.category="animals";
    // FileDownLoadManeger.downloadPhotoByID({id:4060710,category:"test"}).then(()=>{
    //     // DatabaseManager.updateValuePhoto(p.id,p).then(()=>{
    //     //     console.log("updATE OK");
    //     //
    //     // },errr=>{
    //     //     console.log("update: error",errr)
    //     // });
    // },err=>{

    // });
let zi=FileDownLoadManeger.getFilesizeInBytes();
console.log("size:",zi);