const config = {
    // mongo连接信息
    dbconfig: {
        //自己调试
        mongodb: 'mongodb://localhost:27017/scholarship',
        dbName : 'scholarship'
    },
    nodePort: 3000, //启动端口
    session: {
        secret: 'myblog',
        key: 'myblog',
        maxAge: 6000000
    },
}

export default config