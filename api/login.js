const login = require('../utils/login');
const session = require('../utils/session');
const result = require('../utils/result');

const { success, error } = result;

// 只登录，不涉及用户信息
async function handle(ctx) {
  const { code } = ctx.request.body;
  const openid = await login.getWechatOpenid(code); // 获取 oppenid
  if (!openid) {
    ctx.body = error('登录信息错误');
    return;
  }

  let userId = '';
  const collection = ctx.db.collection('clock_user');
  const userData = await collection.findOne({ openid });
  const responseBody = {};
  if (userData === null) {
    const createTimestamp = new Date().getTime();
    const res = await collection.insertOne({ openid, createTimestamp });
    userId = res.insertedId;
  } else {
    const { nickName, avatarUrl, gender } = userData;
    userId = userData._id;
    // 如果用户授权，则返回授权信息
    if (nickName) {
      responseBody.userInfo = { nickName, avatarUrl, gender };
    }
  }

  responseBody.token = session.setSession({ id: userId, openid });
  ctx.body = success(responseBody);
}

module.exports = { method: 'post', handle }