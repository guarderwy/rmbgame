<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGames } from '../api/games'
import { setUserRtp, getGameUrl } from '../api/user'
import GameCard from '../components/GameCard.vue'
import RtpModal from '../components/RtpModal.vue'
import { useI18n } from '../composables/useI18n'

const router = useRouter()
const { t, locale } = useI18n()
const { hotGames, newGames, loading, fetchGames } = useGames()

const activeTab = ref('hot')

const displayGames = computed(() => activeTab.value === 'hot' ? hotGames.value : newGames.value)

// Split into two rows for marquee
const row1 = computed(() => displayGames.value.slice(0, Math.ceil(displayGames.value.length / 2)))
const row2 = computed(() => displayGames.value.slice(Math.ceil(displayGames.value.length / 2)))

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

const statItems = computed(() => [
  { icon: '🎮', value: '2000+', label: t('stats.games') },
  { icon: '🤝', value: '50+', label: t('stats.partners') },
  { icon: '🌍', value: '20+', label: t('stats.languages') },
  { icon: '📱', value: t('stats.allPlatforms'), label: t('stats.platforms') }
])

onMounted(() => {
  fetchGames()
})
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-video-bg">
        <video autoplay muted loop playsinline preload="auto">
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div class="hero-video-overlay"></div>
      </div>

      <div class="container hero-content">
        <div class="hero-text animate-slide-up">
          <span class="hero-badge">{{ t('home.hero.badge') }}</span>
          <h1 class="hero-title">
            {{ t('home.hero.title') }}<br />
            <span class="neon-text">{{ t('home.hero.titleHighlight') }}</span>
          </h1>
          <p class="hero-desc">
            {{ t('home.hero.desc') }}
          </p>
          <div class="hero-actions">
            <button class="btn-primary" @click="router.push('/games')">
              {{ t('home.hero.exploreBtn') }}
            </button>
            <button class="btn-outline" @click="router.push('/about')">
              {{ t('home.hero.learnMoreBtn') }}
            </button>
          </div>
        </div>

        <div class="hero-visual animate-slide-up" style="animation-delay: 0.2s">
          <div class="hero-card-stack">
            <div class="floating-card card-1">
              <div class="card-glow"></div>
              <div class="floating-img">
                <img src="https://uploads.wwapi.vip/uploads_002/images/pg/126.png" alt="Fortune Tiger" />
              </div>
              <p>Premium Slots</p>
            </div>
            <div class="floating-card card-2">
              <div class="card-glow"></div>
              <div class="floating-img">
                <img src="https://uploads.wwapi.vip/uploads_002/images/wg/3022.png" alt="Fishing Master" />
              </div>
              <p>Fishing Games</p>
            </div>
            <div class="floating-card card-3">
              <div class="card-glow"></div>
              <div class="floating-img">
                <img src="https://uploads.wwapi.vip/uploads_002/images/pg/69.png" alt="Bikini Paradise" />
              </div>
              <p>Live Casino</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container stats-grid">
        <div v-for="stat in statItems" :key="stat.label" class="stat-item">
          <span class="stat-icon">{{ stat.icon }}</span>
          <span class="stat-value neon-text">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <!-- Featured Games -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">{{ t('home.featured.title') }}</h2>
            <p class="section-subtitle">{{ t('home.featured.subtitle') }}</p>
          </div>
          <div class="tab-switcher">
            <button
              :class="['tab-btn', { active: activeTab === 'hot' }]"
              @click="activeTab = 'hot'"
            >
              {{ t('home.tabs.hot') }}
            </button>
            <button
              :class="['tab-btn', { active: activeTab === 'new' }]"
              @click="activeTab = 'new'"
            >
              {{ t('home.tabs.new') }}
            </button>
          </div>
        </div>

        <div v-if="loading" style="text-align:center; padding:40px 0; color:var(--text-muted);">
          Loading...
        </div>

        <transition v-else name="fade" mode="out-in">
          <div :key="activeTab" class="marquee-wrapper">
            <div class="marquee-row marquee-right">
              <div class="marquee-track">
                <GameCard v-for="game in row1" :key="'r1-' + game.game_code" :game="game" @select="onGameSelect" />
                <GameCard v-for="game in row1" :key="'r1-dup-' + game.game_code" :game="game" @select="onGameSelect" />
              </div>
            </div>
            <div class="marquee-row marquee-left">
              <div class="marquee-track">
                <GameCard v-for="game in row2" :key="'r2-' + game.game_code" :game="game" @select="onGameSelect" />
                <GameCard v-for="game in row2" :key="'r2-dup-' + game.game_code" :game="game" @select="onGameSelect" />
              </div>
            </div>
          </div>
        </transition>

        <div class="section-cta">
          <button class="btn-outline" @click="router.push('/games')">
            {{ t('home.featured.viewAll') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Features Banner -->
    <section class="features-banner">
      <div class="container features-grid">
        <div class="feature-item">
          <div class="feature-icon">🛡️</div>
          <h3>{{ t('home.features.safe.title') }}</h3>
          <p>{{ t('home.features.safe.desc') }}</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">⚡</div>
          <h3>{{ t('home.features.speed.title') }}</h3>
          <p>{{ t('home.features.speed.desc') }}</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🎯</div>
          <h3>{{ t('home.features.fair.title') }}</h3>
          <p>{{ t('home.features.fair.desc') }}</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">💬</div>
          <h3>{{ t('home.features.support247.title') }}</h3>
          <p>{{ t('home.features.support247.desc') }}</p>
        </div>
      </div>
    </section>

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
/* Hero */
.hero {
  position: relative;
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  align-items: center;
  overflow: hidden;
  background: var(--gradient-hero);
}

.hero-video-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-video-bg video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-video-overlay {
  position: absolute;
  inset: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
}

.hero-badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(184, 41, 234, 0.15);
  border: 1px solid rgba(184, 41, 234, 0.3);
  border-radius: 20px;
  font-size: 13px;
  color: var(--neon-purple);
  margin-bottom: 24px;
  letter-spacing: 1px;
}

.hero-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 52px;
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 24px;
  letter-spacing: 2px;
}

