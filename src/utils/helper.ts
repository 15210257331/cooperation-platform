import * as path from 'path'
import dayjs from 'dayjs'

/**
 * 获取项目根路径(绝对路径)
 * @descrition 结尾不带斜杠
 */
export function getRootPath() {
  return path.resolve(process.cwd())
}

/**
 * 获取项目src路径（绝对路径）
 * @param srcName - src目录名称(默认: "src")
 * @descrition 结尾不带斜杠
 */
export function getSrcPath(srcName = 'src') {
  const rootPath = getRootPath()

  return `${rootPath}/${srcName}`
}

export function formatDate(value: Date | string | any, format = 'YYYY年MM月DD日 HH:mm:ss') {
  if (value) {
    return dayjs(value).format(format)
  }
  return ''
}

/**
 * 生成随机数 包含最大值和最小值
 * @param min
 * @param max
 * @returns
 */
export function getRandomNumber(max: number, min = 0) {
  return Math.ceil(Math.random() * max + min)
}
