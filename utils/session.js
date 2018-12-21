const sessions = [];

/**
 * 创建随机字符串(session)，默认十位数
 */
function createRandom () {
  const random = () => Math.random().toString(36).slice(2);
  return random() + random();
}

/**
 * 设置 session
 * @param {object} data data
 * @param {string} data.id 用户唯一 id
 * @param {string} data.openid 用户唯一 openid
 * @returns {string} token
 */
function setSession (data) {
  console.log('session: setSession, data is ', data);
  const { id, openid } = data;
  const session = createRandom();
  sessions[session] = { id, openid };
  return session;
}

/**
 * 通过 cookie 获取 id
 * @param {string} cookie cookie
 * @returns {object}
 */
function getSession (cookie = '') {
  console.log('session: getSession, cookie is ', cookie);
  return sessions[cookie] || null;
}

module.exports = {
  setSession,
  getSession,
}