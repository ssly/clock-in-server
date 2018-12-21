/**
 * 处理日志
 */

const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');

module.exports = function () {
  // 生成 logs 目录
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }
  return async (ctx, next) => {
    const { method, url, headers } = ctx.request;
    const date = new Date().toLocaleDateString().replace(/\//g, '-');

    const beforeTime = new Date().toLocaleTimeString();
    const beforeLog = `--> ${beforeTime} | ${method} | ${url}\nrequest:${JSON.stringify(headers)}\n`;
    fs.appendFile(`${logsDir}/${date}`, beforeLog, err => err);
    await next();
    const afterTime = new Date().toLocaleTimeString();
    const { status, header, body } = ctx.response;
    const afterLog = `<-- ${afterTime} | ${method} | ${url}\nresponse:${status} | ${JSON.stringify(header)} | ${JSON.stringify(body)}\n`;
    const separator = '-------------------------------------\n';
    fs.appendFile(`${logsDir}/${date}`, `${afterLog}${separator}`, err => err);
  }
}