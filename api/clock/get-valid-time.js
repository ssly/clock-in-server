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

  ctx.body = success({
    startTime: userInfo.validStartTime || '',
    endTime: userInfo.validEndTime || '',
  });
}

module.exports = { method: 'get', handle }