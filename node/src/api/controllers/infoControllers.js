import finalScoreModel from "../models/finalScores"
import innovationModel from "../models/innovationDetails"
import moralityModel from "../models/moralityDetails"
import socialPracModel from "../models/socialPracDetails"
import socialWorkModel from '../models/socialWorkDetails'
import recreationModel from '../models/recreationDetails'
import userModel from '../models/user'

class InfoControllers {
    constructor() {
        this.getTentativeScore = this.getTentativeScore.bind(this)
        this.getStuUploadInfo = this.getStuUploadInfo.bind(this)
    }

    sendClientError(err, res) {
        return res.send({
            status: 1,
            statusInfo: {
                type: "CLIENT_ERROR",
                message: err.message
            }
        })
    }

    sendServerError(err, res) {
        return res.send({
            status: 1,
            statusInfo: {
                type: "SERVER_ERROR",
                message: err.message
            }
        })
    }

    //获取项目完整信息
    getCompleteItem(doc, itemType, imgAddress) {
        //先获取项目的名称以及id  根据id来获取图片
        //类型为数组
        const competition = doc[itemType]
        //用于保存 竞赛项目
        let itemArr = []
        let item = {
            name: '',
            evidence: []
        }
        //保存图片名称的数组
        const evidence = doc.evidence
        //遍历科技竞赛项目 找到项目对应的图片
        for(let i = 0; i < competition.length; i ++) {
            //根据id找图片
            const id = competition[i].id
            item.name = competition[i].name
            //遍历图片
            for(let j = 0; j < evidence; j++) {
                if(evidence[j].id === id) {
                    //图片的地址
                    item.imgUrl = imgAddress + evidence[i].name
                    //将对象存入数组中
                    itemArr.push(item)
                    //清空item对象
                    item.name = ''
                    item.evidence = []
                }  
            }
        }
        return itemArr
    }

    //学生端使用

    //get
    //学生端用来显示  数据库中初步的成绩
    async getTentativeScore(req, res) {
        const userId = req.session.user._id
        try {
            if(userId != req.params.userId) {
                throw Error("userId错误")
            }
            
        } catch(err) {
            this.sendClientError(err, res)
        }
        try {
            const finalDoc = await finalScoreModel.findOne({userId})
            let gradeItem = {
                name: "智育素质",
                score: 0,
                status: "未提交"
            }
            let phyItem = {
                name: "身体素质",
                score: 0,
                status: "未提交"
            }
            let moralItem = {
                name: "德育素质",
                score: 0,
                status: "未提交"
            }
            let innovationItem = {
                name: "创新创业能力",
                score: 0,
                status: "未提交"
            }
            let socialPracItem = {
                name: "社会实践能力",
                score: 0,
                status: "未提交"
            }
            let socialWorkItem = {
                name: "社会工作能力",
                score: 0,
                status: "未提交"
            }
            let recreationItem = {
                name: "文体拓展素质",
                score: 0,
                status: "未提交"
            }
            
            if(finalDoc) {
                gradeItem.score = finalDoc.gradePointAverage
                if(finalDoc.gradeIsSubmit) {
                    gradeItem.status = "已提交 审核中"
                }

                phyItem.score = finalDoc.physicalFitness
                if(finalDoc.phyIsSubmit) {
                    phyItem.status = "已提交 审核中"
                }

                moralItem.score += finalDoc.classLevel + finalDoc.assessment + 
                    finalDoc.bedroom + finalDoc.serviceDedication

                innovationItem.score = finalDoc.technologyCompetition + finalDoc.certificationExam + 
                    finalDoc.academicPaper
                
                socialPracItem.score = finalDoc.socialPractice

                socialWorkItem.score = finalDoc.socialWork

                recreationItem.score = finalDoc.selfStudy + finalDoc.activities + 
                    finalDoc.newsRelease
            }

            const moralDoc = await moralityModel.findOne({userId})
            if(moralDoc) {
                let sign = true
                let unfinishArr = []
                if(moralDoc.selfIsSubmit && moralDoc.dormitoryIsSubmit && moralDoc.classIsSubmit &&
                    moralDoc.deedIsSubmit && moralDoc.obedienceIsSubmit) 
                {
                    moralDoc.status = "已提交 审核中"
                    sign = false

                }
                if(sign) {
                    if(!moralDoc.selfIsSubmit) {
                        unfinishArr.push("自我评价")
                    }
                    if(!moralDoc.dormitoryIsSubmit) {
                        unfinishArr.push("寝室纪实分")
                    }
                    if(!moralDoc.classIsSubmit) {
                        unfinishArr.push("班级等级分")
                    }
                    if(!moralDoc.deedIsSubmit) {
                        unfinishArr.push("履行责任、服务奉献记实分")
                    }
                    if(!moralDoc.obedienceIsSubmit) {
                        unfinishArr.push("遵章守纪加减分")
                    }
                    // console.log(unfinishArr.join(" "))
                    moralItem.status = unfinishArr.join(" ") + moralItem.status
                }
                
            }
            else {
                moralItem.status = "未提交"
            }

            const innovationDoc = await innovationModel.findOne({userId})
            //该文档提交后才会存在 所以这里直接判断该文档是否存在 来 判断用户是否上传了该模块
            if(innovationDoc) {
                innovationItem.status = "已提交 待审核(部分分数待审核完成后才返回)"
            }

            const socialPracDoc = await socialPracModel.findOne({userId})
            if(socialPracDoc) {
                socialPracItem.status = "已提交 待审核(部分分数待审核完成后才返回)"
            }  
            
            const socialWorkDoc = await socialWorkModel.findOne({userId})
            if(socialWorkDoc) {
                socialWorkItem.status = "已提交 待审核(部分分数待审核完成后才返回)"
            } 

            const recreationDoc = await recreationModel.findOne({userId})
            if(recreationDoc) {
                recreationItem.status = "已提交 待审核(部分分数待审核完成后才返回)"
            }
            //用于保存7个上传模块的提交情况
            let scoreItems =  [moralItem, gradeItem, phyItem, innovationItem, socialPracItem, socialWorkItem, recreationItem]
            
            res.send({
                status: 0,
                scoreItems
            })
            } catch(err) {
            this.sendServerError(err, res)
        }
    }

