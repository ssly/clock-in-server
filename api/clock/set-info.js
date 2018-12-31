const result = require('../../utils/result');

const { success } = result;

async function handle(ctx) {
  const { openid } = ctx.session;
  const body = ctx.request.body;
  
  const collection = ctx.db.collection('clock_user');
  const option = { openid };
  
  await collection.updateOne(option, { $set: body });
  ctx.body = success();
}

module.exports = { method: 'post', handle }