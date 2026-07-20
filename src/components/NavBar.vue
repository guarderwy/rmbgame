<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from '../composables/useI18n'

const router = useRouter()
const route = useRoute()
const { t, locale, setLocale } = useI18n()

const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const langMenuOpen = ref(false)

const languages = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' }
]

const navLinks = [
  { name: () => t('nav.home'), path: '/' },
  { name: () => t('nav.games'), path: '/games' },
  { name: () => t('nav.about'), path: '/about' }
]

const currentLang = () => languages.find(l => l.code === locale.value)?.label || '中文'

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const navigateTo = (path) => {
  router.push(path)
  mobileMenuOpen.value = false
}

const switchLang = async (code) => {
  await setLocale(code)
  langMenuOpen.value = false
}
</script>

<template>
  <nav class="navbar" :class="{ scrolled }">
    <div class="container nav-inner">
      <!-- Logo -->
      <div class="logo" @click="navigateTo('/')">
        <span class="logo-icon">🎮</span>
        <span class="logo-text">RMB<span class="neon-text">GAMING</span></span>
      </div>

      <!-- Desktop Nav -->
      <div class="nav-links desktop-only">
        <a
          v-for="link in navLinks"
          :key="link.path"
          class="nav-link"
          :class="{ active: route.path === link.path }"
          @click="navigateTo(link.path)"
        >
          {{ link.name() }}
        </a>
      </div>

      <!-- Language Switcher + CTA -->
      <div class="nav-actions desktop-only">
        <!-- Language Switcher -->
        <div class="lang-switcher" @click.stop="langMenuOpen = !langMenuOpen">
          <button class="lang-btn">
            🌐 <span class="lang-current">{{ currentLang() }}</span>
            <span class="lang-arrow">▾</span>
          </button>
          <transition name="fade">
            <div v-if="langMenuOpen" class="lang-dropdown">
              <button
                v-for="lang in languages"
                :key="lang.code"
                :class="['lang-option', { active: locale === lang.code }]"
                @click="switchLang(lang.code)"
              >
                {{ lang.label }}
              </button>
            </div>
          </transition>
        </div>

        <button class="btn-primary cta-btn" @click="navigateTo('/games')">
          {{ t('nav.cta') }}
        </button>
      </div>

      <!-- Mobile Toggle -->
      <button class="mobile-toggle mobile-only" @click="mobileMenuOpen = !mobileMenuOpen">
        <span :class="{ open: mobileMenuOpen }"></span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <transition name="slide-down">
      <div v-if="mobileMenuOpen" class="mobile-menu mobile-only">
        <a
          v-for="link in navLinks"
          :key="link.path"
          class="mobile-link"
          :class="{ active: route.path === link.path }"
          @click="navigateTo(link.path)"
        >
          {{ link.name() }}
        </a>
        <!-- Mobile Language Switcher -->
        <div class="mobile-lang-section">
          <span class="mobile-lang-label">🌐 {{ t('nav.language') || '语言' }}</span>
          <div class="mobile-lang-options">
            <button
              v-for="lang in languages"
              :key="lang.code"
              :class="['mobile-lang-btn', { active: locale === lang.code }]"
              @click="switchLang(lang.code)"
            >
              {{ lang.label }}
            </button>
          </div>
        </div>
        <button class="btn-primary mobile-cta" @click="navigateTo('/games')">
          {{ t('nav.cta') }}
        </button>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: var(--nav-height);
  z-index: 1000;
  transition: all 0.3s ease;
  background: rgba(10, 10, 15, 0.6);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(184, 41, 234, 0.1);
}

.navbar.scrolled {
  background: rgba(10, 10, 15, 0.95);
  border-bottom: 1px solid rgba(184, 41, 234, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.logo:hover { transform: scale(1.05); }

.logo-icon { font-size: 28px; }

.logo-text {
  font-family: 'Orbitron', sans-serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 2px;
  color: #fff;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 8px 20px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.nav-link:hover,
.nav-link.active {
  color: #fff;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 20px; height: 2px;
  background: var(--gradient-primary);
  border-radius: 1px;
}

/* Nav Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Language Switcher */
.lang-switcher {
  position: relative;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-family: inherit;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.lang-btn:hover {
  border-color: var(--neon-purple);
  color: #fff;
}

.lang-current {
  font-weight: 500;
}

.lang-arrow {
  font-size: 10px;
  transition: transform 0.3s ease;
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 140px;
  background: var(--bg-card);
  border: 1px solid rgba(184, 41, 234, 0.3);
  border-radius: var(--radius-sm);
  overflow: hidden;
  z-index: 100;
  box-shadow: var(--shadow-card);
}

.lang-option {
  display: block;
  width: 100%;
  padding: 10px 16px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  text-align: left;
  font-family: inherit;
  transition: all 0.2s ease;
  cursor: pointer;
}

.lang-option:hover {
  background: rgba(184, 41, 234, 0.1);
  color: #fff;
}

.lang-option.active {
  color: var(--neon-purple);
  font-weight: 600;
}

.cta-btn {
  padding: 8px 24px !important;
  font-size: 12px !important;
}

/* Mobile */
.mobile-only { display: none; }

.mobile-toggle {
  width: 32px; height: 32px;
  background: transparent;
  position: relative;
}

.mobile-toggle span,
.mobile-toggle span::before,
.mobile-toggle span::after {
  display: block;
  width: 24px; height: 2px;
  background: #fff;
  transition: all 0.3s ease;
  position: absolute;
  left: 4px;
}

.mobile-toggle span { top: 15px; }
.mobile-toggle span::before { content: ''; top: -7px; }
.mobile-toggle span::after { content: ''; top: 7px; }

.mobile-toggle span.open { background: transparent; }
.mobile-toggle span.open::before { top: 0; transform: rotate(45deg); }
.mobile-toggle span.open::after { top: 0; transform: rotate(-45deg); }

.mobile-menu {
  position: absolute;
  top: var(--nav-height);
  left: 0; right: 0;
  background: rgba(10, 10, 15, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(184, 41, 234, 0.3);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-link {
  padding: 14px 20px;
  font-size: 16px;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  transition: all 0.3s ease;
}

.mobile-link:hover,
.mobile-link.active {
  color: #fff;
  background: rgba(184, 41, 234, 0.1);
}

.mobile-lang-section {
  padding: 14px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin-top: 8px;
}

.mobile-lang-label {
  display: block;
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.mobile-lang-options {
  display: flex;
  gap: 8px;
}

.mobile-lang-btn {
  flex: 1;
  padding: 8px 12px;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 13px;
  font-family: inherit;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-lang-btn.active {
  border-color: var(--neon-purple);
  color: var(--neon-purple);
  background: rgba(184, 41, 234, 0.1);
}

.mobile-cta {
  margin-top: 12px;
  justify-content: center;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: flex; }
}
</style>
