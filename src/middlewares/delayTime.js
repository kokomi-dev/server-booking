const delayTime = (req, res, next) => {
  const delay = 2000; // Độ trễ 2 giây
  setTimeout(() => {
    next();
  }, delay);
};
module.exports = delayTime;
