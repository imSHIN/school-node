var multer = require('multer')
const storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建
    destination: function(req, file, cb) {
        cb(null, "./src/public/images")
    },
    // 给上传文件重命名，获取添加后缀名
    filename: function(req, file, cb) {
        let fileFormat = (file.originalname).split(".")
        //如果用户上传的文件有同名证明办  因为
        cb(null, fileFormat[0] + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1])
    }
    // filename: function(req, file, cb) {
    //     cb(null, file.originalname)
    // }
})

//添加配置文件到muler对象。
var upload = multer({
    storage,
    // limits: {
    //     fileSize: 10
    // }
    fileFilter(req, file, cb) {
        //文件名后缀为jpg和png的才会被保存到服务器
        let fileFormat = (file.originalname).split(".")
        let extName = fileFormat[fileFormat.length - 1]
        if( extName == "jpg" || extName == "png") {
            cb(null, true)
        }
        else {
            cb(null, false)
        }
    }
})
 
//导出对象
export default upload
// module.exports.upload = upload;