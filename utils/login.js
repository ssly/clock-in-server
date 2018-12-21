const axios = require('axios');

const appid = 'wxbe34a1f88efd8cd7';
const secret = '44fca68444c6586fe7ce123647c837a8';

/**
 * @param {string} code 小程序 code
 * @returns {string}
 */
function getWechatOpenid (code = '') {
  return new Promise(resolve => {
    const params = `?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
    axios.get(`https://api.weixin.qq.com/sns/jscode2session${params}`).then(({ data }) => {
      if (data.openid) {
        resolve(data.openid);
      }
      resolve('');
    })
  })
}

module.exports = {
  getWechatOpenid,
}