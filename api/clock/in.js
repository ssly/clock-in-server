const result = require('../../utils/result');

const success = result.success;

async function handle(ctx) {
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
}

module.exports = { method: 'post', handle }