    //get
    //返回数据库中保存的四六级成绩
    async getCETScore(req, res) {
        const userId = req.session.user._id
        try {
            if(userId != req.params.userId) {
                throw Error("userId错误")
            }
        } catch(err) {
            return this.sendClientError(err, res)
        }
        try {
            let cet4 = 0
            let cet6 = 0
            const doc = await innovationModel.findOne({userId})
            if(doc) {
                let englishExam = doc.englishExam
                for(let i = 0; i < englishExam.length; i ++) {
                    if(englishExam[i].name == "英语四级") {
                        cet4 = englishExam[i].points
                    }
                    else if(englishExam[i].name == "英语六级") {
                        cet6 = englishExam[i].points
                    }
                }
            }
            return res.send({
                status: 0,
                data: {
                    cet4,
                    cet6,
                }
            })
        } catch(err) {
            return this.sendServerError(err, res)
        }
    }

    //get
    //学生获取德育提交信息
    async getMoralityDetails(req, res) {
        
    }

    //教师端使用

    //返回学生成绩提交情况
    async getStuUploadInfo(req, res) {
        let {condition = {}, skipto = 0, limit = 10, sortby = '-_id'} = req.body
        condition.status = 1 // 查找学生
        try {
            const countUser = await userModel.count(condition) // 查找condition这个条件下的总数
            if (skipto > countUser) skipto = countUser //如果出现skip比总数据量大 就把skipto设置为countUser
            let allStu = await userModel.find(condition)
                                        .sort(sortby)
                                        .skip(Number(skipto))
                                        .limit(Number(limit))
            const length = allStu.length
            let stuArr = []
            for(let i = 0; i < length; i++) {
                const userId = allStu[i]._id
                let submitInfo = {
                    user: allStu[i].user,
                    name: allStu[i].name,
                    phySubmit: false,
                    morSubmit: false,
                    gpaSubmit: false,
                    innovationSubmit: false,
                    socialWorkSubmit: false,
                    socialPracSubmit: false,
                    recreationSubmit: false

                }
                const finalDoc = await finalScoreModel.findOne({userId})
                const innDoc = await innovationModel.findOne({userId})
                const morDoc = await moralityModel.findOne({userId})
                const recreationDoc = await recreationModel.findOne({userId})
                const socialWorkDoc = await socialWorkModel.findOne({userId})
                const socialPracDoc = await socialPracModel.findOne({userId})
                if(finalDoc) {
                    submitInfo.phySubmit = finalDoc.phyIsSubmit
                    submitInfo.gpaSubmit = finalDoc.gradeIsSubmit
                }
                if(morDoc) {
                    if(morDoc.selfIsSubmit && morDoc.dormitoryIsSubmit && 
                        morDoc.classIsSubmit && morDoc.deedIsSubmit && morDoc.obedienceIsSubmit) {
                            submitInfo.morSubmit = true
                        }
                }
                if(innDoc) {
                    submitInfo.innovationSubmit = true
                }
                if(recreationDoc) {
                    submitInfo.recreationSubmit = true
                }
                if(socialWorkDoc) {
                    submitInfo.socialWorkSubmit = true
                }
                if(socialPracDoc) {
                    submitInfo.socialPracSubmit = true
                }
                
                stuArr.push(submitInfo)
                stuArr.sort()
            
            }
            res.send({
                status: 0,
                statusInfo: {
                    stuArr,
                    countUser
                }
            })
        } catch(err) {
            this.sendServerError(err.res)
        }

    }

