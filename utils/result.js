/**
 * 错误封装
 * @param {string} message 提示信息
 * @param {string} code 错误码
 */
function error (message = '', code = '1') {
  return { code, message };
}

/**
 * 成功封装
 * @param {object} data 正常数据
 * @param {string} code 错误码
 */
function success (data = {}, code = '0') {
  return { code, data };
}

module.exports = {
  success,
  error,
}