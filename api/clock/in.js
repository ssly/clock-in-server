const result = require('../../utils/result');
const { getCurrentTime } = require('../../utils/time');

const { success, error } = result;

async function handle(ctx) {
  const { id } = ctx.session;
  const userCollection = ctx.db.collection('clock_user');
  const userInfo = await userCollection.findOne({ _id: id });
  const { validStartTime, validEndTime } = userInfo;

  const collection = ctx.db.collection(`clock_data_${String(id)}`);
  const clockTime = new Date();
  const currentTime = getCurrentTime(clockTime);

  const todayOptions = {
    year: clockTime.getFullYear(),
    month: clockTime.getMonth() + 1,
    date: clockTime.getDate(),
  };
  const todayQuery = await collection.findOne(todayOptions);
  // 当天已经打卡，则直接返回打卡记录
  if (todayQuery) {
    const { _id: id, clockTimestamp } = todayQuery;
    ctx.body = success({ id, clockTimestamp });
    return;
  }

  if (!validStartTime || !validEndTime) {
    ctx.body = error('请设置有效的打卡范围', '404');
    return; 
  }

  // 判断打卡时间是否有效
  if (!isValidTime(currentTime, [validStartTime, validEndTime])) {
    ctx.body = error('不在打卡有效时间内');
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

/**
 * 判断时间是否某一个区间
 * @param {string} time 需要判断的时间
 * @param {array} timeRange 区间
 * @returns {boolean}
 */
function isValidTime(time, timeRange) {
  if (!Array.isArray(timeRange) || timeRange.length !== 2) {
    return false;
  }
  if (time > timeRange[0] && time < timeRange[1]) {
    return true;
  }
  return false;
}

module.exports = { method: 'post', handle }