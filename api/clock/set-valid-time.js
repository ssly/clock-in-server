const result = require('../../utils/result');

const { success, error } = result;

async function handle(ctx) {
  const { id } = ctx.session;
  const collection = ctx.db.collection('clock_user');
  const options = { _id: id };
  const userInfo = await collection.findOne(options);
  if (userInfo === null) {
    ctx.body = error('用户不存在');
    return;
  }

  const { startTime, endTime } = ctx.request.body;
  if (!startTime || !endTime) {
    ctx.body = error('请输入正确的有效时间');
    return;
  }

  const updateItem = {
    clockCount: 0,
    continuousCount: 0,
    maxContinuousCount: 0,
    validStartTime: startTime || '05:30',
    validEndTime: endTime || '06:30',
  };

  await collection.updateOne(options, { $set: updateItem });

  ctx.body = success(true);
}

module.exports = { method: 'post', handle }