.hero-desc {
  font-size: 18px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 36px;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

/* Floating Cards */
.hero-card-stack {
  position: relative;
  height: 400px;
}

.floating-card {
  position: absolute;
  width: 200px;
  padding: 24px;
  background: var(--bg-card);
  border: 1px solid rgba(200, 80, 240, 0.3);
  border-radius: var(--radius-md);
  text-align: center;
  animation: float 4s ease-in-out infinite;
  backdrop-filter: blur(10px);
}

.floating-img {
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
}

.floating-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.floating-card p {
  font-family: 'Orbitron', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
}

.card-glow {
  position: absolute;
  inset: -1px;
  border-radius: var(--radius-md);
  background: var(--gradient-primary);
  opacity: 0.15;
  z-index: -1;
}

.card-1 { top: 20px; left: 40px; animation-delay: 0s; }
.card-2 { top: 120px; right: 20px; animation-delay: 1.5s; }
.card-3 { bottom: 40px; left: 80px; animation-delay: 3s; }

/* Stats */
.stats-section {
  padding: 40px 0;
  background: var(--bg-secondary);
  border-top: 1px solid rgba(184, 41, 234, 0.1);
  border-bottom: 1px solid rgba(184, 41, 234, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
}

.stat-icon { font-size: 32px; }
.stat-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 36px;
  font-weight: 800;
}
.stat-label {
  color: var(--text-secondary);
  font-size: 14px;
  letter-spacing: 1px;
}

/* Featured */
.featured-section {
  padding: 80px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
}

.tab-switcher {
  display: flex;
  gap: 8px;
  background: var(--bg-card);
  padding: 4px;
  border-radius: var(--radius-sm);
}

.tab-btn {
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: var(--gradient-primary);
  color: #fff;
}

.section-cta {
  text-align: center;
  margin-top: 48px;
}

/* Features Banner */
.features-banner {
  padding: 80px 0;
  background: var(--bg-secondary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.feature-item {
  text-align: center;
  padding: 40px 24px;
  background: var(--bg-card);
  border: 1px solid rgba(184, 41, 234, 0.1);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

.feature-item:hover {
  border-color: rgba(184, 41, 234, 0.4);
  transform: translateY(-4px);
  box-shadow: var(--shadow-neon);
}

.feature-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.feature-item h3 {
  font-family: 'Orbitron', sans-serif;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.feature-item p {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Marquee Seamless Scrolling */
.marquee-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: hidden;
}

.marquee-row {
  overflow: hidden;
  position: relative;
}

.marquee-row::before,
.marquee-row::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 120px;
  z-index: 2;
  pointer-events: none;
}

.marquee-row::before {
  left: 0;
  background: linear-gradient(to right, var(--bg-primary), transparent);
}

.marquee-row::after {
  right: 0;
  background: linear-gradient(to left, var(--bg-primary), transparent);
}

.marquee-track {
  display: flex;
  gap: 24px;
  width: max-content;
}

.marquee-right .marquee-track {
  animation: scroll-right 30s linear infinite;
}

.marquee-left .marquee-track {
  animation: scroll-left 30s linear infinite;
}

.marquee-row:hover .marquee-track {
  animation-play-state: paused;
}

@keyframes scroll-right {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@media (max-width: 1024px) {
  .hero-content { grid-template-columns: 1fr; text-align: center; }
  .hero-title { font-size: 36px; }
  .hero-actions { justify-content: center; }
  .hero-visual { display: none; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .hero-title { font-size: 28px; }
  .hero-desc { font-size: 15px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .stat-value { font-size: 28px; }
  .features-grid { grid-template-columns: 1fr; }
  .section-header { flex-direction: column; align-items: flex-start; gap: 16px; }
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
