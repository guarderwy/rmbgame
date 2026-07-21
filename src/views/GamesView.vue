<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useGames } from '../api/games'
import { setUserRtp, getGameUrl } from '../api/user'
import GameCard from '../components/GameCard.vue'
import RtpModal from '../components/RtpModal.vue'

const { t, locale } = useI18n()
const { categories, allGames, loading, error, fetchGames } = useGames()

const searchQuery = ref('')
const activeCategory = ref('all')
const activeProvider = ref('all')

// RTP modal state
const selectedGame = ref(null)
const showRtpModal = ref(false)
const currentRtp = ref(0)
const settingRtp = ref(false)
const rtpStatusMsg = ref('')
const rtpError = ref('')

function onGameSelect(game) {
  selectedGame.value = game
  try {
    const info = JSON.parse(localStorage.getItem('user_info') || '{}')
    currentRtp.value = info.rtp || 0
  } catch {
    currentRtp.value = 0
  }
  rtpError.value = ''
  showRtpModal.value = true
}

async function onRtpConfirm(rtp) {
  settingRtp.value = true
  rtpError.value = ''
  rtpStatusMsg.value = t('rtpModal.setting')

  try {
    await setUserRtp(rtp)

    // RTP 设置成功，显示成功提示
    rtpStatusMsg.value = t('rtpModal.setSuccess')

    const game = selectedGame.value
    const gameUrl = await getGameUrl(game.game_code, locale.value, game.provider)

    showRtpModal.value = false
    selectedGame.value = null
    settingRtp.value = false

    if (window.innerWidth <= 768) {
      window.location.href = gameUrl
    } else {
      window.open(gameUrl, '_blank')
    }
  } catch (e) {
    settingRtp.value = false
    rtpError.value = e.message || t('rtpModal.setFailed')
    // 3秒后自动清除错误提示
    setTimeout(() => { rtpError.value = '' }, 3000)
  }
}

// Build category tabs from API categories
const categoryTabs = computed(() => {
  const list = [{ id: 'all', icon: '🎮', name: t('categories.all') }]
  for (const cat of categories.value) {
    list.push({
      id: cat.name,
      icon: cat.icon || '🎮',
      name: t(`categories.${cat.name}`) || cat.name
    })
  }
  return list
})

// Extract unique providers — only for the current category
const providers = computed(() => {
  const source = activeCategory.value === 'all'
    ? allGames.value
    : allGames.value.filter(g => g.category === activeCategory.value)
  const set = new Set(source.map(g => g.provider).filter(Boolean))
  return Array.from(set).sort()
})

// Filtered games
const filteredGames = computed(() => {
  return allGames.value.filter(game => {
    const matchSearch = !searchQuery.value ||
      game.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      game.provider?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCategory = activeCategory.value === 'all' || game.category === activeCategory.value
    const matchProvider = activeProvider.value === 'all' || game.provider === activeProvider.value
    return matchSearch && matchCategory && matchProvider
  })
})

onMounted(() => {
  if (categories.value.length === 0) {
    fetchGames()
  }
})
</script>

<template>
  <div class="games-page">
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-title neon-text">{{ t('games.pageTitle') }}</h1>
        <p class="page-desc">{{ t('games.pageDesc') }}</p>
      </div>
    </section>

    <!-- Loading State -->
    <section v-if="loading" class="loading-section">
      <div class="container" style="text-align:center; padding: 60px 0;">
        <div class="loading-spinner"></div>
        <p style="color:var(--text-muted); margin-top:16px;">{{ t('games.loading') }}</p>
      </div>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="error-section">
      <div class="container" style="text-align:center; padding: 60px 0;">
        <span style="font-size:48px; display:block; margin-bottom:16px;">⚠️</span>
        <p style="color:var(--neon-pink);">{{ error }}</p>
        <button class="btn-outline" style="margin-top:16px;" @click="fetchGames">
          {{ t('games.empty.resetBtn') }}
        </button>
      </div>
    </section>

    <!-- Content -->
    <template v-else>
      <!-- Filters -->
      <section class="filters-section">
        <div class="container">
          <!-- Search -->
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('games.searchPlaceholder')"
              class="search-input"
            />
            <span v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</span>
          </div>

          <!-- Category Tabs -->
          <div class="category-tabs">
            <button
              v-for="cat in categoryTabs"
              :key="cat.id"
              :class="['cat-btn', { active: activeCategory === cat.id }]"
              @click="activeCategory = cat.id; searchQuery = ''"
            >
              <img v-if="cat.icon?.startsWith('http')" class="cat-icon-img" :src="cat.icon" :alt="cat.name" />
              <span v-else class="cat-icon">{{ cat.icon }}</span>
              <span>{{ cat.name }}</span>
            </button>
          </div>

          <!-- Provider Filter -->
          <div class="provider-filter">
            <button
              :class="['provider-btn', { active: activeProvider === 'all' }]"
              @click="activeProvider = 'all'"
            >
              {{ t('games.allProviders') }}
            </button>
            <button
              v-for="prov in providers"
              :key="prov"
              :class="['provider-btn', { active: activeProvider === prov }]"
              @click="activeProvider = prov"
            >
              {{ prov }}
            </button>
          </div>
        </div>
      </section>

      <!-- Games Grid -->
      <section class="games-section">
        <div class="container">
          <div class="results-info">
            <span v-html="t('games.resultsCount', { count: filteredGames.length })"></span>
          </div>

          <transition-group name="grid" tag="div" class="games-grid">
            <GameCard
              v-for="game in filteredGames"
              :key="game.game_code"
              :game="game"
              @select="onGameSelect"
            />
          </transition-group>

          <div v-if="filteredGames.length === 0" class="empty-state">
            <span class="empty-icon">🎮</span>
            <h3>{{ t('games.empty.title') }}</h3>
            <p>{{ t('games.empty.desc') }}</p>
            <button class="btn-outline" @click="searchQuery = ''; activeCategory = 'all'; activeProvider = 'all'">
              {{ t('games.empty.resetBtn') }}
            </button>
          </div>
        </div>
      </section>
    </template>

    <!-- RTP Selection Modal -->
    <RtpModal
      v-if="showRtpModal && selectedGame"
      :game="selectedGame"
      :current-rtp="currentRtp"
      @close="showRtpModal = false; selectedGame = null"
      @confirm="onRtpConfirm"
    />
    <Teleport v-if="settingRtp" to="body">
      <div class="rtp-loading-overlay">
        <div class="loading-spinner"></div>
        <p>{{ rtpStatusMsg }}</p>
      </div>
    </Teleport>
    <Teleport v-if="rtpError" to="body">
      <div class="rtp-error-toast">
        <span>⚠️</span>
        <span>{{ rtpError }}</span>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-header {
  padding: 60px 0 40px;
  text-align: center;
  background: linear-gradient(180deg, rgba(184,41,234,0.08) 0%, transparent 100%);
}

