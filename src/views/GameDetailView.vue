<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { games } from '../data/games.js'
import GameCard from '../components/GameCard.vue'
import { useI18n } from '../composables/useI18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const game = computed(() => games.find(g => g.id === Number(route.params.id)))

const relatedGames = computed(() => {
  if (!game.value) return []
  return games
    .filter(g => g.id !== game.value.id && (g.category === game.value.category || g.provider === game.value.provider))
    .slice(0, 4)
})

// Get localized category name
const localizedCategory = computed(() => {
  if (!game.value) return ''
  return t(`categories.${game.value.category}`)
})

// Get localized volatility
const localizedVolatility = computed(() => {
  if (!game.value) return ''
  const key = game.value.volatility.toLowerCase()
  return t(`volatility.${key}`)
})

// Get localized description
const localizedDesc = computed(() => {
  if (!game.value) return ''
  return t(`game.descriptions.${game.value.id}`)
})
</script>

<template>
  <div class="detail-page" v-if="game">
    <!-- Breadcrumb -->
    <div class="container breadcrumb-bar">
      <span class="crumb" @click="router.push('/')">{{ t('gameDetail.breadcrumb.home') }}</span>
      <span class="sep">/</span>
      <span class="crumb" @click="router.push('/games')">{{ t('gameDetail.breadcrumb.games') }}</span>
      <span class="sep">/</span>
      <span class="crumb active">{{ game.title }}</span>
    </div>

    <!-- Game Detail -->
    <section class="detail-hero">
      <div class="container detail-grid">
        <div class="detail-image">
          <img :src="game.image" :alt="game.title" />
          <div class="image-glow"></div>
        </div>

        <div class="detail-info">
          <div class="detail-badges">
            <span v-if="game.hot" class="badge badge-hot">{{ t('gameDetail.hot') }}</span>
            <span v-if="game.new" class="badge badge-new">{{ t('gameDetail.new') }}</span>
            <span class="badge badge-cat">{{ localizedCategory.toUpperCase() }}</span>
          </div>

          <h1 class="detail-title">{{ game.title }}</h1>
          <p class="detail-provider">{{ game.provider }}</p>

          <p class="detail-desc">{{ localizedDesc }}</p>

          <div class="detail-stats">
            <div class="stat-box">
              <span class="stat-label">{{ t('gameDetail.rtp') }}</span>
              <span class="stat-value neon-text">{{ game.rtp }}%</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">{{ t('gameDetail.volatility') }}</span>
              <span class="stat-value">{{ localizedVolatility }}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">{{ t('gameDetail.category') }}</span>
              <span class="stat-value">{{ localizedCategory }}</span>
            </div>
          </div>

          <div class="detail-features">
            <h3>{{ t('gameDetail.features') }}</h3>
            <div class="feature-tags">
              <span v-for="feat in game.features" :key="feat" class="feature-tag">
                {{ feat }}
              </span>
            </div>
          </div>

          <div class="detail-actions">
            <button class="btn-primary">{{ t('gameDetail.playBtn') }}</button>
            <button class="btn-outline">{{ t('gameDetail.rulesBtn') }}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Games -->
    <section class="related-section" v-if="relatedGames.length">
      <div class="container">
        <h2 class="section-title">{{ t('gameDetail.related.title') }}</h2>
        <p class="section-subtitle">{{ t('gameDetail.related.subtitle') }}</p>
        <div class="games-grid">
          <GameCard v-for="g in relatedGames" :key="g.id" :game="g" />
        </div>
      </div>
    </section>
  </div>

  <div v-else class="not-found">
    <div class="container" style="text-align:center; padding: 120px 20px;">
      <span style="font-size:64px; display:block; margin-bottom:20px;">😕</span>
      <h2 style="font-family:'Orbitron',sans-serif; margin-bottom:12px;">{{ t('gameDetail.notFound.title') }}</h2>
      <p style="color:var(--text-secondary); margin-bottom:24px;">{{ t('gameDetail.notFound.desc') }}</p>
      <button class="btn-primary" @click="router.push('/games')">{{ t('gameDetail.notFound.backBtn') }}</button>
    </div>
  </div>
</template>

<style scoped>
.breadcrumb-bar {
  padding: 20px 24px;
  font-size: 13px;
  color: var(--text-muted);
}

.crumb { cursor: pointer; transition: color 0.3s; }
.crumb:hover { color: var(--neon-blue); }
.crumb.active { color: var(--text-primary); }
.sep { margin: 0 8px; opacity: 0.5; }

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
  padding: 20px 24px 60px;
}

.detail-image {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid rgba(184, 41, 234, 0.3);
}

.detail-image img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
}

.image-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 60%, rgba(184, 41, 234, 0.2));
  pointer-events: none;
}

.detail-badges {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.badge {
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  border-radius: 4px;
}

.badge-hot { background: rgba(255, 45, 120, 0.9); color: #fff; }
.badge-new { background: rgba(0, 212, 255, 0.9); color: #000; }
.badge-cat { background: rgba(184, 41, 234, 0.2); color: var(--neon-purple); border: 1px solid rgba(184, 41, 234, 0.3); }

.detail-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.detail-provider {
  color: var(--neon-blue);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
}

.detail-desc {
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 32px;
}

.detail-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

.stat-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 24px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-sm);
}

.stat-box .stat-label {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-box .stat-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 18px;
  font-weight: 700;
}

.detail-features h3 {
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 12px;
  color: var(--text-secondary);
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
}

.feature-tag {
  padding: 6px 16px;
  background: rgba(0, 212, 255, 0.08);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 20px;
  font-size: 13px;
  color: var(--neon-cyan);
}

.detail-actions {
  display: flex;
  gap: 16px;
}

/* Related */
.related-section {
  padding: 60px 0;
  background: var(--bg-secondary);
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

@media (max-width: 1024px) {
  .detail-grid { grid-template-columns: 1fr; gap: 40px; }
  .detail-title { font-size: 28px; }
}

@media (max-width: 768px) {
  .detail-stats { flex-wrap: wrap; }
  .detail-actions { flex-direction: column; }
  .detail-actions .btn-primary,
  .detail-actions .btn-outline { justify-content: center; }
}
</style>
