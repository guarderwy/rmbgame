/**
 * 用户会话管理 API
 * 提供用户会话的创建、获取、自动续期和 RTP 设置功能
 */
import { post } from '../utils/http.js'
import { getBrowserUUID } from '../utils/browser_uuid.js'

const STORAGE_KEY = 'user_info'

/** RTP 选项配置 */
export const rtpOptions = [
  { label: 'BIN WIN', value: 300 },
  { label: '150', value: 150 },
  { label: '120', value: 120 },
  { label: '100', value: 100 },
  { label: '97', value: 97 },
  { label: '95', value: 95 },
  { label: '90', value: 90 },
  { label: '85', value: 85 },
  { label: '80', value: 80 },
  { label: '75', value: 75 },
  { label: '70', value: 70 },
  { label: '60', value: 60 },
  { label: '50', value: 50 },
  { label: '40', value: 40 },
  { label: '20', value: 20 },
  { label: '0', value: 0 }
]

/**
 * 创建用户会话
 * @returns {Promise<Object>} 包含 user_id, token, rtp 的用户信息
 */
export async function CreateUser() {
  const browserUUID = getBrowserUUID()

  const data = {
    user_id: browserUUID,
    user_name: browserUUID,
    rtp: 0
  }

  try {
    const response = await post('/api/game/createUserSession', data)

    if (response.code !== 200) {
      throw new Error(response.msg || 'Failed to create user')
    }

    const userData = {
      user_id: response.data.user_id,
      token: response.data.token,
      rtp: response.data.rtp,
      expire_time: Date.now() + 1 * 24 * 60 * 60 * 1000 // expires in 1 day
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    return userData
  } catch (error) {
    console.error('CreateUser request failed:', error)
    throw error
  }
}

/**
 * 获取已保存的用户信息
 * 如果用户信息不存在或已过期，自动重新创建用户
 * @returns {Promise<Object|null>} 用户信息对象或 null
 */
export async function getUserInfo() {
  try {
    const userInfoStr = localStorage.getItem(STORAGE_KEY)

    if (!userInfoStr) {
      console.log('No cached user info, creating new user...')
      return await CreateUser()
    }

    const userInfo = JSON.parse(userInfoStr)

    if (userInfo.expire_time && Date.now() > userInfo.expire_time) {
      console.log('User info expired, re-creating session...')
      localStorage.removeItem(STORAGE_KEY)
      return await CreateUser()
    }

    return userInfo
  } catch (e) {
    console.warn('Failed to get user info:', e)
    try {
      localStorage.removeItem(STORAGE_KEY)
      return await CreateUser()
    } catch (createError) {
      console.error('Failed to recreate user:', createError)
      throw createError
    }
  }
}

/**
 * 设置用户 RTP
 * @param {number} rtp - RTP 值
 * @returns {Promise<Object>} 设置结果
 */
export async function setUserRtp(rtp) {
  try {
    const userInfo = await getUserInfo()

    if (!userInfo || !userInfo.user_id) {
      throw new Error('User session not initialized')
    }

    const uuidMd5 = localStorage.getItem('browser_uuid_md5')
    if (!uuidMd5) {
      throw new Error('Browser UUID not found')
    }

    const data = {
      rtp: Number(rtp),
      user_id: uuidMd5
    }

    const response = await post('/api/game/setUserRtp', data)

    if (response.code !== 200) {
      throw new Error(response.msg || 'Failed to set RTP')
    }

    userInfo.rtp = response.data.rtp
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo))

    return response.data
  } catch (error) {
    console.error('setUserRtp failed:', error)
    throw error
  }
}

/**
 * 获取游戏URL
 * @param {string} gameCode - 游戏代码
 * @param {string} language - 语言代码
 * @param {string} platformType - 游戏平台类型（小写）
 * @returns {Promise<string>} 游戏URL
 */
export async function getGameUrl(gameCode, language, platformType) {
  try {
    const userInfo = await getUserInfo()

    if (!userInfo || !userInfo.user_id || !userInfo.token) {
      throw new Error('User session not initialized')
    }

    const data = {
      game_code: gameCode,
      language: language,
      type: platformType,
      user_id: userInfo.user_id,
      user_token: userInfo.token
    }

    const response = await post('/api/game/getGameUrl', data)

    if (response.code !== 200) {
      throw new Error(response.msg || 'Failed to get game URL')
    }

    return response.data.url
  } catch (error) {
    console.error('getGameUrl failed:', error)
    throw error
  }
}