.page-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 42px;
  font-weight: 900;
  letter-spacing: 3px;
  margin-bottom: 12px;
}

.page-desc {
  color: var(--text-secondary);
  font-size: 18px;
}

/* Loading */
.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  border: 3px solid var(--bg-card);
  border-top: 3px solid var(--neon-purple);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Filters */
.filters-section {
  padding: 0 0 40px;
  position: sticky;
  top: var(--nav-height);
  z-index: 100;
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(184, 41, 234, 0.1);
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 600px;
  margin: 24px auto;
  padding: 12px 20px;
  background: var(--bg-card);
  border: 1px solid rgba(184, 41, 234, 0.2);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
}

.search-bar:focus-within {
  border-color: var(--neon-purple);
  box-shadow: 0 0 20px rgba(184, 41, 234, 0.2);
}

.search-icon { font-size: 18px; }

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 16px;
  font-family: inherit;
}

.search-input::placeholder { color: var(--text-muted); }

.clear-btn {
  cursor: pointer;
  color: var(--text-muted);
  font-size: 14px;
  transition: color 0.3s;
}
.clear-btn:hover { color: #fff; }

.category-tabs {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 16px 0;
}

.cat-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  border-radius: 20px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.cat-btn:hover {
  color: #fff;
  border-color: rgba(184, 41, 234, 0.3);
}

.cat-btn.active {
  background: var(--gradient-primary);
  color: #fff;
  border-color: transparent;
}

.cat-icon { font-size: 16px; }
.cat-icon-img { width: 18px; height: 18px; object-fit: contain; }

.provider-filter {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 8px 0 16px;
}

.provider-btn {
  padding: 5px 20px;
  font-size: 15px;
  font-weight: bold;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.provider-btn:hover {
  color: var(--text-secondary);
  border-color: rgba(255, 255, 255, 0.2);
}

.provider-btn.active {
  color: var(--neon-cyan);
  border-color: var(--neon-cyan);
  background: rgba(0, 255, 213, 0.05);
}

/* Games Grid */
.games-section { padding: 20px 0 60px; }

.results-info {
  margin-bottom: 24px;
  color: var(--text-secondary);
  font-size: 14px;
}

.results-info strong {
  font-family: 'Orbitron', sans-serif;
  font-size: 18px;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon { font-size: 64px; display: block; margin-bottom: 20px; opacity: 0.5; }
.empty-state h3 {
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  margin-bottom: 8px;
}
.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

/* Grid animation */
.grid-enter-active { transition: all 0.4s ease; }
.grid-leave-active { transition: all 0.3s ease; }
.grid-enter-from { opacity: 0; transform: scale(0.9); }
.grid-leave-to { opacity: 0; transform: scale(0.9); }
.grid-move { transition: transform 0.4s ease; }

@media (max-width: 768px) {
  .page-title { font-size: 28px; }
  .games-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
  .category-tabs { gap: 6px; }
  .cat-btn { padding: 6px 14px; font-size: 13px; }
}

/* RTP Loading / Error overlay */
.rtp-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
.rtp-loading-overlay p {
  color: var(--text-secondary);
  font-size: 16px;
}
.rtp-error-toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  background: rgba(255, 45, 78, 0.15);
  border: 1px solid rgba(255, 45, 78, 0.3);
  border-radius: 12px;
  color: #ff4d6a;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(12px);
  animation: fadeIn 0.25s ease;
}
</style>
