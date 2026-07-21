<script setup>
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const props = defineProps({
  game: { type: Object, required: true }
})

const emit = defineEmits(['select'])
const { t } = useI18n()

const categoryColors = {
  slot: '#b829ea',
  fish: '#00d4ff',
  live: '#00ffd5',
  card: '#ffd700',
  mini: '#ff2d78',
  sport: '#ff8c00'
}

const badgeColor = computed(() => categoryColors[props.game.category] || '#b829ea')

const isHot = computed(() => props.game.hot === 1 || props.game.hot === true)
const isNew = computed(() => props.game.new === 1 || props.game.new === true)
</script>

<template>
  <div class="game-card" @click="emit('select', game)">
    <div class="card-image">
      <img :src="game.icon" :alt="game.name" loading="lazy" />
      <div class="card-overlay">
        <button class="play-btn">{{ t('gameCard.playBtn') }}</button>
      </div>
      <span v-if="isHot" class="badge badge-hot">{{ t('gameCard.hot') }}</span>
      <span v-if="isNew" class="badge badge-new">{{ t('gameCard.new') }}</span>
    </div>

    <div class="card-body">
      <div class="card-meta">
        <span v-if="game.provider" class="provider" :style="{ color: badgeColor }">{{ game.provider }}</span>
      </div>
      <h3 class="card-title">{{ game.name }}</h3>
    </div>

    <div class="card-glow" :style="{ background: `radial-gradient(circle at center, ${badgeColor}20, transparent)` }"></div>
  </div>
</template>

<style scoped>
.game-card {
  position: relative;
  width: 280px;
  min-width: 280px;
  flex-shrink: 0;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s ease;
}

.game-card:hover {
  transform: translateY(-8px);
  border-color: rgba(184, 41, 234, 0.4);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(184, 41, 234, 0.2);
}

.card-image {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.card-image img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.game-card:hover .card-image img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.game-card:hover .card-overlay { opacity: 1; }

.play-btn {
  padding: 12px 32px;
  background: var(--gradient-primary);
  color: #fff;
  font-family: 'Orbitron', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 1px;
  border-radius: var(--radius-sm);
  transform: translateY(10px);
  transition: transform 0.3s ease;
}

.game-card:hover .play-btn { transform: translateY(0); }

.badge {
  position: absolute;
  top: 12px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  border-radius: 4px;
  z-index: 2;
}

.badge-hot {
  right: 12px;
  background: rgba(255, 45, 120, 0.9);
  color: #fff;
}

.badge-new {
  left: 12px;
  background: rgba(0, 212, 255, 0.9);
  color: #000;
}

.card-body {
  padding: 16px;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.provider {
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.card-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.card-glow {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.game-card:hover .card-glow { opacity: 1; }
</style>
