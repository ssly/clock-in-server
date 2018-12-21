/**
 * 此中间件主要处理接口的 session 权限问题
 */

const session = require('../utils/session');

/**
 * @param {object} options 配置信息
 * @param {array} options.excludes 不需要验证 session 权限的接口 uri
 */
module.exports = function (options = { excludes: [] }) {
  const cookiePattern = /Clock-Access-Token=(\w+)/;

  return async (ctx, next) => {
    if (options.excludes.includes(ctx.request.url)) {
      await next();
      return;
    }
    const cookie = (String(ctx.header.cookie).match(cookiePattern) || [])[1];
    const sessionItem = session.getSession(cookie);

    // 未授权直接返回错误信息
    if (sessionItem === null) {
      ctx.status = 403;
      ctx.body = { code: '403', error: '用户未授权' };
      return;
    }

    ctx.session = sessionItem;
    await next();
  }
}