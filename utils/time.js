/**
 * 时间类相关 utils
 */

/**
 * 获取时间
 * @returns {string} such as 08:00:05, 23:00:30
 */
function getCurrentTime(time) {
  let date = time;
  if (!(time instanceof Date)){
    date = new Date(time);
  }
  const hour = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${hour}:${min}:${second}`;
}

module.exports = {
  getCurrentTime,
}