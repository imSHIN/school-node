// import userModel from '../models/user'
import finalScoreModel from "../models/finalScores"
import moralityScoreModel from "../models/moralityDetails"
import innovationScoreModel from "../models/innovationDetails"
import socialPracModel from "../models/socialPracDetails"
import socialWorkModel from '../models/socialWorkDetails'
import recreationModel from '../models/recreationDetails'
// import getPoints from './transform'
import Points from '../middlewares/transformScore'



class ScoresControllers {
    constructor(){
    }
    //post
    //学生上传身体素质分
    async uploadPhysical(req, res) {
    //第一个学期的体育成绩，第二个学期的体育成绩
        let {fsPhysicalScore = 0, ssPhysicalScore = 0 } = req.body
        const userId = req.session.user._id // 从session中获取session内容
        try {
            if (!userId || userId != req.params.userId) {
                throw Error("userId错误")
            }
            //postman测试 先转化成数字类型
            //判断输入是否正确，分数是否在0~100，如果不是则抛出错误
            fsPhysicalScore = Number(fsPhysicalScore)
            ssPhysicalScore = Number(ssPhysicalScore)
            if(fsPhysicalScore > 100 || fsPhysicalScore < 0 || 
                ssPhysicalScore > 100 || ssPhysicalScore < 0 ||
                isNaN(fsPhysicalScore) || isNaN(ssPhysicalScore)) 
            {
                throw Error("成绩参数错误")
            }
            const totalPhyScore = fsPhysicalScore + ssPhysicalScore
            const averagePhyScore = totalPhyScore / 2 //两学期的平均分
            //用于更新finalScore文档
            const newPhysical = { 
                physicalFitness: averagePhyScore,
                phyIsSubmit: true
            }
            //用于创建finalScore文档
            const firstPhysical = {
                user: userId,
                userId: userId,
                physicalFitness: averagePhyScore,
                phyIsSubmit: true
            }
            var hasUploaded = await finalScoreModel.findOneAndUpdate({userId: userId}, {$set: newPhysical})
            //如果该用户的finalScore文档已经存在
            if(!hasUploaded) {
                await finalScoreModel(firstPhysical).save()
            }
            
            res.send({
                status: 0,
                averagePhyScore,
                statusInfo: {
                    message: "上传成功",
                }
            })
        } catch (err) {
            console.log('userControllers: loadPhysical', err.message)
            res.send({
                status: 1,
                statusInfo: {
                    type: 'ERROR_UPLOAD',
                    message: err.message
                }
            })
        }
    }

    //post
    //学生上传智育分
    async uploadGPA(req, res) {
        let {GPA} = req.body
        const userId = req.session.user._id // 从session中获取session内容
        try {
            if (!userId || userId != req.params.userId) {
                throw Error("userId错误")
            }
            //postman测试  转化成数字
            GPA = Number(GPA)
            //小数判断，可能有误差
            if(isNaN(GPA) || GPA > 5 || GPA < 0) 
            {
                throw Error("绩点参数错误")
            }
            const GPAScore = GPA * 10 + 50
            //这句代码可以代替下面的  但是初次创建文档的时候有点缺陷
            // await finalScoreModel.findOneAndUpdate({userId}, {user: userId, userId, gradePointAverage: GPAScore}, {upsert: true})
            
            //用于更新finalScore文档中的gradePointAverage属性
            const newGPA = {
                gradePointAverage: GPAScore,
                gradeIsSubmit: true
            }
            //用于初次创建finalScore文档
            const firstGPA = {
                user: userId,
                userId: userId,
                gradePointAverage: GPAScore,
                gradeIsSubmit: true
            }
            var hasUploaded = await finalScoreModel.findOneAndUpdate({userId: userId}, {$set: newGPA})
            //如果是初次创建该文档finalScore
            if(!hasUploaded) {
                await finalScoreModel(firstGPA).save()
            }
            res.send({
                status: 0,
                GPAScore: GPAScore,
                statusInfo: {
                    message: "上传成功",
                }
            })
        } catch (err) {
            console.log('userControllers: loadGPA', err.message)
            res.send({
                status: 1,
                statusInfo: {
                type: 'ERROR_UPLOAD',
                message: err.message
                }
            })
        }
    }

    //post
    //学生上传德育分-自我评价
    async uploadSelfAssessment(req, res) {
        const userId = req.session.user._id // 从session中获取session内容
        //得到的是数组
        let {selfAssessment} = req.body
        //数组长度最多为8位
        const LENGTH = 8
        //检查每一项是否都为5~8之间的整数
        try {
            if (!userId || userId != req.params.userId) {
                throw Error("userId错误")
            }
            //如果上传的数组的长度小于8，则抛出错误
            if(selfAssessment.length < LENGTH) {
                throw Error('参数长度错误')
            }
            else if(selfAssessment.length > LENGTH) {
                //把数组多余的地方截掉
                selfAssessment.splice(8, selfAssessment.length - LENGTH)
            }
            var totalSelfAssScore = 0
            for(let i = 0; i < LENGTH; i++) {
                // console.log(selfAssessment[0])
                //如果传入的数不是5~8，则抛出错误
                if(!/^[5-8]$/.test(selfAssessment[i])) {
                    
                    throw Error("自我评价参数错误")
                }
                else {
                    selfAssessment[i] = parseInt(selfAssessment[i])
                    totalSelfAssScore += selfAssessment[i]
                }
            }
        }
        catch(err) {
            return res.send( {
                status: 1,
                statusInfo: {
                    type: 'UPLOAD_ERROR',
                    message: err.message
                }
            } )
        }
        try {
            let totalScore = 0
            for(let i = 0; i < selfAssessment.length; i++) {
                totalScore += selfAssessment[i]
            }
            const newSelfAsse = {
                selfAssessment,
                selfIsSubmit: true
            }
            const firstSelfAsse = {
                user: userId,
                userId,
                qualityOfMoralEducation: selfAssessment,
                selfAssessment,
                selfIsSubmit: true
            }
            const newFinal = {
                assessment: totalScore
            }
            const firstFinal = {
                user: userId,
                userId,
                assessment: totalScore,
                personalBasicQuality: totalScore,
            }
            const hasUploaded = await moralityScoreModel.findOneAndUpdate({userId}, {$set: newSelfAsse})
            
            //如果其它部分已经上传了或者这个部分多次上传
            if(!hasUploaded) {
                await moralityScoreModel(firstSelfAsse).save()
            }

            const finalUploaded = await finalScoreModel.findOneAndUpdate({userId}, {$set: newFinal})
            
            if(!finalUploaded) {
                await finalScoreModel(firstFinal).save()
            }
            else {
                let oldAsseValue = finalUploaded.assessment
                finalUploaded.personalBasicQuality += -oldAsseValue + totalScore
                await finalUploaded.save()
            }
            return res.send({
                status: 0,
                totalSelfAssScore,
                statusInfo: {
                    message: "上传成功",
                }
            })
        }
        catch(err) {
            return res.send({
                status: 1,
                statusInfo: {
                    type: "SERVER_ERROR",
                    message: err.message,
                }
            })
        }
    }

