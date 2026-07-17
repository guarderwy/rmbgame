<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  game: { type: Object, required: true }
})

const router = useRouter()

const categoryColors = {
  slot: '#b829ea',
  fish: '#00d4ff',
  live: '#00ffd5',
  card: '#ffd700',
  mini: '#ff2d78',
  sport: '#ff8c00'
}

const badgeColor = computed(() => categoryColors[props.game.category] || '#b829ea')
</script>

<template>
  <div class="game-card" @click="router.push(`/game/${game.id}`)">
    <div class="card-image">
      <img :src="game.image" :alt="game.title" loading="lazy" />
      <div class="card-overlay">
        <button class="play-btn">▶ 试玩</button>
      </div>
      <span v-if="game.hot" class="badge badge-hot">🔥 HOT</span>
      <span v-if="game.new" class="badge badge-new">✨ NEW</span>
    </div>

    <div class="card-body">
      <div class="card-meta">
        <span class="provider" :style="{ color: badgeColor }">{{ game.provider }}</span>
        <span class="rtp">RTP {{ game.rtp }}%</span>
      </div>
      <h3 class="card-title">{{ game.title }}</h3>
    </div>

    <div class="card-glow" :style="{ background: `radial-gradient(circle at center, ${badgeColor}20, transparent)` }"></div>
  </div>
</template>

<style scoped>
.game-card {
  position: relative;
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
  font-weight: 600;
  letter-spacing: 0.5px;
}

.rtp {
  font-size: 11px;
  color: var(--text-muted);
  font-family: 'Orbitron', sans-serif;
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
