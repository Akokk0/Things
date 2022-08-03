const db = require('../db/index')
const bcrypt = require('bcryptjs')

//获取用户信息
exports.getUserInfo = (req, res) => {

    //res.send('ok')

    // 根据用户的 id，查询用户的基本信息
    // 注意：为了防止用户的密码泄露，需要排除 password 字段

    const sql = `select id, username, nickname, email, user_pic from ev_user where id = ?`
    db.query(sql, req.user.id, (err, result) => {

        if (err) return res.cc(err)

        if (result.length !== 0) return res.cc('获取用户信息失败！')

        res.send({

            status: 0,
            message: '获取用户基本信息成功！',
            data: result[0]

        })

    })

}

//更新用户信息
exports.updateUserInfo = (req, res) => {

    const sql = `update ev_user set ? where id = ?`

    db.query(sql, [req.body, req.body.id], (err, result) => {

        if (err) return res.cc(err)

        if (result.affectedRows !== 1) return res.cc('更新用户信息失败！')

        return res.cc('更新用户信息成功！', 0)

    })

}

//更新用户密码
exports.updatePassword = (req, res) => {

    //TODO: 更新用户密码
    const sql = `select * from ev_user where id = ?`

    db.query(sql, req.user.id, (err, result) => {

        if (err) return res.cc(err)

        if (result.length !== 1) return res.cc('用户不存在！')

        // 在头部区域导入 bcryptjs 后，
        // 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
        // compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
        const compareResult = bcrypt.compareSync(req.body.oldPwd, result[0].password)
        if (!compareResult) return res.cc('原密码错误！')

        // 密码加密
        const hashPwd = bcrypt.hashSync(req.body.newPwd, 10)
        //定义更新密码的sql语句
        const sql = `update ev_users set password = ? where id = ?`

        db.query(sql, [hashPwd, req.user.id], (err, result) => {

            if (err) return res.cc(err)

            if (result.affectedRows !== 1) return res.cc('更新密码失败！')

            return res.cc('更新密码成功！', 0)

        })

    })

}

exports.updateAvatar = (req, res) => {

    //TODO: 更新用户头像
    const sql = `update ev_user set user_pic = ? where id = ?`

    db,query(sql, [req.body.avatar, req.user.id], (err, result) => {

        if (err) return res.cc(err)

        if (result.affectedRows !== 1) return res.cc('更新头像失败！')

        return res.cc('更新头像成功！', 0)

    })

}