/**
 * 此中间件提供上下文一个数据库的 db
 */

const mongodb = require('mongodb');
const config = require('../config/config.json');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const dbName = config.db.name;
const url = `${config.db.url}/${dbName}`;

// 获得数据库对象
let db = null;
function getDatebase () {
  if (db) {
    return db;
  }
  return MongoClient.connect(url, { useNewUrlParser: true }).then(client => {
    db = client.db(dbName);
    return db;
  });
}

module.exports = function () {
  // 初始化数据库
  getDatebase();
  return async (ctx, next) => {
    ctx.db = await getDatebase();
    await next();
  }
}