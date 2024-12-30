const fs = require('fs');
const ci = require('miniprogram-ci')
const path = require('path')
const projectPath = path.resolve(__dirname, '..')
// 获取所有小程序上传密钥文件
const privateList = fs.readdirSync(`${projectPath}/ci/privateKey`)
const uploadInfo = {
  version: '5.0.9',
  desc: '功能优化与修复bug'
}
const command = process.argv.slice(2)[0]
privateList.forEach(item => {
  let appId = item.split('.')[1] // item: private.appId.key
  // 创建项目对象
  const project = new ci.Project({
    appid: 'wx578585ca5864bb43',    // 小程序appid
    type: 'miniProgram',  // 类型，小程序或小游戏
    projectPath: "C:\Users\李文博\Desktop\miniprogram\basic", // 项目路径
    privateKeyPath: `${projectPath}/ci/privateKey/${item}`,  // 密钥路径
    ignores: ['node_modules/**/*']  // 忽略的文件
  })
  let ciFn = null
  if (command === 'upload') {
    ciFn = ci.upload({
      project,
      ...uploadInfo,
      setting: {
        es6: true, // 对应小程序开发者工具的 "es6 转 es5"
        es7: true, // 对应小程序开发者工具的 "增强编译"
        minify: true  // 是否压缩代码
      },
    })
  } else if (command === 'preview') {
    ciFn = ci.preview({
      project,
      setting: {
        es6: true, // 对应小程序开发者工具的 "es6 转 es5"
        es7: true, // 对应小程序开发者工具的 "增强编译"
      },
      qrcodeFormat: 'image',
      qrcodeOutputDest: `${projectPath}/ci/qrcode/${appId}_qrcode.jpg`,
      onProgressUpdate: console.log,
    })
  }
  // 调用
  ciFn.then(res => {
    console.log('执行成功', res)
  }).catch(error => {
    console.log('执行失败', error)
  })
})