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
  
  if (userData === null) {
    const res = await collection.insertOne({ openid });
    userId = Object.keys(res.insertedIds).map(item => res.insertedIds[item]);
  } else {
    userId = userData._id;
  }

  const token = session.setSession({ id: userId, openid });
  ctx.body = success({ token });
}

module.exports = { method: 'post', handle }