    //根据user 返回某个学生的提交的各项成绩及图片证明
    async getStuScore(req, res) {
        let { user } = req.body
        try {
            const exist = await userModel.findOne({ user })
            if(!exist) {
                throw Error("用户名不存在")
            }
            let stuScore = {
                //显示学生的名字
                name: '',
                gpa: 0,
                physicalFitness: 0,
                morality: {
                    assessment: 0,
                    //如果evidence[0].imgUrls[0]为空数组 前端不显示
                    //evidnce最后进行判断不存在 才添加默认值
                    // evidence: [{
                    //     name: "",
                    //     imgUrls:[]
                    // }]
                },
                innovation: {
                    itemArr: []
                },
                recreation: {
                    itemArr: []
                },
                socialPrac: {

                },
                socialWork: {

                }

            }
            //设置学生的名字
            stuScore.name = exist.name

            //获取user表的id值 来对应到finalScore文档
            const userId = user._id
            //暂时给测试用 图片地址
            const imgAddress = "http://localhost:3000/public/images/"
            const finalDoc = await finalScoreModel.findOne({ userId })
            //用于查找图片
            const innoDoc = await innovationModel.findOne({ userId })
            const moralityDoc = await moralityModel.findOne({ userId })
            const recreationDoc = await recreationModel.findOne({ userId })
            const sociPracDoc = await socialPracModel.findOne({ userId })
            const sociWorkDoc = await socialWorkModel.findOne({ userId })
            if(innoDoc) {
                //先获取项目的名称以及id  根据id来获取图片
                //类型为数组
                const techCompetition = innoDoc.techCompetition
                const computerExam = innoDoc.computerExam
                const englishExam = innoDoc.englishExam
                const otherExam = innoDoc.otherExam
                const academicPaper = innoDoc.academicPaper
                
                //用于保存 竞赛项目
                let item = {
                    name: '',
                    status: '',
                    evidence: []
                }
                //保存图片名称的数组  是否要删除已经找出的id图片？
                const evidence = innoDoc.evidence
                //遍历科技竞赛项目 找到项目对应的图片
                for(let i = 0; i < techCompetition.length; i ++) {
                    //根据id找图片
                    //科技竞赛没有 status
                    const id = techCompetition[i].id
                    item.name = techCompetition[i].name


                    //遍历图片
                    for(let j = 0; j < evidence.length; j++) {
                        if(evidence[j].id === id) {
                            //图片的地址
                            let imgUrl = imgAddress + evidence[i].filename
                            //将对象存入数组中
                            item.evidence.push(imgUrl)
                        } 

                    }
                    stuScore.innovation.itemArr.push(item)
                    //重置item对象
                    item.name = ''
                    item.evidence = []
                }
                //遍历计算机类竞赛
                for(let i = 0; i < computerExam.length; i ++) {
                    //根据id找图片
                    const id = computerExam[i].id
                    item.name = computerExam[i].name
                    if(/^(2|3)$/.test(computerExam[i].points)) {
                        item.status = "通过"
                    }
                    else if(/^(0.5)$/.test(computerExam[i].points)) {
                        item.status = "参与"
                    }
                    else {
                        item.status = "分数错误(请老师进行校对)"
                    }
                    //遍历图片
                    for(let j = 0; j < evidence.length; j++) {
                        if(evidence[j].id === id) {
                            //图片的地址
                            let imgUrl = imgAddress + evidence[i].filename
                            item.evidence.push(imgUrl)
                        }  
                    }
                    stuScore.innovation.itemArr.push(item)
                    //重置item对象
                    item.name = ''
                    item.evidence = []
                    item.status = ''
                } 
                //遍历英语类竞赛
                for(let i = 0; i < englishExam.length; i ++) {
                    //根据id找图片
                    const id = englishExam[i].id
                    item.name = englishExam[i].name
                    if(/^(英语四级|英语六级)$/.test(item.name)) {
                        item.status = englishExam[i].points
                    }
                    else {
                        if(englishExam[i].points === 2) {
                            item.status = '参与'
                        }
                        else if(englishExam[i].points === 5) {
                            item.status = '通过'
                        }
                        else {
                            item.status = '分数错误(请老师进行校对)'
                        }
                    }
                    //遍历图片
                    for(let j = 0; j < evidence.length; j++) {
                        if(evidence[j].id === id) {
                            //图片的地址
                            let imgUrl = imgAddress + evidence[i].filename
                            item.evidence.push(imgUrl)
                        }  
                    }
                    stuScore.innovation.itemArr.push(item)
                    //重置item对象
                    item.name = ''
                    item.evidence = []
                    item.status = ''
                }
                //遍历其它类竞赛
                for(let i = 0; i < otherExam.length; i ++) {
                    //根据id找图片
                    const id = otherExam[i].id
                    item.name = otherExam[i].name
                    if(otherExam[i].points === 1) {
                        item.status = '参与'
                    }
                    else if(otherExam[i].points === 0.25) {
                        item.status = '通过'
                    }
                    else {
                        item.status = '分数错误(请老师进行校对)'
                    }
                    //遍历图片
                    for(let j = 0; j < evidence.length; j++) {
                        if(evidence[j].id === id) {
                            //图片的地址
                            let imgUrl = imgAddress + evidence[i].filename
                            item.evidence.push(imgUrl)
                        }  
                    }
                    stuScore.innovation.itemArr.push(item)
                    //重置item对象
                    item.name = ''
                    item.evidence = []
                    item.status = ''
                }
                //要删除 status属性吗
                //遍历学术论文
                for(let i = 0; i < academicPaper.length; i ++) {
                    //根据id找图片
                    const id = academicPaper[i].id
                    item.name = academicPaper[i].name
                    //遍历图片
                    for(let j = 0; j < evidence.length; j++) {
                        if(evidence[j].id === id) {
                            //图片的地址
                            let imgUrl = imgAddress + evidence[i].filename
                            item.evidence.push(imgUrl)
                        }  
                    }
                    stuScore.innovation.itemArr.push(item)
                    //重置item对象
                    item.name = ''
                    item.evidence = []
                }
            }
            if(moralityDoc) {

            }
            if(recreationDoc) {
                let item = {
                    name: '',
                    evidence: []
                }
                const activities = recreationDoc.activities
                const evidence = recreationDoc.evidence
                for(let i = 0; i < activities.length; i ++) {
                    item.name = activities[i].actiName
                    const id = activities[i].id
                    for(let i = 0; i < evidence.length; i ++) {
                        if(id == evidence[i].id) {
                            let imgUrl = imgAddress + evidence[i].filename
                            item.evidence.push(imgUrl)
                        }
                    }
                    //重置item对象
                    item.name = ''
                    item.evidence = []
                }
                stuScore.recreation.item.push[item]
            }
            if(sociPracDoc) {
                
                //如果上传了暑期社会实践
                if(!sociPracDoc.socialPracTeam && !sociPracDoc.teamJob && 
                    sociPracDoc.teamJob != 0 && sociPracDoc.socialPracTeam != 0) {
                    //？？？需要加社会实践的名称吗
                    let socialPrac = {
                        //获得的加分分数
                        points: sociPracDoc.socialPracItem,
                        //在队伍中的任职
                        teamJob: sociPracDoc.teamJob
                    }
                    stuScore.socialPrac.socialPrac = socialPrac
                }
                //这个需要大改！！！
                let socialService = {

                }
                
            }
            stuScore.gpa = finalDoc.gradePointAverage
            stuScore.physicalFitness = finalDoc.physicalFitness
            //存储morality的成绩
            //基本评定
            stuScore.morality.assessment = finalDoc.assessment

            
        } catch(err) {
                
        }
    }
}

export default new InfoControllers()