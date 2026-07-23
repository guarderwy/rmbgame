<script setup>
import { useI18n } from '../composables/useI18n'
import { useGames } from '../api/games'

const { t } = useI18n()
const { customerService } = useGames()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">
          <span class="logo-icon">🎮</span>
          <span class="logo-text">RMB<span class="neon-text">GAMING</span></span>
        </div>
        <p class="footer-desc">{{ t('footer.desc') }}</p>
      </div>

      <div class="footer-links">
        <div class="footer-col">
          <h4>{{ t('footer.quickLinks') }}</h4>
          <router-link to="/">{{ t('footer.links.home') }}</router-link>
          <router-link to="/games">{{ t('footer.links.games') }}</router-link>
          <router-link to="/about">{{ t('footer.links.about') }}</router-link>
        </div>
        <div class="footer-col">
          <h4>{{ t('footer.gameCategories') }}</h4>
          <a href="#">{{ t('footer.categories.slot') }}</a>
          <a href="#">{{ t('footer.categories.fish') }}</a>
          <a href="#">{{ t('footer.categories.live') }}</a>
          <a href="#">{{ t('footer.categories.card') }}</a>
        </div>
        <div class="footer-col">
          <h4>{{ t('footer.support') }}</h4>
          <a href="#">{{ t('footer.supportLinks.help') }}</a>
          <a href="#">{{ t('footer.supportLinks.privacy') }}</a>
          <a href="#">{{ t('footer.supportLinks.terms') }}</a>
          <a v-if="customerService" :href="customerService" target="_blank" rel="noopener">{{ t('footer.supportLinks.contact') }}</a>
          <a v-else href="#">{{ t('footer.supportLinks.contact') }}</a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p>{{ t('footer.copyright', { year }) }}</p>
        <p class="age-badge">{{ t('footer.ageNotice') }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid rgba(184, 41, 234, 0.2);
  margin-top: 80px;
}

.footer-inner {
  display: grid;
  grid-template-columns: 1.5fr 2fr;
  gap: 60px;
  padding: 60px 24px 40px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.footer-logo .logo-icon { font-size: 24px; }
.footer-logo .logo-text {
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 2px;
}

.footer-desc {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.8;
  max-width: 360px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.footer-col h4 {
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 16px;
  color: #fff;
}

.footer-col a {
  display: block;
  color: var(--text-secondary);
  font-size: 14px;
  padding: 4px 0;
  transition: all 0.3s ease;
}

.footer-col a:hover {
  color: var(--neon-blue);
  padding-left: 8px;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 20px 0;
}

.footer-bottom-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-bottom p {
  color: var(--text-muted);
  font-size: 13px;
}

.age-badge {
  padding: 4px 12px;
  border: 1px solid var(--neon-pink);
  border-radius: 4px;
  color: var(--neon-pink) !important;
  font-weight: 600;
  font-size: 12px !important;
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 40px 16px 30px;
  }
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }
  .footer-bottom-inner {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}
</style>
