const result = require('../../utils/result');

const { success } = result;

async function handle(ctx) {
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
}

module.exports = { method: 'get', handle }