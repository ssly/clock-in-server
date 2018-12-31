/**
 * 全局路由配置
 */

const fs = require('fs');
const path = require('path');
const Router = require('koa-router');

const router = new Router();

const apiUri = '/api';
const apiPath = path.join(__dirname, apiUri);

function setApi(rootPath, ...pathArgs) {
  fs.readdir(rootPath, (err, files) => {
    if (err) { throw new Error(err); }
  
    files.forEach(async file => {
      const filePath = path.join(rootPath, file);
      
      const stat = await getStat(filePath).catch(err => {
        throw new Error(err);
      });
      if (stat === 'dir') {
        setApi(filePath, ...pathArgs.concat(file));
        return;        
      }

      // 设置接口逻辑
      const pattern = /([\w-]+).js/;
      if (pattern.test(file)) {
        const apiName = file.match(pattern)[1];
        const uri = path.join(apiUri, ...pathArgs, apiName);
        const apiItem = require(filePath);

        // 设置接口
        if (typeof apiItem.handle === 'function') {
          router[apiItem.method](uri, apiItem.handle);
        }
      }
    });
  })
}

/**
 * 检查是文件状态
 * @param {string} path 路径
 * @returns {string} file-文件 dir-文件夹
 */
function getStat(path) {
  return new Promise((resolve, reject) => {
    try {
      fs.stat(path, (err, stat) => {
        if (err) { 
          reject(err);
          return;
        }
  
        if (stat.isDirectory()) {
          resolve('dir');
        }
        resolve('file');
      });
    } catch (e) {
      reject(e);
    }
  });
}

setApi(apiPath);

module.exports = router;