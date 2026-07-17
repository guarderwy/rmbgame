<script setup>
import { ref, computed } from 'vue'
import { games, categories, providers } from '../data/games.js'
import GameCard from '../components/GameCard.vue'

const searchQuery = ref('')
const activeCategory = ref('all')
const activeProvider = ref('all')

const filteredGames = computed(() => {
  return games.filter(game => {
    const matchSearch = !searchQuery.value ||
      game.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      game.provider.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCategory = activeCategory.value === 'all' || game.category === activeCategory.value
    const matchProvider = activeProvider.value === 'all' || game.provider === activeProvider.value
    return matchSearch && matchCategory && matchProvider
  })
})
</script>

<template>
  <div class="games-page">
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-title neon-text">游戏大厅</h1>
        <p class="page-desc">探索 2000+ 精品游戏，找到你的最爱</p>
      </div>
    </section>

    <!-- Filters -->
    <section class="filters-section">
      <div class="container">
        <!-- Search -->
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索游戏名称或厂商..."
            class="search-input"
          />
          <span v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</span>
        </div>

        <!-- Category Tabs -->
        <div class="category-tabs">
          <button
            v-for="cat in categories"
            :key="cat.id"
            :class="['cat-btn', { active: activeCategory === cat.id }]"
            @click="activeCategory = cat.id"
          >
            <span class="cat-icon">{{ cat.icon }}</span>
            <span>{{ cat.name }}</span>
          </button>
        </div>

        <!-- Provider Filter -->
        <div class="provider-filter">
          <button
            :class="['provider-btn', { active: activeProvider === 'all' }]"
            @click="activeProvider = 'all'"
          >
            全部厂商
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
          <span>共找到 <strong class="neon-text">{{ filteredGames.length }}</strong> 款游戏</span>
        </div>

        <transition-group name="grid" tag="div" class="games-grid">
          <GameCard
            v-for="game in filteredGames"
            :key="game.id"
            :game="game"
          />
        </transition-group>

        <div v-if="filteredGames.length === 0" class="empty-state">
          <span class="empty-icon">🎮</span>
          <h3>没有找到匹配的游戏</h3>
          <p>试试调整筛选条件或搜索关键词</p>
          <button class="btn-outline" @click="searchQuery = ''; activeCategory = 'all'; activeProvider = 'all'">
            重置筛选
          </button>
        </div>
      </div>
    </section>
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

.provider-filter {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 8px 0 16px;
}

.provider-btn {
  padding: 5px 14px;
  font-size: 12px;
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
</style>
