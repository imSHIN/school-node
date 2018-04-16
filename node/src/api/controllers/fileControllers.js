import recreationModel from "../models/recreationDetails"
import innovationModel from "../models/innovationDetails"
import socialWorkModel from "../models/socialWorkDetails"
import socialPracModel from "../models/socialPracDetails"

//参数最好再设置一个key 保存文件信息的数组名 但是数据库中统一都是evidence 所以此处不进行添加
class FileControllers {
    constructor() {
        //调用了其它方法的那个函数要进行声明
        this.uploadInnovationFile = this.uploadInnovationFile.bind(this)
        this.uploadRecreationFile = this.uploadRecreationFile.bind(this)
        this.uploadSocialWorkFile = this.uploadSocialWorkFile.bind(this)
    }
    async uploadFile(req, res, model) {
        
        //获取图片数组
        let files = req.files
        //请求的路由为...?id=123  id用于将图片和项目形成映射关系
        const id = req.query.id
        const userId = req.session.user._id
        //图片最大尺寸为500kb
        const MAX_SIZE = 1024 * 500
        try {
            if(userId != req.params.userId) {
                throw Error("userId错误")
            }
            if(files.length == 0) {
                throw Error("无图片上传")
            }
            for(let i = 0; i < files.length; i++) {
                if(files[i].size > MAX_SIZE) {
                    throw Error("图片过大")
                }
            }
        } catch(err) {
            return res.send({
                status: 1,
                statusInfo: {
                    type: "UPLOAD_ERROR",
                    message: err.message
                }
            })
        }
        try {
            
            //先检查innovation文档是否存在
            const isExist = await model.findOne({userId})
            //如果不存在文档 先创建
            if(!isExist) {
                await model({
                    user: userId,
                    userId
                }).save()
            }
            let fileInfoArr = []
            let fileInfo = {}
            for(let i = 0; i < files.length; i++) {
                fileInfo.size = files[i].size/1024 + "KB"
                fileInfo.filename = files[i].filename
                fileInfo.path = files[i].path
                //加入id
                fileInfo.id = id
                fileInfoArr.push(fileInfo)
            }
            //可以使用option{upsert: true} 此时查询条件得改成{ user, userId }
            await model.findOneAndUpdate({userId}, {$push: {evidence: {$each: fileInfoArr}}})
            return res.send({
                status: 0,
                statusInfo: {
                    message: '上传成功'
                }
            })
        } catch(err) {
            return res.send({
                status: 1,
                statusInfo: {
                    type: "SERVER_ERROR",
                    message: err.message
                }
            })
        }
    }
    async uploadRecreationFile(req, res) {
        this.uploadFile(req, res, recreationModel)
    }
    async uploadInnovationFile(req, res) {
        this.uploadFile(req, res, innovationModel)
    }
    async uploadSocialWorkFile(req, res) {
        this.uploadFile(req, res, socialWorkModel)
    }
    async uploadSocialPracFile(req, res) {
        this.uploadFile(req, res, socialPracModel)
    }
    
}

export default new FileControllers()