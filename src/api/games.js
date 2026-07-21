import { reactive, computed } from 'vue'
import { get } from '../utils/http.js'

// Reactive state
const state = reactive({
  categories: [], // Array of { name, icon, platforms: [...] }
  loading: false,
  error: null
})

// Flatten all games into a single array for search/display
const allGames = computed(() => {
  const result = []
  for (const cat of state.categories) {
    for (const platform of cat.platforms || []) {
      for (const game of platform.games || []) {
        result.push({
          ...game,
          provider: platform.name,
          category: cat.name
        })
      }
    }
  }
  return result
})

// Get hot games across all categories
const hotGames = computed(() => allGames.value.filter(g => g.hot === 1))

// Get new games across all categories
const newGames = computed(() => allGames.value.filter(g => g.new === 1))

async function fetchGames() {
  state.loading = true
  state.error = null
  try {
    const json = await get('/api/game/getAllGames')
    if (json.code === 200 && json.data?.games) {
      state.categories = json.data.games
    } else {
      state.error = 'Unexpected API response format'
    }
  } catch (e) {
    state.error = e.message || 'Failed to fetch games'
  } finally {
    state.loading = false
  }
}

export function useGames() {
  return {
    categories: computed(() => state.categories),
    allGames,
    hotGames,
    newGames,
    loading: computed(() => state.loading),
    error: computed(() => state.error),
    fetchGames
  }
}
