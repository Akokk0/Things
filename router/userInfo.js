const express = require('express')
const userInfoHandler = require('../router_handler/userInfo')
const expressJoi = require('@escook/express-joi')
const {update_userinfo_schema, update_password_schema, update_avatar_schema} = require('../schema/user')

const router = express.Router()

//获取用户信息的路由
router.get('/userinfo', userInfoHandler.getUserInfo)
//更新用户信息的路由
router.post('/userinfo', expressJoi(update_userinfo_schema), userInfoHandler.updateUserInfo)
//重置密码的路由
router.post('/updatepwd', expressJoi(update_password_schema), userInfoHandler.updatePassword)
//更新用户头像的路由
router.post('/updatepic', expressJoi(update_avatar_schema), userInfoHandler.updateAvatar)

module.exports = router