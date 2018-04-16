export default 
function getPoints(item) {
    let points = 0
    if(/(英语四级|英语4级)/.test(item.name)) {
        //英语四级参加 加0.25分 通过加1.5分
        if(item.points >= 426) {
            points += 1.5
            //英语四级 550分以上视为优秀 加0.5分
            if(item.points >= 550) {
                points += 0.5
            }
        } else if(item.points > 0) {
            points += 0.25
        }
    }
    else if(/(英语六级|英语6级)/.test(item.name)) {
        //英语六级参加 加0.5分 通过加2.5分
        if(item.points >= 426) {
            points += 2.5
            //英语六级 520分以上视为优秀 加0.5分
            if(item.points >= 520) {
                points += 1
            }
        } else if(item.points > 0) {
            points += 0.5
        }
        //0分表示没参加  不加分
    }
    else {
        points += item.points
    }
    return points
}
