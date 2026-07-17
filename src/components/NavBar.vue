<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const navLinks = [
  { name: '首页', path: '/' },
  { name: '游戏大厅', path: '/games' },
  { name: '关于我们', path: '/about' }
]

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const navigateTo = (path) => {
  router.push(path)
  mobileMenuOpen.value = false
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
          {{ link.name }}
        </a>
      </div>

      <!-- CTA Button -->
      <button class="btn-primary desktop-only cta-btn" @click="navigateTo('/games')">
        立即体验
      </button>

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
          {{ link.name }}
        </a>
        <button class="btn-primary mobile-cta" @click="navigateTo('/games')">
          立即体验
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

@media (max-width: 768px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: flex; }
}
</style>
