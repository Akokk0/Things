const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

exports.regUser = (req, res) => {

    //res.send('reguser OK')

    const userInfo = req.body
    if(!userInfo.username || !userInfo.password) {

        return res.cc('用户名或密码不能为空！')

    }

    const sql = 'select * from ev_users where username = ?'
    db.query(sql, [userInfo.username], (err, result) => {

        //查询出错
        if (err) return res.cc(err)

        //已有相同用户名
        if(result.lenth > 0) {

            return res.cc('用户名被占用，请更换其他用户名！')

        }

        //加密密码
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)

        //插入新用户
        const sql = 'insert into ev_users set ?'
        db.query(sql, {username: userInfo.username, password: userInfo.password}, (err, result) => {

            if(err) return res.cc('注册用户失败，请稍后再试！')

            res.cc('注册成功！', 0)

        })

    })

}

exports.login = (req, res) => {

    //res.send('login OK')

    const userInfo = req.body

    const sql = 'select * from ev_users where username = ?'
    db.query(sql, userInfo.username, (err, result) => {

        if(err) return res.cc(err)
        if(result.length !== 1) return res.cc('登录失败！')

        const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)

        if (!compareResult) return res.cc('登录失败，密码错误！')

        const user = {...result[0], password: '', user_pic: ''}

        const tokenStr = jwt.sign(user, config.jwtSecretKey, {

            expiresIn: '10h'

        })

        res.send({

            status: 0,
            message: '登录成功!',
            token: 'Bearer ' + tokenStr

        })

    })

}