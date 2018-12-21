const Koa = require('koa');
const koaBody = require('koa-body');
const logger = require('./middlewares/logger');
const mongo = require('./middlewares/mongo');
const session = require('./middlewares/session');
// const router = require('./api/index');
const config = require('./config/config.json');
const router = require('./router');

const app = new Koa();

app.use(koaBody());
app.use(mongo()); // 使用 mongodb 中间件
app.use(logger());
app.use(session({ excludes: ['/', '/api/login'] })); // 鉴权中间件
app.use(router.routes());

app.listen(config.port);