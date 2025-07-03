import createLogger from '@blocklet/logger';

const init = (label) => {
  const instance = createLogger(label || '');
  return instance;
};

const logger = init('app');

export default logger;

// 导出访问日志设置函数（如果需要）
export const { setupAccessLogger } = createLogger;
