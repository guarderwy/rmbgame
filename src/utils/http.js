/**
 * HTTP 请求工具
 * 封装 fetch API，提供统一的请求管理、错误处理、超时控制等功能
 */

// ==================== 基础配置 ====================

const BASE_CONFIG = {
  baseURL: 'http://192.168.1.105:9700',
  timeout: 15000,           // 默认超时 15s
  credentials: 'omit',      // 跨域请求不携带凭证
  mode: 'cors',             // 启用 CORS
  cache: 'no-cache'         // 禁用缓存
}

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

// ==================== 工具函数 ====================

/**
 * 序列化 URL 查询参数
 * @param {object} params - 参数对象
 * @returns {string} 序列化后的查询字符串
 */
function stringifyQuery(params) {
  if (!params || Object.keys(params).length === 0) return ''
  const parts = []
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    if (Array.isArray(value)) {
      value.forEach(v => parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`))
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    }
  }
  return parts.length ? `?${parts.join('&')}` : ''
}

/**
 * 合并请求头
 */
function mergeHeaders(...sources) {
  const result = new Headers()
  for (const source of sources) {
    if (!source) continue
    const headers = source instanceof Headers ? source : new Headers(source)
    for (const [key, value] of headers.entries()) {
      result.set(key, value)
    }
  }
  return result
}

// ==================== 核心请求方法 ====================

/**
 * 发送 HTTP 请求
 * @param {string} url - 请求路径（相对路径会自动拼接 baseURL）
 * @param {object} options - 请求配置
 * @param {string} [options.method='GET'] - 请求方法
 * @param {object} [options.params] - URL 查询参数
 * @param {object|FormData|string} [options.data] - 请求体
 * @param {object} [options.headers] - 自定义请求头
 * @param {number} [options.timeout] - 超时时间（ms）
 * @param {AbortSignal} [options.signal] - 外部取消信号
 * @param {boolean} [options.raw=false] - 是否返回原始 Response 对象
 * @returns {Promise<any>} 响应数据
 */
async function request(url, options = {}) {
  const {
    method = 'GET',
    params,
    data,
    headers: customHeaders,
    timeout = BASE_CONFIG.timeout,
    signal: externalSignal,
    raw = false
  } = options

  // 1. 拼接完整 URL
  const fullURL = url.startsWith('http') ? url : `${BASE_CONFIG.baseURL}${url}`

  // 2. 拼接查询参数
  const queryString = stringifyQuery(params)
  const requestURL = `${fullURL}${queryString}`

  // 3. 构建请求头
  const defaultHeaders = {
    'Accept': 'application/json, text/plain, */*'
  }

  // 自动设置 Content-Type（非 GET 请求且有 body 时）
  let body = undefined
  if (data !== undefined && data !== null) {
    if (typeof data === 'object' && !(data instanceof FormData) && !(data instanceof URLSearchParams)) {
      defaultHeaders['Content-Type'] = 'application/json;charset=UTF-8'
      body = JSON.stringify(data)
    } else {
      body = data
    }
  }

  const headers = mergeHeaders(defaultHeaders, customHeaders)

  // 4. 超时控制
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort(new TimeoutError(requestURL, timeout))
  }, timeout)

  // 同时支持外部取消信号
  const signal = externalSignal
    ? combineAbortSignals(controller.signal, externalSignal)
    : controller.signal

  try {
    // 5. 发起请求
    const response = await fetch(requestURL, {
      method,
      headers,
      body: method !== 'GET' ? body : undefined,
      signal,
      credentials: BASE_CONFIG.credentials,
      mode: BASE_CONFIG.mode,
      cache: BASE_CONFIG.cache
    })

    // 6. 如果请求被外部取消，提前返回
    if (externalSignal?.aborted) {
      throw externalSignal.reason || new DOMException('Aborted', 'AbortError')
    }

    // 7. 原始返回
    if (raw) return response

    // 8. 解析响应
    const contentType = response.headers.get('content-type') || ''
    let result

    if (contentType.includes('application/json')) {
      result = await response.json()
    } else if (contentType.includes('text/')) {
      result = await response.text()
    } else {
      result = await response.blob()
    }

    // 9. 业务层错误处理
    if (!response.ok) {
      throw new HttpError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        result
      )
    }

    return result
  } catch (err) {
    // 10. 统一错误处理
    if (err instanceof TimeoutError) {
      throw err
    }
    if (err instanceof HttpError) {
      throw err
    }
    if (err.name === 'AbortError') {
      throw err
    }
    throw new HttpError(
      err.message || 'Network request failed',
      0,
      null
    )
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * 合并两个 AbortSignal
 */
function combineAbortSignals(signal1, signal2) {
  if (!signal1) return signal2
  if (!signal2) return signal1
  const controller = new AbortController()

  const abort = () => controller.abort()
  signal1.addEventListener('abort', abort, { once: true })
  signal2.addEventListener('abort', abort, { once: true })

  return controller.signal
}

// ==================== 导出方法 ====================

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
  return request(url, { ...options, method: 'GET' })
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
  return request(url, { ...options, method: 'POST', data })
}

/**
 * PUT 请求
 */
export function put(url, data, options = {}) {
  return request(url, { ...options, method: 'PUT', data })
}

/**
 * DELETE 请求
 */
export function del(url, options = {}) {
  return request(url, { ...options, method: 'DELETE' })
}

/**
 * 更新基础配置
 */
export function setBaseConfig(config) {
  Object.assign(BASE_CONFIG, config)
}

// 导出错误类供外部判断
export { HttpError, TimeoutError }

// 默认导出
export default { get, post, put, del, setBaseConfig, HttpError, TimeoutError }
