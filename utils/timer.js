/**
 * 定时器功能函数
 * 1. 提供定时能力
 * 2. 当前默认每分钟检查一遍定时任务
 */

const timers = [];
const frequency = 10000; // 执行频率，ms 为单位

// 处理定时任务，每分钟执行一次
setInterval(() => {
  const now = new Date().getTime(); // 当前时间戳
  timers.forEach(task => {
    if (now >= task.expiresTimestamp && typeof task.callback === 'function') {
      task.callback();
    }
  });
}, frequency);

/**
 * 添加定时任务
 * @param {number} expiresTimestamp 到期时间戳
 * @param {function} callback 回调函数
 */
function addTimer (expiresTimestamp, callback) {
  timers.push({ expiresTimestamp, callback });
}

module.exports = {
  addTimer,
}