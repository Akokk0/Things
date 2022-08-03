const express = require('express')
const cors = require('cors')
const userRouter = require('./router/user')
const joi = require('@hapi/joi')
const config = require('./config')
const {expressjwt: expressJWT} = require('express-jwt')
// 导入并使用用户信息路由模块
const userInfoRouter = require('./router/userInfo')

const app = express()

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(expressJWT({secret: config.jwtSecretKey, algorithms: ["HS256"]}).unless({path: [/^\/api\//]}))

app.use((req, res, next) => {

    res.cc = (err, status = 1) => {

        res.send({

            status,
            message: err instanceof Error ? err.message : err

        })

    }

    next()

})

app.use('/api', userRouter)
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my', userInfoRouter)

app.use((err, req, res, next) => {

    //数据验证失败
    if(err instanceof joi.ValidationError) return res.cc(err)

    //捕获身份认证失败的错误
    if(err.name === 'UnauthorizedError') return res.cc('身份认证失败！')

    //未知错误
    res.cc(err)

})

app.listen(80, () => {

    console.log('api server is running at http://127.0.0.1')

})