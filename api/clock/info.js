const result = require('../../utils/result');

const { success } = result;

async function handle(ctx) {
  const { id } = ctx.session;
  const collection = ctx.db.collection(`clock_data_${String(id)}`);
  const allQuery = await collection.find().toArray();

  const count = allQuery.length;
  // 需要优化可查询最近100条获取最高天数
  const continuousItem = getContinuousCount(allQuery);
  const { last, max } = continuousItem;
  ctx.body = success({
    count,
    continuousCount: last,
    maxContinuousCount: max,
  });
}

/**
 * 查询连续打卡天数
 * @param {array} list 打卡列表
 */
function getContinuousCount (list) {
  const continuousList = [];
  let continousIndex = 0;
  continuousList[continousIndex] = 1;

  if (!Array.isArray(list)) {
    return { last: 0, max: 0 };
  }
  let timeList = list.map(v => new Date(`${v.year}/${v.month}/${v.date}`).getTime());
  timeList = timeList.sort((a, b) => a - b);
  for (let i = 0; i < timeList.length; i++) {
    if (timeList[i + 1] - timeList[i] === 86400000) { // 间隔一天
      continuousList[continousIndex] += 1;
    } else {
      if (i === timeList.length - 1) {
        break;
      }
      continousIndex += 1;
      continuousList[continousIndex] = 1;
    }
  }

  return {
    last: continuousList[continousIndex],
    max: Math.max(...continuousList),
  }
}

module.exports = { method: 'get', handle }