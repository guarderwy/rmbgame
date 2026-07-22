/**
 * HTTP 请求工具
 * 基于 axios，提供统一的请求管理、错误处理、超时控制等功能
 */

import axios from 'axios'

// ==================== 自定义错误类 ====================

class HttpError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.data = data
  }
}

class TimeoutError extends Error {
  constructor(url, timeout) {
    super(`Request timeout: ${url} (${timeout}ms)`)
    this.name = 'TimeoutError'
    this.url = url
    this.timeout = timeout
  }
}

// ==================== 创建 axios 实例 ====================

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  withCredentials: false,
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Cache-Control': 'no-cache',
    'Game-Path': import.meta.env.VITE_GAME_PATH
  }
})

// ==================== 响应拦截器 ====================

instance.interceptors.response.use(
  response => response,
  error => {
    // 超时错误
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new TimeoutError(
        error.config?.url || '',
        error.config?.timeout || 15000
      ))
    }

    // 有 HTTP 响应体的错误
    if (error.response) {
      return Promise.reject(new HttpError(
        `HTTP ${error.response.status}: ${error.response.statusText}`,
        error.response.status,
        error.response.data
      ))
    }

    // 其他网络错误
    return Promise.reject(new HttpError(
      error.message || 'Network request failed',
      0,
      null
    ))
  }
)

// ==================== 核心请求方法 ====================

async function request(config) {
  const response = await instance(config)
  return response.data
}

/**
 * GET 请求
 * @param {string} url - 请求路径
 * @param {object} [options] - 配置
 * @param {object} [options.params] - 查询参数
 * @param {object} [options.headers] - 自定义请求头
 * @param {number} [options.timeout] - 超时时间
 * @param {AbortSignal} [options.signal] - 取消信号
 */
export function get(url, options = {}) {
  const { params, headers, timeout, signal } = options
  return request({ method: 'GET', url, params, headers, timeout, signal })
}

/**
 * POST 请求
 * @param {string} url - 请求路径
 * @param {object|FormData} [data] - 请求体
 * @param {object} [options] - 配置
 * @param {object} [options.params] - 查询参数
 * @param {object} [options.headers] - 自定义请求头
 * @param {number} [options.timeout] - 超时时间
 * @param {AbortSignal} [options.signal] - 取消信号
 */
export function post(url, data, options = {}) {
  const { params, headers, timeout, signal } = options
  return request({ method: 'POST', url, data, params, headers, timeout, signal })
}

/**
 * PUT 请求
 */
export function put(url, data, options = {}) {
  const { params, headers, timeout, signal } = options
  return request({ method: 'PUT', url, data, params, headers, timeout, signal })
}

/**
 * DELETE 请求
 */
export function del(url, options = {}) {
  const { params, headers, timeout, signal } = options
  return request({ method: 'DELETE', url, params, headers, timeout, signal })
}

/**
 * 更新基础配置
 */
export function setBaseConfig(config) {
  if (config.baseURL) instance.defaults.baseURL = config.baseURL
  if (config.timeout) instance.defaults.timeout = config.timeout
}

// 导出错误类供外部判断
export { HttpError, TimeoutError }

// 默认导出
export default { get, post, put, del, setBaseConfig, HttpError, TimeoutError }
