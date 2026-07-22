import { reactive, computed } from 'vue'

// Shared reactive state across all components
const state = reactive({
  locale: 'en',
  messages: {}
})

// Load locale messages dynamically
async function loadMessages(locale) {
  try {
    const module = await import(`../locales/${locale}.json`)
    state.messages = module.default
  } catch (e) {
    console.error(`Failed to load locale: ${locale}`, e)
    // Fallback to en
    if (locale !== 'en') {
      const module = await import('../locales/en.json')
      state.messages = module.default
    }
  }
}

// Get nested value from messages object by dot-separated key
function resolveKey(obj, key) {
  const keys = key.split('.')
  let value = obj
  for (const k of keys) {
    if (value == null) return undefined
    value = value[k]
  }
  return value
}

// Initialize with saved locale
const savedLocale = localStorage.getItem('locale') || 'en'
state.locale = savedLocale
loadMessages(savedLocale)

export function useI18n() {
  const locale = computed(() => state.locale)

  /**
   * Translate a key with optional interpolation parameters.
   * @param {string} key - Dot-separated key path (e.g. "nav.home")
   * @param {object} params - Optional interpolation values (e.g. { year: 2026 })
   * @returns {string} Translated text, or the key itself if not found
   */
  function t(key, params = {}) {
    let value = resolveKey(state.messages, key)
    if (value === undefined || value === null) {
      // Fallback: try to resolve in case messages aren't loaded yet
      return key
    }
    if (typeof value === 'string') {
      // Interpolate {param} placeholders
      return value.replace(/\{(\w+)\}/g, (_, k) => {
        return params[k] !== undefined ? String(params[k]) : `{${k}}`
      })
    }
    return value
  }

  /**
   * Set the active locale and persist it.
   * @param {string} newLocale - Language code: 'en', 'zh', 'pt'
   */
  async function setLocale(newLocale) {
    if (newLocale === state.locale) return
    state.locale = newLocale
    localStorage.setItem('locale', newLocale)
    await loadMessages(newLocale)
  }

  return { t, locale, setLocale }
}
