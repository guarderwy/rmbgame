<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { rtpOptions } from '../api/user'

const props = defineProps({
  game: { type: Object, required: true },
  currentRtp: { type: Number, default: 0 }
})

const emit = defineEmits(['close', 'confirm'])

const { t } = useI18n()
const selectedRtp = ref(props.currentRtp)

function select(val) {
  selectedRtp.value = val
}

function handleConfirm() {
  emit('confirm', selectedRtp.value)
}

function handleBackdrop(e) {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click="handleBackdrop">
      <div class="modal-panel">
        <!-- Header -->
        <div class="modal-header">
          <div class="modal-game-info">
            <img class="modal-game-icon" :src="game.icon" :alt="game.name" />
            <div>
              <h3 class="modal-game-name">{{ game.name }}</h3>
              <span v-if="game.provider" class="modal-game-provider">{{ game.provider }}</span>
            </div>
          </div>
          <button class="modal-close" @click="emit('close')">✕</button>
        </div>

        <!-- RTP 选择 -->
        <div class="modal-body">
          <h4 class="modal-section-title">{{ t('rtpModal.selectRtp') }}</h4>
          <p class="modal-section-desc">{{ t('rtpModal.selectRtpDesc') }}</p>

          <div class="rtp-grid">
            <button
              v-for="opt in rtpOptions"
              :key="opt.value"
              :class="['rtp-btn', { active: selectedRtp === opt.value }]"
              @click="select(opt.value)"
            >
              <span class="rtp-label">{{ opt.label }}</span>
              <span v-if="opt.value !== 0" class="rtp-suffix">%</span>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn-cancel" @click="emit('close')">{{ t('rtpModal.cancel') }}</button>
          <button class="btn-confirm" @click="handleConfirm">
            {{ t('rtpModal.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

.modal-panel {
  width: 100%;
  max-width: 520px;
  background: var(--bg-card, #1a1a2e);
  border: 1px solid rgba(184, 41, 234, 0.3);
  border-radius: 16px;
  overflow: hidden;
  animation: scaleIn 0.25s ease;
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.modal-game-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.modal-game-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-game-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.modal-game-provider {
  font-size: 12px;
  color: var(--text-muted, #888);
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--text-muted, #888);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  transition: all 0.2s;
}

.modal-close:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

/* Body */
.modal-body {
  padding: 24px;
}

.modal-section-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.modal-section-desc {
  font-size: 13px;
  color: var(--text-muted, #888);
  margin-bottom: 20px;
}

.rtp-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.rtp-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 12px 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
  color: var(--text-secondary, #aaa);
  font-size: 14px;
  font-weight: 600;
  font-family: 'Orbitron', sans-serif;
}

.rtp-btn:hover {
  background: rgba(184, 41, 234, 0.12);
  border-color: rgba(184, 41, 234, 0.3);
  color: #fff;
}

.rtp-btn.active {
  background: var(--gradient-primary, linear-gradient(135deg, #b829ea, #7c3aed));
  border-color: transparent;
  color: #fff;
  box-shadow: 0 4px 16px rgba(184, 41, 234, 0.35);
}

.rtp-label {
  line-height: 1;
}

.rtp-suffix {
  font-size: 10px;
  opacity: 0.7;
}

/* Footer */
.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 24px 24px;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 10px 28px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted, #888);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-cancel:hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-confirm {
  padding: 10px 28px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: var(--gradient-primary, linear-gradient(135deg, #b829ea, #7c3aed));
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.5px;
}

.btn-confirm:hover {
  box-shadow: 0 4px 20px rgba(184, 41, 234, 0.4);
  transform: translateY(-1px);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 480px) {
  .rtp-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .rtp-btn {
    padding: 10px 6px;
    font-size: 13px;
  }
  .modal-panel { max-width: 100%; }
}
</style>