    //post
    //学生上传德育-班级等级分
    async uploadClassLevel(req, res) {
        const userId = req.session.user._id
        let { classLevel } = req.body
        try {
            console.log(req.body)
            if(userId != req.params.userId) {
                throw Error("userId错误")
            }
            var reg = /^(11|12|14)$/
            if(!reg.test(classLevel.score)) {
                throw Error("参数格式错误")
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
            //如果info上传了 说明有学生疑惑
            if(typeof(classLevel.info) != 'undefined') {
                classLevel.certi = false
            }
            const newClassLevel = {
                classLevel,
                classIsSubmit: true,
            }
            const firstMorality = {
                user: userId,
                userId,
                classLevel,
                classIsSubmit: true
            }
            const firstClaLevel = {
                user: userId,
                userId,
                personalBasicQuality: classLevel.score,
                classLevel: classLevel.score,
            }
            const hasUploaded = await moralityScoreModel.findOneAndUpdate({userId}, {$set: newClassLevel})
            
            if(!hasUploaded) {
                await moralityScoreModel(firstMorality).save()
            }

            const finalScoreIsUploaded = await finalScoreModel.findOneAndUpdate({userId}, {$set: {classLevel: classLevel.score}})
            if(!finalScoreIsUploaded) {
                await finalScoreModel(firstClaLevel).save()
            }
            else {
                let oldClaValue = finalScoreIsUploaded.classLevel
                finalScoreIsUploaded.personalBasicQuality += -oldClaValue + classLevel.score
                
                await finalScoreIsUploaded.save()
            }

            return res.send({
                status: 0,
                classLevel,
                statusInfo: {
                    message: '上传成功'
                }
            })
        }
        catch(err) {
            return res.send({
                stauts: 1,
                statusInfo: {
                    type: 'SERVER_ERROR',
                    message: err.message
                }
            })
        }
    }

    //post
    //学生上传德育-寝室纪实情况
    async uploadDormitory(req, res) {
        const userId = req.session.user._id
        // let { dormitoryWeek = 0, dormitoryRadio = 0, dormitoryPraiseNum = 0, dormitoryDisciplineNum = 0} = req.body
        let { dormitory } = req.body
        try{
            console.log(req.body)
            if(userId != req.params.userId) {
                throw Error("userId错误")
            }
            //postman测试  将其转化为数字
            //判断dormitoryWeek是否为0~100的实数
            //tip:字符串和数字进行比较 字符串为非纯数字时,则将非数字字符串转成数字的时候会转换为NaN,当NaN和数字比较时不论大小都返回false
            // dormitory.dormitoryWeek = Number(dormitory.dormitoryWeek)
            // if(isNaN(dormitoryWeek) || dormitoryWeek > 100 || dormitoryWeek < 0) {
            //     throw Error("寝室日常考核分参数错误")
            // }

            //判断dormitoryRadio是否为（0|2|3）
            if(!/^(0|2|3)$/.test(dormitory.dormitoryRadio)) {
                throw Error("文明寝室分数参数错误")
            }
            //判断寝室表扬和寝室批评次数是否为整数
            const posIntRegExp = /^\d+$/ //正整数正则表达式
            if(!posIntRegExp.test(dormitory.dormitoryDisciplineNum) || !posIntRegExp.test(dormitory.dormitoryPraiseNum)) {
                throw Error("寝室表扬批评次数参数错误")
            }
            //postman测试 需要转化为数字 最好先判断下类型  如果是字符串再转化
            //参数都符合规则，将参数  字符串->整数
            // dormitoryRadio = parseInt(dormitoryRadio)
            // dormitoryPraiseNum = parseInt(dormitoryPraiseNum)
            // dormitoryDisciplineNum = parseInt(dormitoryDisciplineNum)
        }
        catch(err) {
            return res.send({
                status: 1,
                statusInfo: {
                    type: "PARAMENT_ERROR",
                    message: err.message
                }
            })
        }
        try {
            //学生有疑惑
            if(typeof(dormitory.info) != 'undefined') {
                dormitory.certi = false
            }
            const newDormitory = {
                // dormitoryWeek,
                // dormitoryRadio,
                // dormitoryPraiseNum,
                // dormitoryDisciplineNum,
                dormitory,
                dormitoryIsSubmit: true
            }
            const firstDormitory = {
                user: userId,
                userId,
                // dormitoryWeek,
                // dormitoryRadio,
                // dormitoryPraiseNum,
                // dormitoryDisciplineNum,
                dormitory,
                dormitoryIsSubmit: true
            }
            const hasUploaded = await moralityScoreModel.findOneAndUpdate({userId}, {$set: newDormitory})
            let totalDormScore = dormitory.dormitoryWeek * 0.1 +  dormitory.dormitoryRadio + 
                ( dormitory.dormitoryPraiseNum -  dormitory.dormitoryDisciplineNum) * 0.5
            const MAX_SCORE = 14
            const MIN_SCORE = 0
            totalDormScore = totalDormScore < MIN_SCORE? MIN_SCORE: totalDormScore > MAX_SCORE? MAX_SCORE:totalDormScore
            //用于保存到对应用户的finalScore文档中
            const newBedromm = {
                bedroom: totalDormScore
            }
            const firstFinal = {
                user: userId,
                userId,
                personalBasicQuality: totalDormScore,
                bedroom: totalDormScore
            }
            if(!hasUploaded) {
                await moralityScoreModel(firstDormitory).save()
            }
                //因为已经上传过了德育部分的分数，所以该用户的finalScore文档中肯定也已经存在了
                //但是还是最好先判断下是否已经存在
            const finalScoreIsUploaded = await finalScoreModel.findOneAndUpdate({userId}, {$set: newBedromm})
            if(!finalScoreIsUploaded) {
                await finalScoreModel(firstFinal).save()
            }
            else {
                let oldDorValue = finalScoreIsUploaded.bedroom
                finalScoreIsUploaded.personalBasicQuality += -oldDorValue + totalDormScore
                await finalScoreIsUploaded.save()
            }
            return res.send({
                status: 0,
                totalDormScore,
                statusInfo:{
                    message: '上传成功'
                }
            })
            
        }
        catch(err) {
            res.send({
                status: 1,
                statusInfo: {
                    type: 'SERVER_ERROR',
                    message: err.message
                }
            })
        }
    }

    //post
    //学生上传德育-履行责任、服务奉献记实分
    async uploadVolunteer(req, res) {
        const MAX_SCORE_VOL = 8//履行责任、服务奉献记实分（满分8分）
        const userId = req.session.user._id
        // let { goodDeedSc = 0, goodDeedCo = 0, volunteer = 0, 
        //         volunCountry = 0, volunProvince = 0} = req.body
        let { volunteer } = req.body
        try {
            if(userId != req.params.userId) {
                // console.log("user")
                throw Error("userId错误")
            }
            const reg = /^\d+$/ //0和正整数正则表达式
            const patten = /^\d+\.?\d*$/ //0和正实数正则表达式
            // if(!reg.test(goodDeedCo) || !reg.test(goodDeedSc) || !patten.test(volunteer) ||
            //         !reg.test(volunProvince) || !reg.test(volunCountry)) {
            //     throw Error("上传参数格式错误")
            // }
            if(!patten.test(volunteer.volunteerIn)) {
                throw Error("上传参数格式错误")
            }
        }
        catch(err) {
            return res.send({
                status: 1,
                statusInfo: {
                    type: "UPLOAD_ERROR",
                    message: err.message
                }
            })
        }
        try {
            //用于计算志愿者总工时
            let totalVolunteer = 0
            let serviceDedication = 0
            
            totalVolunteer += volunteer.volunteerIn || 0
            let volunteerOut = volunteer.volunteerOut || []
            for(let i = 0; i < volunteerOut.length; i++) {
                totalVolunteer += volunteerOut[i].time
            }
            let goodDeedCo  = volunteer.goodDeedCo || []
            for(let i = 0; i < goodDeedCo.length; i ++) {
                serviceDedication += goodDeedCo[i].score
            }
            
           
            const MAX_HOUR = 20//工时超过20，计算方式改变
            //postman测试 需要转化类型
            // volunteer = Number(volunteer)
            // goodDeedCo = parseInt(goodDeedCo)
            // goodDeedSc = parseInt(goodDeedSc)
            // volunCountry = parseInt(volunCountry)
            // volunProvince = parseInt(volunProvince)
            if(totalVolunteer <= MAX_HOUR) {
                //不能直接乘0.2 可能会产生精度错误
                serviceDedication += totalVolunteer * 2 / 10
            }
            else {
                //大于20的部分向下取整  每加一个工时，分数则增加0.1
                serviceDedication += MAX_HOUR * 0.2 + Math.floor((totalVolunteer - MAX_HOUR)) * 0.1
            }
            // serviceDedication += goodDeedCo * 2 + goodDeedSc * 4
            
            //volunProvince和volunCountry部分的加分
            serviceDedication += volunteer.volunCountry + 0.5 * volunteer.volunProvince
            //总分不能超过8分
            serviceDedication = serviceDedication > MAX_SCORE_VOL? MAX_SCORE_VOL: serviceDedication
            //用于该用户更新moralityDetails文档
            const newVolun = {
                // goodDeedSc,
                // goodDeedCo,
                // volunteer,
                // volunCountry,
                // volunProvince,
                volunteer,
                deedIsSubmit: true
            }
            //用于该用户第一次创建moralityDetails文档
            const firstVolun = {
                user: userId,
                userId,
                // goodDeedSc,
                // goodDeedCo,
                // volunteer,
                // volunCountry,
                // volunProvince,
                volunteer,
                deedIsSubmit: true
            }
            //用于该用户更新finalScore文档
            const finalNewVol = {
                serviceDedication
            }
            //用于该用户第一次创建finalScore文档
            const finalFirstVol = {
                user: userId,
                userId,
                personalBasicQuality: serviceDedication,
                serviceDedication
            }
            const hasUploaded = await moralityScoreModel.findOneAndUpdate({userId}, {$set: newVolun})
            if(!hasUploaded) {
                await moralityScoreModel(firstVolun).save()
            }

            const finalScoreIsUploaded = await finalScoreModel.findOneAndUpdate({userId}, {$set: finalNewVol})
            if(!finalScoreIsUploaded) {
                await finalScoreModel(finalFirstVol).save()
            }
            else {
                let oldVolValue = finalScoreIsUploaded.serviceDedication
                finalScoreIsUploaded.personalBasicQuality += -oldVolValue + serviceDedication
                await finalScoreIsUploaded.save()
            }
        
            return res.send({
                status: 0,
                serviceDedication,
                statusInfo:{
                    message: '上传成功'
                }
            })
        }
        catch(err) {
            return res.send({
                status: 1,
                statusInfo: {
                    type: "SERVER_ERROR",
                    message: err.message
                }
            })
        }
    }

    //post
    //学生上传 德育分-遵纪守法加减分
    async uploadObedience(req, res) {
        const userId = req.session.user._id
        // let { probation = 0, demerit = 0, seriousAdmonish = 0,
        //         admonish = 0, criticismSc = 0, criticismCo = 0, praiseSc = 0,
        //         praiseCo = 0} = req.body
        let { obey } = req.body
        //判断参数是否都为0或正整数
        // const reg = /^\d+$/
        try {
            if(userId != req.params.userId) {
                throw Error("userId错误")
            }
            // if(!reg.test(probation) || !reg.test(demerit) || !reg.test(seriousAdmonish) ||
            //     !reg.test(admonish) || !reg.test(criticismSc) || !reg.test(criticismCo)||
            //     !reg.test(praiseCo) || !reg.test(praiseSc)) {
            //         throw Error("参数格式错误")
            // }
            //postman测试时，将参数转化成数字
            // probation = Number(probation)
            // demerit = Number(demerit)
            // seriousAdmonish = Number(seriousAdmonish)
            // admonish = Number(admonish)
            // criticismCo = Number(criticismCo)
            // criticismSc = Number(criticismSc)
            // praiseCo = Number(praiseCo)
            // praiseSc = Number(praiseSc)
        } catch(err) {
            return res.send({
                status: 1,
                statusInfo: {
                    type: 'UPLOAD_ERROR',
                    message: err.message
                }
            })
        }
        try {
            // const finalDoc = finalScoreModel.findOne({userId})
            // let oldObeyObedience = 0
            // if(finalDoc) {
            //     oldObeyObedience = finalDoc.obeyObedience
            // }
            let obeyObedience = 0
            //通报表扬当学年限加3次,优先加校级通报表扬（如果三次没加满再加院级通报表扬）
            let praise = obey.praise || []

            //将校级和院级的分开 通报表扬当学年限加3次 先计算校级的 在计算院级的
            let count = 0
            for(let i = 0; i < praise.length; i++) {
                if(praise[i].rank == '校级' && count <= 3) {
                    obeyObedience += 1
                    count++
                }
            }
            for(let i = 0; i < praise.length; i++) {
                if(praise[i].rank == '院级' && count <= 3) {
                    obeyObedience += 0.5
                    count++
                }
            }
            
            //德育素质评价分
            obeyObedience += 60 * obey.probation - 40 * obey.demerit - 20 * obey.seriousAdmonish -
                10 * obey.admonish - (obey.criticismSc - obey.praiseSc) * 1 - (obey.criticismCo - obey.praiseCo) * 0.5
            // let oldPersonalBasicQuality = 0
            // let oldObeyObedience = 0
            // const finalDoc = finalScoreModel.findOne({userId})
            // if(finalDoc) {
            //     oldObeyObedience = finalDoc.obeyObedience
            //     oldPersonalBasicQuality = finalDoc.personalBasicQuality || 0
            // }
            // let personalBasicQuality = oldPersonalBasicQuality - oldObeyObedience + obeyObedience
                //用于更新文档
            const newObedience = {
                // probation,
                // demerit,
                // seriousAdmonish,
                // admonish,
                // criticismSc,
                // criticismCo,
                // praiseSc,
                // praiseCo,
                obey,
                obedienceIsSubmit: true
            }
            //用于创建文档
            const firstObedience = {
                user: userId,
                userId,
                // probation,
                // demerit,
                // seriousAdmonish,
                // admonish,
                // criticismSc,
                // criticismCo,
                // praiseSc,
                // praiseCo,
                obey,
                obedienceIsSubmit: true
            }


            //用于更新finalScore文档
            const finalNewObedience = {
                obeyObedience
            }
            //用于创建finalScore文档
            const finalFirstObedience = {
                user: userId,
                userId,
                personalBasicQuality: obeyObedience,
                obeyObedience
            }
            const hasUploaded = await moralityScoreModel.findOneAndUpdate({userId}, {$set: newObedience})
            if(!hasUploaded) {
                await moralityScoreModel(firstObedience).save()
            }
            const finalScoreIsUploaded = await finalScoreModel.findOneAndUpdate({userId}, {$set: finalNewObedience})
            if(!finalScoreIsUploaded) {
                await finalScoreModel(finalFirstObedience).save()
            }
            else {
                let oldObeValue = finalScoreIsUploaded.obeyObedience
                finalScoreIsUploaded.personalBasicQuality += -oldObeValue + obeyObedience
                await finalScoreIsUploaded.save()
            }
            res.send({
                status: 0,
                obeyObedience,
                statusInfo: {
                    message: '上传成功'
                }
            })
        } catch(err) {
            return res.send({
                status: 1,
                statusInfo: {
                    type: 'SERVER_ERROR',
                    message: err.message
                }
            })
        }
    }

    //post
    //学生上传创新创业 认证类考试 上传的数组最好先去重
    async uploadInnovation(req, res) {
        // console.log(req.body.techCompetition[0])
        const userId = req.session.user._id
        //let computerExamArr = req.body
        let { techCompetition = [], computerExamArr = [], engExamArr = [], otherArr = [], academicPaper = []} = req.body
        try {
            if(userId != req.params.userId) {
                throw Error("userId错误")
            }
            //如果没有上传数据直接返回
            if(techCompetition.length == 0 && computerExamArr.length == 0 && engExamArr.length == 0 && otherArr.length == 0 && 
                academicPaper.length == 0) {
                return res.send({
                    status: 0,
                    statusInfo: {
                        message: '无数据上传'
                    }
                })
            }
            const isArr = Object.prototype.toString
            //上传的数据类型必须为数组
            if((computerExamArr && isArr.call(computerExamArr) != "[object Array]") ||
                (engExamArr && isArr.call(engExamArr) != "[object Array]") ||
                    (otherArr && isArr.call(otherArr) != "[object Array]") ||
                        (academicPaper && isArr.call(academicPaper) != "[object Array]") ||
                            (techCompetition && isArr.call(techCompetition) != "[object Array]"))
            {
                throw Error("参数格式错误")
            }

            
            if(computerExamArr.length != 0) {
                for(let i = 0; i < computerExamArr.length; i++) {
                    if(computerExamArr[i].name == "全国计算机等级考试") {
                        if(!/^(2|0.5|0)$/.test(computerExamArr[i].points)) {
                            throw Error("全国计算机等级考试的参数格式错误")
                        }
                    }
                    //程序员、软件设计师、网络工程师等考试参加加0.5分 通过加3分
                    else {
                        if(!/^(3|2|0.5|0)$/.test(computerExamArr[i].points)) {
                            throw Error("计算机类专业参数格式错误")
                        }
                    }
                }
            }
            if(engExamArr.length != 0) {
                for(let i = 0; i < engExamArr.length; i++) {
                    if(/^(英语四级|英语六级|英语4级|英语6级)$/.test(engExamArr[i].name)) {
                        if(engExamArr.points > 750 || engExamArr.points < 0) {
                            throw Error("英语四六级的参数格式错误")
                        }
                    }
                    else {
                        if(!/^(2|5)$/.test(engExamArr[i].points)) {
                            throw Error("英语专业类参数格式错误")
                        }
                    }
                }
            }
            if(otherArr.length != 0) {
                for(let i = 0; i < otherArr.length; i++) {
                    if(!/^(1|0.25)$/.test(otherArr[i].points)) {
                        throw Error("其它专业类参数格式错误")
                    }
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
            let repeatedInfo = ""
            let unfinishInfo = ""
            //*删除名称为空的项
            //postman测试 添加属性值
            for(let i = 0; i < techCompetition.length; i ++) {
                if(techCompetition[i].name == '' || techCompetition[i].job == '') {
                    techCompetition.splice(i, 1)
                    i--
                    unfinishInfo += " (科技竞赛中有项目有未补充完整的 请仔细检查（该项数据库中没进行保存）)"
                }
                else {
                    techCompetition[i].requireCerti = techCompetition[i].requireCerti || true
                    techCompetition[i].requiredInfo = techCompetition[i].requiredInfo || "待提交"
            
                }
            }
            for(let i = 0; i < computerExamArr.length; i++) {
                if(computerExamArr[i].name == '') {
                    computerExamArr.splice(i, 1)
                    i--
                    unfinishInfo += " (计算机专业类中有项目有未补充完整的 请仔细检查（该项数据库中没进行保存）)"
                }
                else {
                    computerExamArr[i].requireCerti = computerExamArr[i].requireCerti || true
                    computerExamArr[i].requiredInfo = computerExamArr[i].requiredInfo || "待提交"
            
                }
            }
            for(let i = 0; i < engExamArr.length; i++) {
                if(engExamArr[i].name == '') {
                    engExamArr.splice(i, 1)
                    i--
                    unfinishInfo += " (英语专业类中有项目有未补充完整的 请仔细检查（该项数据库中没进行保存）)"
                }
                else{
                    engExamArr[i].requireCerti = engExamArr[i].requireCerti || true
                    engExamArr[i].requiredInfo = engExamArr[i].requiredInfo || "待提交"
                }
            }
            for(let i = 0; i < otherArr.length; i++) {
                if(otherArr[i].name == '' || otherArr[i].points == 0) {
                    otherArr.splice(i, 1)
                    i--
                    unfinishInfo += " (其他类专业中有项目有未补充完整的 请仔细检查（该项数据库中没进行保存）)"
                }
                else {
                    otherArr[i].requireCerti = otherArr[i].requireCerti || true
                    otherArr[i].requiredInfo = otherArr[i].requiredInfo || "待提交"
                }
            }
            for(let i = 0; i < academicPaper.length; i++) {
                if(academicPaper[i].name == '' || academicPaper[i].level == '') {
                    academicPaper.splice(i, 1)
                    i--
                    unfinishInfo += " (学术论文与发表专利中有项目有未补充完整的 请仔细检查（该项数据库中没进行保存）)"
                }
                else {
                    academicPaper[i].requireCerti = academicPaper[i].requireCerti || true
                    academicPaper[i].requiredInfo = academicPaper[i].requiredInfo || "待提交"
                }
            }
            for(let i = 0; i < techCompetition.length; i ++) {
                for(let j = i; j < techCompetition.length; j ++) {
                    if(i != j && techCompetition[i].name == techCompetition[j].name &&
                        techCompetition[i].requireCerti == techCompetition[j].requireCerti &&
                            techCompetition[i].requiredInfo == techCompetition[j].requiredInfo) 
                        {
                            repeatedInfo += " <上传了同名的科技竞赛竞赛项目 后一项(若干项)已自动删除>"
                            techCompetition.splice(j,1)
                            j--
                        }
                }
            }
            //上传数组去重
            for(let i = 0; i < computerExamArr.length; i ++) {
                for(let j = i; j < computerExamArr.length; j ++) {
                    if(i != j && computerExamArr[i].name == computerExamArr[j].name &&
                            computerExamArr[i].requireCerti == computerExamArr[j].requireCerti &&
                                computerExamArr[i].requiredInfo == computerExamArr[j].requiredInfo) 
                        {
                            repeatedInfo += " <上传了同名的计算机专业的竞赛项目 后一项(若干项)已自动删除>"
                            computerExamArr.splice(j,1)
                            j--
                        }
                }
            }
            for(let i = 0; i < engExamArr.length; i ++) {
                for(let j = i; j < engExamArr.length; j ++) {
                    if(i != j && engExamArr[i].name == engExamArr[j].name &&
                            engExamArr[i].requireCerti == engExamArr[j].requireCerti &&
                                engExamArr[i].requiredInfo == engExamArr[j].requiredInfo) 
                        {
                            
                            repeatedInfo += " <上传了同名的英语专业类竞赛项目 后一项(若干项)已自动删除>"
                            engExamArr.splice(j,1)
                            j--
                        }
                }
            }
            for(let i = 0; i < otherArr.length; i ++) {
                for(let j = i; j < otherArr.length; j ++) {
                    if(i != j && otherArr[i].name == otherArr[j].name &&
                            otherArr[i].requireCerti == otherArr[j].requireCerti &&
                                otherArr[i].requiredInfo == otherArr[j].requiredInfo) 
                        {
                            repeatedInfo += " <上传了同名的其他专业类的竞赛项目 后一项(若干项)已自动删除>"
                            otherArr.splice(j,1)
                            j--
                        }
                }
            }
            for(let i = 0; i < academicPaper.length; i ++) {
                for(let j = i; j < academicPaper.length; j ++) {
                    if(i != j && academicPaper[i].name == academicPaper[j].name &&
                        academicPaper[i].requireCerti == academicPaper[j].requireCerti &&
                            academicPaper[i].repeatedInfo == academicPaper[j].repeatedInfo)
                    {
                        repeatedInfo += " <上传了同名的学术论文发表与专利 后一项(若干项)已自动删除>"
                        academicPaper.splice(j,1)
                        j--
                    }
                }
            }
            
            //初始化获得的总分 从finalScore中获取certificationExam的分数
            let examScore = 0
            const finalCreated = await finalScoreModel.findOne({userId})
            if(finalCreated) {
                examScore = finalCreated.certificationExam
            }
            let doc = await innovationScoreModel.findOne({userId})
            if(doc) {
                if(techCompetition.length != 0) {
                
                    // let doc = await innovationScoreModel.findOne({userId})
                    
                        //innvation文档已存在且techCompetition数组为空 则直接把上传的数组（去重）传入其中
                        if(doc.techCompetition.length == 0) {
                            // doc.techCompetition = techCompetition
                            // console.log(doc.techCompetition)
                            // doc.markModified("techCompetition")
                            // await doc.save()
                            await innovationScoreModel.findOneAndUpdate({ userId }, { $push: {techCompetition: { $each: techCompetition }} })
                            
                        }
                        else {
                            for(let index = 0; index < techCompetition.length; index++) {
                                let techCompetitionDoc = doc.techCompetition
                                const length = techCompetitionDoc.length
                                for(let i = 0; i < length; i++) {
                                    if(techCompetitionDoc[i].id == techCompetition[index].id) {
                                        //更新分数   去掉以前的分数 加上更新的分数
                                        // examScore += -techCompetitionDoc[i].points + techCompetition[index].points
                                        doc.techCompetition[i].name = techCompetition[index].name
                                        doc.techCompetition[i].job = techCompetition[index].job
                                        doc.techCompetition[i].requireCerti = techCompetition[index].requireCerti
                                        doc.techCompetition[i].requiredInfo = techCompetition[index].requiredInfo
                                        doc.markModified("techCompetition[i].examName")
                                        doc.markModified("techCompetition[i].points")
                                        doc.markModified("techCompetition[i].requireCerti")
                                        doc.markModified("techCompetition[i].requiredInfo")
                                        await doc.save()
                                        break
                                    }
                                    // else if(techCompetitionDoc[i].name == techCompetition[index].name) {
                                    //     //内容相同的项目直接跳过
                                    //     if(techCompetitionDoc[i].job == techCompetition[index].job &&
                                    //         techCompetitionDoc[i].requireCerti == techCompetition[index].requireCerti &&
                                    //             techCompetitionDoc[i].requiredInfo == techCompetition[index].requiredInfo) 
                                    //     {
                                    //         // doc.techCompetition[i].id = techCompetition[i].id
                                    //         // doc.markModified("techCompetition[i].id")
                                    //         // await doc.save()
                                    //         break
                                    //     }
                                    //     //如果上传 同名比赛且和数据库中内容不同 则在数据库中进行修改
                                    //     else{
                                    //         // examScore += -computerExam[i].points + computerExamArr[index].points
                                    //         // doc.techCompetition[i].id = computerExamArr[i].id
                                    //         doc.techCompetition[i].job = techCompetition[index].job
                                    //         doc.techCompetition[i].requireCerti = techCompetition[index].requireCerti
                                    //         doc.techCompetition[i].requiredInfo = techCompetition[index].requiredInfo
                                    //         // doc.markModified("techCompetition[i].id")
                                    //         doc.markModified("techCompetition[i].points")
                                    //         doc.markModified("techCompetition[i].requireCerti")
                                    //         doc.markModified("techCompetition[i].requiredInfo")
                                    //         await doc.save()
                                    //         break
                                    //     }
                                    // }
                                    
                                    //如果数据库中不存在相同id的，则在computerExam数组中添加该项
                                    else {
                                        if(i == length - 1) {
                                            // examScore += computerExamArr[index].points
                                            await innovationScoreModel.findOneAndUpdate({userId}, {$push: {techCompetition: techCompetition[index]}})
                                        }
                                    }
                                }
                            }
                        }
                    
                }   
                if(computerExamArr.length != 0) {
                    // let doc = await innovationScoreModel.findOne({userId})
                    
                        //innvation文档已存在且computerExam数组为空 则直接把上传的数组（去重）传入其中
                        if(doc.computerExam.length == 0) {
                            for(let i = 0; i < computerExamArr.length; i++) {
                                examScore += computerExamArr[i].points
                            }
                            await innovationScoreModel.findOneAndUpdate({userId}, {$push: {computerExam: { $each: computerExamArr }}})
                            // doc.computerExam = computerExamArr
                            // doc.markModified("computerExam")
                            // await doc.save()
                        }
                        else {
                            for(let index = 0; index < computerExamArr.length; index++) {
                                let computerExam = doc.computerExam
                                const length = computerExam.length
                                for(let i = 0; i < length; i++) {
                                    if(computerExam[i].id == computerExamArr[index].id) {
                                        //更新分数   去掉以前的分数 加上更新的分数
                                        examScore += -computerExam[i].points + computerExamArr[index].points
                                        doc.computerExam[i].name = computerExamArr[index].name
                                        doc.computerExam[i].points = computerExamArr[index].points
                                        doc.computerExam[i].requireCerti = computerExamArr[index].requireCerti
                                        doc.computerExam[i].requiredInfo = computerExamArr[index].requiredInfo
                                        doc.markModified("computerExam[i].name")
                                        doc.markModified("computerExam[i].points")
                                        doc.markModified("computerExam[i].requireCerti")
                                        doc.markModified("computerExam[i].requiredInfo")
                                        await doc.save()
                                        break
                                    }
                                    // else if(computerExam[i].examName == computerExamArr[index].examName) {
                                    //     //内容相同的项目直接跳过
                                    //     if(computerExam[i].points == computerExamArr[index].points &&
                                    //         computerExam[i].requireCerti == computerExamArr[index].requireCerti &&
                                    //             computerExam[i].requiredInfo == computerExamArr[index].requiredInfo) 
                                    //     {
                                    //         // doc.computerExam[i].id = computerExamArr[i].id
                                    //         // doc.markModified("computerExam[i].id")
                                    //         // await doc.save()
                                    //         break
                                    //     }
                                    //     //如果上传 同名比赛且和数据库中内容不同 则在数据库中进行修改
                                    //     else{
                                    //         examScore += -computerExam[i].points + computerExamArr[index].points
                                    //         // doc.computerExam[i].id = computerExamArr[i].id
                                    //         doc.computerExam[i].points = computerExamArr[index].points
                                    //         doc.computerExam[i].requireCerti = computerExamArr[index].requireCerti
                                    //         doc.computerExam[i].requiredInfo = computerExamArr[index].requiredInfo
                                    //         // doc.markModified("computerExam[i].id")
                                    //         doc.markModified("computerExam[i].points")
                                    //         doc.markModified("computerExam[i].requireCerti")
                                    //         doc.markModified("computerExam[i].requiredInfo")
                                    //         await doc.save()
                                    //         break
                                    //     }
                                    // }
                                    
                                    //如果数据库中不存在相同id的，则在computerExam数组中添加该项
                                    else {
                                        if(i == length - 1) {
                                            examScore += computerExamArr[index].points
                                            await innovationScoreModel.findOneAndUpdate({userId}, {$push: {computerExam: computerExamArr[index]}})
                                        }
                                    }
                                }
                            }
                        }
                    
                }
                if(engExamArr.length != 0) {
                    // let doc = await innovationScoreModel.findOne({userId})
                        //innvation文档已存在且englishExam数组为空 则直接把上传的数组（去重）传入其中
                        if(doc.englishExam.length == 0) {
                            //上传的数组计算分数
                            for(let i = 0; i < engExamArr.length; i++) {
                                // examScore += getPoints(engExamArr[i])
                                examScore += Points.getCETPoints(engExamArr[i])
                            }
                            await innovationScoreModel.findOneAndUpdate({userId}, {$push: {englishExam: {$each: engExamArr}}})
                            // doc.englishExam = engExamArr
                            // doc.markModified("englishExam")
                            // await doc.save()
                        }
                        else {
                            for(let index = 0; index < engExamArr.length; index++) {
                                let englishExam = doc.englishExam
                                const length = englishExam.length
                                for(let i = 0; i < length; i++) {
                                    if(englishExam[i].id == engExamArr[index].id) {
                                        
                                        //更新分数   去掉以前的分数 加上更新的分数
                                        examScore += -Points.getCETPoints(englishExam[i]) + Points.getCETPoints(engExamArr[index])
                                        doc.englishExam[i].name = engExamArr[index].name
                                        doc.englishExam[i].points = engExamArr[index].points
                                        doc.englishExam[i].requireCerti = engExamArr[index].requireCerti
                                        doc.englishExam[i].requiredInfo = engExamArr[index].requiredInfo
                                        doc.markModified("englishExam[i].name")
                                        doc.markModified("englishExam[i].points")
                                        doc.markModified("englishExam[i].requireCerti")
                                        doc.markModified("englishExam[i].requiredInfo")
                                        await doc.save()
                                        break
                                    }
                                    // else if(englishExam[i].examName == engExamArr[index].examName)
                                    // {
                                    //     if(englishExam[i].points == engExamArr[index].points &&
                                    //             englishExam[i].requireCerti == engExamArr[index].requireCerti &&
                                    //                 englishExam[i].requiredInfo == engExamArr[index].requiredInfo)
                                    //     {
                                            
                                    //         // doc.englishExam[i].id = engExamArr[i].id
                                    //         // doc.markModified('englishExam[i].id')
                                    //         // await doc.save()
                                        
                                    //         break
                                    //     }
                                    //     else {
                                    //         // examScore += -getPoints(englishExam[i]) + getPoints(engExamArr[index])
                                    //         examScore += -Points.getCETPoints(englishExam[i]) + Points.getCETPoints(engExamArr[index])
                                    //         // doc.englishExam[i].id = engExamArr[index].id
                                    //         doc.englishExam[i].points = engExamArr[index].points
                                    //         doc.englishExam[i].requireCerti = engExamArr[index].requireCerti
                                    //         doc.englishExam[i].requiredInfo = engExamArr[index].requiredInfo
                                    //         // doc.markModified("englishExam[i].id")
                                    //         doc.markModified("englishExam[i].points")
                                    //         doc.markModified("englishExam[i].requireCerti")
                                    //         doc.markModified("englishExam[i].requiredInfo")
                                    //         await doc.save()
                                    //         break
                                    //     }
                                    // }
                                    
                                    //如果数据库中不存在相同id的，则在englishExam数组中添加该项
                                    else {
                                        if(i == length - 1) {
                                            examScore += Points.getCETPoints(engExamArr[index])
                                            await innovationScoreModel.findOneAndUpdate({userId}, {$push: {englishExam: engExamArr[index]}})
                                        }
                                    }
                                }
                            }
                        }
                }
                if(otherArr.length != 0) {
                    // let doc = await innovationScoreModel.findOne({userId})
                    
                        //innvation文档已存在且otherExam数组为空 则直接把上传的数组（去重）传入其中
                        if(doc.otherExam.length == 0) {
                            for(let i = 0; i < otherArr.length; i++) {
                                examScore += otherArr[i].points
                            }
                            await innovationScoreModel.findOneAndUpdate({userId}, {$push: {otherExam:{$each: otherArr}}})
                            // doc.otherExam = otherArr
                            // doc.markModified("otherExam")
                            // await doc.save()
                        }
                        else {
                            for(let index = 0; index < otherArr.length; index++) {
                                let otherExam = doc.otherExam
                                const length = otherExam.length
                                for(let i = 0; i < length; i++) {
                                    //id相同的    修改数据库中的项
                                    if(otherExam[i].id == otherArr[index].id) {
                                        //更新分数   去掉以前的分数 加上更新的分数
                                        examScore += -otherExam[i].points + otherArr[index].points
                                        doc.otherExam[i].name = otherArr[index].name
                                        doc.otherExam[i].points = otherArr[index].points
                                        doc.otherExam[i].requireCerti = otherArr[index].requireCerti
                                        doc.otherExam[i].requiredInfo = otherArr[index].requiredInfo
                                        doc.markModified("otherExam[i].name")
                                        doc.markModified("otherExam[i].points")
                                        doc.markModified("otherExam[i].requireCerti")
                                        doc.markModified("otherExam[i].requiredInfo")
                                        await doc.save()
                                        break
                                    }
                                    //数据库中存在和上传数据中名称一样的项  修改数据库中的项
                                    // else if(otherExam[i].examName == otherArr[index].examName) {
                                    //     //内容相同的项目直接跳过
                                    //     if(otherExam[i].points == otherArr[index].points &&
                                    //         otherExam[i].requireCerti == otherArr[index].requireCerti &&
                                    //             otherExam[i].requiredInfo == otherArr[index].requiredInfo) 
                                    //     {
                                    //         // doc.otherExam[i].id = otherArr[i].id
                                    //         // doc.markModified("otherExam[i].id")
                                    //         // await doc.save()
                                    //         break
                                    //     }
                                    //     //如果上传 同名比赛且和数据库中内容不同 则在数据库中进行修改
                                    //     else {
                                    //         examScore += -otherExam[i].points + otherArr[index].points
                                    //         // doc.otherExam[i].id = otherArr[i].id
                                    //         doc.otherExam[i].points = otherArr[index].points
                                    //         doc.otherExam[i].requireCerti = otherArr[index].requireCerti
                                    //         doc.otherExam[i].requiredInfo = otherArr[index].requiredInfo
                                    //         // doc.markModified("otherExam[i].id")
                                    //         doc.markModified("otherExam[i].points")
                                    //         doc.markModified("otherExam[i].requireCerti")
                                    //         doc.markModified("otherExam[i].requiredInfo")
                                    //         await doc.save()
                                    //         break
                                    //     }
                                    // }
                                    
                                    //如果数据库中不存在相同id的，则在computerExam数组中添加该项
                                    else {
                                        if(i == length - 1) {
                                            examScore += otherArr[index].points
                                            await innovationScoreModel.findOneAndUpdate({userId}, {$push: {otherExam: otherArr[index]}})
                                        }
                                    }
                                }
                            }
                        }
                    
                }
                if(academicPaper.length != 0) {
                    // let doc = await innovationScoreModel.findOne({userId})
                    
                        //innvation文档已存在且computerExam数组为空 则直接把上传的数组（去重）传入其中
                        if(doc.academicPaper.length == 0) {
                            // for(let i = 0; i < academicPaper.length; i++) {
                            //     academicPaper += academicPaper[i].points
                            // }
                            await innovationScoreModel.findOneAndUpdate({userId}, {$push: {academicPaper: {$each: academicPaper}}})
                            // doc.academicPaper = academicPaper
                            // doc.markModified("academicPaper")
                            // await doc.save()
                        }
                        else {
                            for(let index = 0; index < academicPaper.length; index++) {
                                let academicPaperDoc = doc.academicPaper
                                const length = academicPaperDoc.length
                                for(let i = 0; i < length; i++) {
                                    //id相同的    修改数据库中的项
                                    if(academicPaperDoc[i].id == academicPaper[index].id) {
                                        //更新分数   去掉以前的分数 加上更新的分数
                                        // examScore += -otherExam[i].points + otherArr[index].points
                                        doc.academicPaper[i].name = academicPaper[index].name
                                        doc.academicPaper[i].level = academicPaper[index].level
                                        doc.academicPaper[i].requireCerti = academicPaper[index].requireCerti
                                        doc.academicPaper[i].requiredInfo = academicPaper[index].requiredInfo
                                        doc.markModified("academicPaper[i].name")
                                        doc.markModified("academicPaper[i].level")
                                        doc.markModified("academicPaper[i].requireCerti")
                                        doc.markModified("academicPaper[i].requiredInfo")
                                        await doc.save()
                                        break
                                    }
                                    //数据库中存在和上传数据中名称一样的项  修改数据库中的项
                                    // else if(academicPaperDoc[i].name == academicPaper[index].name) {
                                    //     //内容相同的项目直接跳过
                                    //     if(academicPaperDoc[i].level == academicPaper[index].level &&
                                    //         academicPaperDoc[i].requireCerti == academicPaper[index].requireCerti &&
                                    //             academicPaperDoc[i].requiredInfo == academicPaper[index].requiredInfo) 
                                    //     {
                                    //         // doc.academicPaper[i].id = academicPaper[index].id
                                    //         // doc.markModified("academicPaper[i].id")
                                    //         // doc.save()
                                    //         break
                                    //     }
                                    //     //如果上传 同名比赛且和数据库中内容不同 则在数据库中进行修改
                                    //     else {
                                    //         // examScore += -otherExam[i].points + otherArr[index].points
                                    //         // doc.academicPaper[i].id = academicPaper[index].id
                                    //         doc.academicPaper[i].level = academicPaper[index].level
                                    //         doc.academicPaper[i].requireCerti = academicPaper[index].requireCerti
                                    //         doc.academicPaper[i].requiredInfo = academicPaper[index].requiredInfo
                                    //         // doc.markModified("academicPaper[i].id")
                                    //         doc.markModified("academicPaper[i].level")
                                    //         doc.markModified("academicPaper[i].requireCerti")
                                    //         doc.markModified("academicPaper[i].requiredInfo")
                                    //         await doc.save()
                                    //         break
                                    //     }
                                    // }
                                    
                                    //如果数据库中不存在相同id的，则在computerExam数组中添加该项
                                    else {
                                        if(i == length - 1) {
                                            // examScore += otherArr[index].points
                                            await innovationScoreModel.findOneAndUpdate({userId}, {$push: {academicPaper: academicPaper[index]}})
                                        }
                                    }
                                }
                            }
                        }
                    
                }
            }
            else {
                let firstInn = {
                    user: userId,
                    userId,
                    techCompetition,
                    computerExam: computerExamArr,
                    englishExam: engExamArr,
                    otherExam: otherArr,
                    academicPaper
                }
                await innovationScoreModel(firstInn).save()
            }
        
            
            
            //创建finalScore文档
            const firstFS = {
                user: userId,
                userId,
                certificationExam: examScore,
            }
            //更新finalScore文档
            const updataFS = {
                certificationExam: examScore
            }
            const hasUploaded = await finalScoreModel.findOneAndUpdate({userId}, {$set: updataFS})
            if(!hasUploaded) {
                await finalScoreModel(firstFS).save()
            }
            
            return res.send({
                status: 0,
                examScore,
                //repeatedInfo返回是否上传了同名的认证考试项目
                statusInfo: {
                    message: '上传成功' + repeatedInfo + unfinishInfo
                }
            })
        }
        catch(err) {
            return res.send({
                status: 1,
                statusInfo: {
                    type: 'SERVER_ERROR',
                    message: err.message
                }
            })
        }
    }

    //post
    //学生上传社会实践能力分数
    async uploadSocialPractice(req, res) {
        const userId = req.session.user._id
        let { socialPracTeam = 0, teamJob = 0, provinExceVol = 0, provinObjVol = 0,
                scExceVol = 0, scObjVol = 0} = req.body
        try {
            if(userId != req.session.user._id) {
                throw Error("userId参数错误")
            }
            const reg = /^\d+$/  //匹配正整数
            if(!/^(4|2|1|0.5|0)$/.test(socialPracTeam) || !/^(1|0.5|0)$/.test(teamJob) ||
                !reg.test(provinExceVol) || !reg.test(provinObjVol) || !reg.test(scExceVol) ||
                !reg.test(scObjVol)) {
                    throw Error('上传参数格式错误')
                }
                provinExceVol = Number(provinExceVol)
                provinObjVol = Number(provinObjVol)
                scExceVol = Number(scExceVol)
                scObjVol = Number(scObjVol)
                socialPracTeam = Number(socialPracTeam)
                teamJob = Number(teamJob)
        } catch(err) {
            res.send({
                status: 1,
                statusInfo: {
                    type: 'UPLOAD_ERROR',
                    message: err.message
                }
            })
        }

        try {
            const totalScore = socialPracTeam * teamJob + provinObjVol * 3 + 
                provinExceVol * 4 + scExceVol * 2 + scObjVol
            const newSP = {
                socialPracTeam,
                teamJob,
                provinExceVol,
                provinObjVol,
                scExceVol,
                scObjVol
            }
            const firstSP = {
                user: userId,
                userId,
                socialPracTeam,
                teamJob,
                provinExceVol,
                provinObjVol,
                scExceVol,
                scObjVol
            }
            const newFinal = {
                socialPractice: totalScore
            }
            const firstFinal = {
                user: userId,
                userId,
                socialPractice: totalScore
            }
            const hasUploaded = await socialPracModel.findOneAndUpdate({userId}, {$set: newSP})
            if(!hasUploaded) {
                await socialPracModel(firstSP).save()
            }
            const finalScoreIsUploaded = await finalScoreModel.findOneAndUpdate({userId}, {$set: newFinal})
            if(!finalScoreIsUploaded) {
                await finalScoreModel(firstFinal).save()
            }
            res.send({
                status: 0,
                totalScore,
                statusInfo: {
                    message: '上传成功'
                }
            })
        } catch(err) {
            res.send({
                status: 1,
                statusInfo: {
                    type: 'SERVER_ERROR',
                    message: err.message
                }
            })
        }
    }

    //post
    //学生上传社会工作能力
    async uploadSocialWork(req, res) {
        let { workList = [], titleList = [] } = req.body
        const userId = req.session.user._id
        try {
            if(userId != req.params.userId) {
                throw Error("userId错误")
            }
            const isArr = Object.prototype.toString
            //判断上传的数据是否为数组
            if(!isArr.call(workList) || !isArr.call(titleList)) {
                throw Error('参数格式错误')
            }
            if(workList.length == 0 && titleList.length == 0) {
                res.send({
                    status: 0,
                    statusInfo: {
                        message: '无数据上传'
                    }
                })
            }
        } catch(err) {
            return res.send({
                status: 1,
                statusInfo: {
                    type: 'UPLOAD_ERROR',
                    message: err.message
                }
            })
        }

        try{
            let repeatedInfo = "无重复项"
            //数组去重
            for(let i = 0; i < workList.length; i ++) {
                for(let j = i; j < workList.length; j ++) {
                    if(i != j && workList[i].teamJob == workList[j].teamJob &&
                        workList[i].teamName == workList[j].teamName) 
                    {
                        repeatedInfo = "重复上传了相同的任职 已自动删除后一项(若干项)"
                        workList.splice(j,1)
                        j--
                    }
                }
            }
            //上传的数组去重  名字相同的删除
            for(let i = 0; i < titleList.length; i ++) {
                for(let j = i; j < titleList.length; j ++) {
                    if(i != j && titleList[i].titleName == titleList[j].titleName &&
                            titleList[i].requireCerti == titleList[j].requireCerti &&
                                titleList[i].requiredInfo == titleList[j].requiredInfo) 
                    {
                        repeatedInfo = "重复上传了相同的荣誉称号 已自动删除后一项(若干项)"
                        titleList.splice(j,1)
                        j--
                    }
                }
            }
            //postman 测试的时候时候
            for(let i = 0; i < workList.length; i++) {
                if(workList[i].teamName == '' || workList[i].teamJob == '') {
                    workList.splice(i, 1)
                    i--
                }
                else {
                    workList[i].workTime = workList[i].workTime || 0
                    workList[i].requireCerti = workList[i].requireCerti || true
                    workList[i].requiredInfo = workList[i].requiredInfo || "待提交"
                    workList[i].teamPrise = workList[i].teamPrise || "无"
                }
            }
                            
            for(let i = 0; i < titleList.length; i++) {
                if(titleList[i].titleName == '') {
                    titleList.splice(i, 1)
                    i--
                }
                else {
                    titleList[i].requireCerti = titleList[i].requireCerti || true
                    titleList[i].requiredInfo = titleList[i].requiredInfo || "待提交"
                }
            }
            const firstWork = {
                    user: userId,
                    userId,
                    workList,
                    titleList
                }
            let doc = await socialWorkModel.findOne({userId})
            //如果已经创建过了socialWork文档 则对它进行update
            //workList最好先去重
            //如果socialWork文档已经存在
            if(doc) {
                if(workList.length !== 0) {
                
                
                
                    //如果文档中workList数组长度为0，则将上传的数组的项直接全都放入文档中的workList
                    if(doc.workList.length == 0) {
                        await socialWorkModel.findOneAndUpdate({userId}, {$push: {workList: {$each: workList}}})
                        // doc.workList = workList
                        // doc.markModified("workList")
                        // await doc.save()
                    }
                    else {
                        //上传的数据一项一项都检查是否有和数据库中有相同id的
                        for(let index = 0; index < workList.length; index++) {
                            const length = doc.workList.length
                            for(let i = 0; i < length; i++) {
                                //如果上传了和数据库中同名的任职
                                if(doc.workList[i].teamJob == workList[index].teamJob &&
                                        doc.workList[i].teamName == workList[index].teamName ) 
                                {
                                    //略过完全相同的项
                                    if(doc.workList[i].workTime == workList[index].workTime &&
                                            doc.workList[i].requireCerti == workList[index].requireCerti &&
                                                 doc.workList[i].requiredInfo == workList[index].requiredInfo &&
                                                    doc.workList[i].workPerFirst == workList[index].workPerFirst &&
                                                        doc.workList[i].workPerSecond == workList[index].workPerSecond &&
                                                            doc.workList[i].teamPrise == workList[index].teamPrise)
                                    {
                                        break
                                    }
                                    //不完全相同
                                    //更新数据库中的内容
                                    else {
                                        doc.workList[i].workTime = workList[index].workTime || 0
                                        doc.workList[i].requireCerti = workList[index].requireCerti || true
                                        doc.workList[i].requiredInfo = workList[index].requiredInfo || "待提交"
                                        doc.workList[i].workPerFirst = workList[index].workPerFirst || 0
                                        doc.workList[i].workPerSecond = workList[index].workPerSecond || 0
                                        doc.workList[i].teamPrise = workList[index].teamPrise || "无"
                                        doc.markModified("workList[i].workTime")
                                        doc.markModified("workList[i].requireCerti")
                                        doc.markModified("workList[i].requiredInfo")
                                        doc.markModified("workList[i].workPerFirst")
                                        doc.markModified("workList[i].workPerSecond")
                                        doc.markModified("workList[i].teamPrise")
                                    }
                                }
                                //如果数据库中存在有相同id的workList的item  则修改该item
                                if(doc.workList[i].id == workList[index].id) {
                                    doc.workList[i].teamJob = workList[index].teamJob
                                    doc.workList[i].teamName = workList[index].teamName
                                    doc.workList[i].workTime = workList[index].workTime || 0
                                    doc.workList[i].requireCerti = workList[index].requireCerti || true
                                    doc.workList[i].requiredInfo = workList[index].requiredInfo || "待提交"
                                    doc.workList[i].workPerFirst = workList[index].workPerFirst || 0
                                    doc.workList[i].workPerSecond = workList[index].workPerSecond || 0
                                    doc.workList[i].teamPrise = workList[index].teamPrise || "无"
                                    doc.markModified("workList[i].teamJob")
                                    doc.markModified("workList[i].teamName")
                                    doc.markModified("workList[i].workTime")
                                    doc.markModified("workList[i].requireCerti")
                                    doc.markModified("workList[i].requiredInfo")
                                    doc.markModified("workList[i].workPerFirst")
                                    doc.markModified("workList[i].workPerSecond")
                                    doc.markModified("workList[i].teamPrise")
                                    await doc.save()
                                    break
                                }
                                //如果数据库中不存在相同id的，则在workList数组中添加该项
                                else {
                                    if(i == length - 1) {
                                        await socialWorkModel.findOneAndUpdate({userId},{$push:{workList: workList[index]}})
                                        // doc.workList.push(workList[index])
                                        // doc.markModified("workList[length]")
                                        // await doc.save()
                                    }
                                }
                            }
                        }
                    }
                }
            
            //如果用户上传了titleList
                if(titleList.length !== 0) {

                // let doc = await socialWorkModel.findOne({userId})
                //如果socialWork文档已经存在
                
                    //如果文档中workList数组长度为0，则将上传的数组的项直接全都放入文档中的workList
                    if(doc.titleList.length === 0) {
                        await socialWorkModel.findOneAndUpdate({userId}, {$push: {titleList:{ $each: titleList }}})
                        // doc.titleList = titleList
                        // doc.markModified("titleList")
                        // await doc.save()
                    }
                    else {
                        //上传的数据一项一项都检查是否有和数据库中有相同id的
                        for(let index = 0; index < titleList.length; index++) {
                            const length = doc.titleList.length
                            for(let i = 0; i < length; i++) {
                                //如果重复上传相同项 则略过该项
                                if(doc.titleList[i].titleName == titleList[index].titleName &&
                                        doc.titleList[i].requireCerti == titleList[index].requireCerti &&
                                                doc.titleList[i].requiredInfo == titleList[index].requiredInfo) 
                                {
                                    break
                                }
                                //如果数据库中存在有相同id的titleList的item  则修改该item
                                if(doc.titleList[i].id == titleList[index].id) {
                                    doc.titleList[i].titleName = titleList[index].titleName
                                    doc.titleList[i].requireCerti = titleList[index].requireCerti || true
                                    doc.titleList[i].requiredInfo = titleList[index].requiredInfo || "待提交"
                                    doc.markModified("titleList[i].titleName")
                                    doc.markModified("titleList[i].requireCerti")
                                    doc.markModified("titleList[i].requiredInfo")
                                    await doc.save()
                                    break
                                }
                                //如果数据库中不存在相同id的，则在titleList数组中添加该项
                                else {
                                    if(i == length - 1) {
                                        await socialWorkModel.findOneAndUpdate({userId},{$push: {titleList: titleList[index]}})
                                        // doc.titleList.push(titleList[index])
                                        // doc.markModified("titleList[length]")
                                        // await doc.save()
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else {
                await socialWorkModel(firstWork).save()
            }
            return res.send({
                status: 0,
                repeatedInfo,
                statusInfo: {
                    message: '上传成功'
                }
            })
                
        } catch(err) {
            res.send({
                status: 1,
                statusInfo: {
                    type: "SERVER_ERROR",
                    message: err.message
                }
            })
        }
    }
    
    //post
    //学生上传文体拓展素质
    async uploadRecreation(req, res) {
        const userId = req.session.user._id
        let { morning = 0, evening = 0, activities = [] } = req.body
        try {
            if(userId != req.params.userId) {
                throw Error("userId错误")
            }
            if(0 > morning || 100 < morning || evening > 100 || evening < 0) {
                throw Error("早晚打卡参数格式错误")
            }
            if(Object.prototype.toString.call(activities) != '[object Array]') {
                throw Error("问题活动参数错误")
            }
        } catch(err) {
            res.send({
                status: 1,
                statusInfo: {
                    type: "UPLOAD_ERROR",
                    message: err.message
                }
            })
        }
        try {
            let repeatedInfo = "无重复项上传"
            //数组去除名称为空的
            for(let i = 0; i < activities.length; i ++) {
                if(activities[i].actiName == '' && activities[i].level == '') {
                    activities.splice(i, 1)
                    i--
                }
            }
            //数组去重
            for(let i = 0; i < activities.length; i ++) {
                for(let j = i; j < activities.length; j ++) {
                    if(i != j && activities[i].actiName == activities[j].actiName &&
                        activities[i].level == activities[j].level &&
                            activities[i].requireCerti == activities[j].requireCerti &&
                                activities[i].requiredInfo == activities[j].requiredInfo)
                    {
                        repeatedInfo = "上传的项目中包含重名项 已自动删除后一项(若干项)"
                        activities.splice(j, 1)
                        j--
                    }
                }
            }
            const doc = await recreationModel.findOne({userId})
            if(doc) {
                doc.morning = morning
                doc.evening = evening
                // doc.isSubmit = true
                // doc.markModified("isSubmit")
                doc.markModified("morning")
                doc.markModified("evening")
                await doc.save()
                if(doc.activities.length == 0) {
                    await recreationModel.findOneAndUpdate({userId}, {$push: {activities: {$each: activities}}})
                    // doc.activities = activities
                    // doc.markModified("activities")     
                    // await doc.save()
                }
                //如果recreation文档中activities数组不为空 则上传的数据和数据库中的数据进行比较
                //重复项不再保存 相同id的则修改数据库中的项
                else {
                    
                    for(let index = 0; index < activities.length; index ++) {
                        let activitiesDoc = doc.activities
                        const length = activitiesDoc.length
                        for(let i = 0; i < length; i ++) {
                            if(activitiesDoc[i].id == activities[index].id) {
                                doc.activities[i].actiName = activities[index].actiName
                                doc.activities[i].level = activities[index].level
                                doc.activities[i].requireCerti = activities[index].requireCerti
                                doc.activities[i].requiredInfo = activities[index].requiredInfo
                                doc.markModified("activities[i].actiName")
                                doc.markModified("activities[i].level")
                                doc.markModified("activities[i].requireCerti")
                                doc.markModified("activities[i].requiredInfo")
                            }
                            // else if(activitiesDoc[i].actiName == activities[index].actiName) {
                            //     //重复项不再保存
                            //     if(activitiesDoc[i].level == activities[index].level &&
                            //         activitiesDoc[i].requireCerti == activities[index].requireCerti &&
                            //             activitiesDoc[i].requiredInfo == activities[index].requiredInfo)
                            //     {
                            //         break
                            //     }
                            //     //假设一个活动中只能获得一个等级
                            //     else {
                            //         doc.activities[i].level = activities[index].level
                            //         doc.activities[i].requireCerti = activities[index].requireCerti
                            //         doc.activities[i].requiredInfo = activities[index].requiredInfo
                            //         doc.markModified("activities[i].level")
                            //         doc.markModified("activities[i].requireCerti")
                            //         doc.markModified("activities[i].requiredInfo")
                            //     }
                            // }
                            else {
                                //如果数据库中没有和上传数据中有冲突的项 则直接把该项添加到数据库中
                                //或者把这些先加到数组中，再把数组中的添加到数据库中
                                if(i == length - 1) {
                                    await recreationModel.findOneAndUpdate({userId}, {$push: {activities: activities[index]}})
                                }
                            }
                        }
                    }
                }
            }
            else {
                const firstRecreation = {
                    user: userId,
                    userId,
                    morning,
                    evening,
                    activities,
                    // isSubmit: true
                }
                await recreationModel(firstRecreation).save()
            }
            let score = Points.getSelfStudyPoints(morning, evening)
            let finalDoc = finalScoreModel.findOneAndUpdate({userId}, {$set: {selfStudy: score}})
            if(!finalDoc) {
                const firstFinal = {
                    user: userId,
                    userId,
                    selfStudy: score,
                }
                await finalScoreModel(firstFinal).save()
            }
            return res.send({
                status: 0,
                repeatedInfo,
                statusInfo: {
                    message: '上传成功'
                }
             })
        } catch(err) {
            res.send({
                status: 1,
                statusInfo: {
                    type: "SERVER_ERROR",
                    message: err.message
                }
            })
        }
    }
    
    

}

export default new ScoresControllers()