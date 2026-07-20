<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { games } from '../data/games.js'
import GameCard from '../components/GameCard.vue'
import { useI18n } from '../composables/useI18n'

const router = useRouter()
const { t } = useI18n()

// Split games into two rows for marquee scrolling
const hotAll = computed(() => games.filter(g => g.hot))
const newAll = computed(() => games.filter(g => g.new))
const hotRow1 = computed(() => hotAll.value.slice(0, Math.ceil(hotAll.value.length / 2)))
const hotRow2 = computed(() => hotAll.value.slice(Math.ceil(hotAll.value.length / 2)))
const newRow1 = computed(() => newAll.value.slice(0, Math.ceil(newAll.value.length / 2)))
const newRow2 = computed(() => newAll.value.slice(Math.ceil(newAll.value.length / 2)))

const activeTab = ref('hot')

// Map stats data with i18n labels
const statItems = computed(() => [
  { icon: '🎮', value: '2000+', label: t('stats.games') },
  { icon: '🤝', value: '50+', label: t('stats.partners') },
  { icon: '🌍', value: '20+', label: t('stats.languages') },
  { icon: '📱', value: t('stats.allPlatforms'), label: t('stats.platforms') }
])
</script>

<template>
  <div class="home">
    <!-- Hero Section with Video Background -->
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
              <img src="/images/games/759-large/Gate_of_Olympus.jpg" alt="Gate of Olympus" />
              <p>Gate of Olympus</p>
            </div>
            <div class="floating-card card-2">
              <div class="card-glow"></div>
              <img src="/images/games/759-large/phoenix-legend.jpg" alt="Phoenix Legend" />
              <p>Phoenix Legend</p>
            </div>
            <div class="floating-card card-3">
              <div class="card-glow"></div>
              <img src="/images/games/759-large/Dragons_Grace.jpg" alt="Dragons Grace" />
              <p>Dragons Grace</p>
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

        <transition name="fade" mode="out-in">
          <div :key="activeTab" class="marquee-wrapper">
            <!-- Row 1: scroll right -->
            <div class="marquee-row marquee-right">
              <div class="marquee-track">
                <GameCard
                  v-for="game in (activeTab === 'hot' ? hotRow1 : newRow1)"
                  :key="'r1-' + game.id"
                  :game="game"
                />
                <GameCard
                  v-for="game in (activeTab === 'hot' ? hotRow1 : newRow1)"
                  :key="'r1-dup-' + game.id"
                  :game="game"
                />
              </div>
            </div>
            <!-- Row 2: scroll left -->
            <div class="marquee-row marquee-left">
              <div class="marquee-track">
                <GameCard
                  v-for="game in (activeTab === 'hot' ? hotRow2 : newRow2)"
                  :key="'r2-' + game.id"
                  :game="game"
                />
                <GameCard
                  v-for="game in (activeTab === 'hot' ? hotRow2 : newRow2)"
                  :key="'r2-dup-' + game.id"
                  :game="game"
                />
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
  padding: 12px;
  background: var(--bg-card);
  border: 1px solid rgba(200, 80, 240, 0.3);
  border-radius: var(--radius-md);
  text-align: center;
  animation: float 4s ease-in-out infinite;
  backdrop-filter: blur(10px);
}

.floating-card img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
}
.floating-card span { font-size: 48px; display: block; margin-bottom: 12px; }
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

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
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
</style>
