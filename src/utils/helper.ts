import { resolve } from 'path';
import dayjs from 'dayjs';

/**
 * 获取项目根路径(绝对路径)
 * @descrition 结尾不带斜杠
 */
export function getRootPath() {
  return resolve(process.cwd());
}

/**
 * 获取项目src路径（绝对路径）
 * @param srcName - src目录名称(默认: "src")
 * @descrition 结尾不带斜杠
 */
export function getSrcPath(srcName = 'src') {
  const rootPath = getRootPath();

  return `${rootPath}/${srcName}`;
}

export function formatDate(value: Date | string | any) {
  return dayjs(value).format('YYYY年MM月DD日 HH:mm:ss');
}
