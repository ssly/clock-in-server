const Router = require('koa-router');

const sign = require('../utils/login');
const session = require('../utils/session');
const result = require('../utils/result');

const router = new Router();
const success = result.success;
const error = result.error;

// 只登录，不涉及用户信息
router.post('/api/login', async ctx => {
  const { code } = ctx.request.body;
  const openid = await sign.getWechatOpenid(code); // 获取 oppenid
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
});

// 更新用户信息，根据 session 找到对应 id，匹配数据
router.post('/api/login/userinfo', async ctx => {
  const body = ctx.request.body;
  const { openid } = ctx.session;
  
  const collection = ctx.db.collection('clock_user');
  const option = { openid };
  
  await collection.updateOne(option, { $set: body });
  ctx.body = success();
});

// 打卡接口，打卡后，返回用户当天最早打卡时间
router.post('/api/clock/in', async ctx => {
  const userId = String(ctx.session.id);
  const collection = ctx.db.collection(`clock_data_${userId}`);
  const clockTime = new Date();
  const todayOptions = {
    year: clockTime.getFullYear(),
    month: clockTime.getMonth() + 1,
    date: clockTime.getDate(),
  };
  const todayQuery = await collection.findOne(todayOptions);
  // 当天已经打卡
  if (todayQuery) {
    ctx.body = success({ id: todayQuery._id, clockTimestamp: todayQuery.clockTimestamp });
    return;
  }

  const insertItem = {
    year: clockTime.getFullYear(),
    month: clockTime.getMonth() + 1,
    date: clockTime.getDate(),
    clockTimestamp: clockTime.getTime(),
  };
  const res = await collection.insertOne(insertItem);
  const { _id, clockTimestamp } = res.ops[0];
  ctx.body = success({ id: _id, clockTimestamp });
});

// 获取所有打卡列表
router.get('/api/clock/info', async ctx => {
  const userId = String(ctx.session.id);
  const collection = ctx.db.collection(`clock_data_${userId}`);
  const allQuery = await collection.find().toArray();

  const clockCount = allQuery.length;
  // 需要优化可查询最近100条获取最高天数
  let clockMap = allQuery.map(v => new Date(`${v.year}-${v.month}-${v.date}`).getTime());
  clockMap = clockMap.sort((a, b) => a - b);
  let continuousCount = 0;
  for (let i = clockMap.length - 1; i > 0; i--) {
    if (clockMap[i] - clockMap[i - 1] === 86400000) {
      continuousCount += 1;
    } else {
      break;
    }
  }

  ctx.body = success({
    clockCount,
    continuousCount,
  });
});

// 查看打卡排名列表（匿名）
router.get('/api/clock/rank', async ctx => {

});

module.exports = router;