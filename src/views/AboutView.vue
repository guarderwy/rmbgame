<script setup>
import { ref } from 'vue'

const form = ref({ name: '', email: '', message: '' })
const submitted = ref(false)

const handleSubmit = () => {
  if (form.value.name && form.value.email && form.value.message) {
    submitted.value = true
    setTimeout(() => {
      submitted.value = false
      form.value = { name: '', email: '', message: '' }
    }, 3000)
  }
}

const team = [
  { name: 'Alex Chen', role: 'CEO & Founder', avatar: '👨‍💼' },
  { name: 'Sarah Lin', role: 'CTO', avatar: '👩‍💻' },
  { name: 'Mike Wang', role: 'Head of Design', avatar: '🎨' },
  { name: 'Lisa Zhang', role: 'Head of Operations', avatar: '📊' }
]

const milestones = [
  { year: '2020', title: '公司成立', desc: 'RMB Gaming 在深圳正式成立' },
  { year: '2021', title: '首批合作', desc: '与 10+ 顶级游戏厂商达成战略合作' },
  { year: '2022', title: '全球扩展', desc: '业务覆盖东南亚、欧洲市场' },
  { year: '2023', title: '技术升级', desc: '全新平台架构上线，支持 2000+ 游戏' },
  { year: '2024', title: '行业领先', desc: '获评年度最佳游戏平台运营商' }
]
</script>

<template>
  <div class="about-page">
    <!-- Hero -->
    <section class="about-hero">
      <div class="container">
        <h1 class="page-title neon-text">关于我们</h1>
        <p class="page-desc">打造下一代游戏体验平台</p>
      </div>
    </section>

    <!-- Mission -->
    <section class="mission-section">
      <div class="container mission-grid">
        <div class="mission-card">
          <div class="mission-icon">🚀</div>
          <h3>我们的使命</h3>
          <p>通过技术创新和极致服务，为全球玩家提供最安全、最公平、最刺激的在线娱乐体验。</p>
        </div>
        <div class="mission-card">
          <div class="mission-icon">💡</div>
          <h3>我们的愿景</h3>
          <p>成为亚太地区最受信赖的在线游戏平台，引领行业标准，推动行业发展。</p>
        </div>
        <div class="mission-card">
          <div class="mission-icon">❤️</div>
          <h3>核心价值观</h3>
          <p>诚信为本、用户至上、持续创新、合作共赢。每一个决策都以玩家体验为核心。</p>
        </div>
      </div>
    </section>

    <!-- Timeline -->
    <section class="timeline-section">
      <div class="container">
        <h2 class="section-title" style="text-align:center;">发展历程</h2>
        <p class="section-subtitle" style="text-align:center;">从初创到行业领先的蜕变之路</p>

        <div class="timeline">
          <div v-for="(item, i) in milestones" :key="item.year" class="timeline-item" :class="{ right: i % 2 !== 0 }">
            <div class="timeline-dot"></div>
            <div class="timeline-card">
              <span class="timeline-year neon-text">{{ item.year }}</span>
              <h4>{{ item.title }}</h4>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="team-section">
      <div class="container">
        <h2 class="section-title" style="text-align:center;">核心团队</h2>
        <p class="section-subtitle" style="text-align:center;">由行业精英组成的梦之队</p>

        <div class="team-grid">
          <div v-for="member in team" :key="member.name" class="team-card">
            <div class="team-avatar">{{ member.avatar }}</div>
            <h4>{{ member.name }}</h4>
            <p>{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section class="contact-section">
      <div class="container contact-grid">
        <div class="contact-info">
          <h2 class="section-title">联系我们</h2>
          <p class="contact-desc">有任何问题或合作意向？随时与我们取得联系。</p>

          <div class="contact-items">
            <div class="contact-item">
              <span class="ci-icon">📧</span>
              <div>
                <h4>邮箱</h4>
                <p>contact@rmbgaming.com</p>
              </div>
            </div>
            <div class="contact-item">
              <span class="ci-icon">💬</span>
              <div>
                <h4>在线客服</h4>
                <p>24/7 全天候支持</p>
              </div>
            </div>
            <div class="contact-item">
              <span class="ci-icon">📍</span>
              <div>
                <h4>办公地址</h4>
                <p>深圳市南山区科技园</p>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-form-wrapper">
          <transition name="fade" mode="out-in">
            <div v-if="submitted" class="success-msg" key="success">
              <span>✅</span>
              <h3>消息已发送！</h3>
              <p>我们会在 24 小时内回复您</p>
            </div>
            <form v-else @submit.prevent="handleSubmit" class="contact-form" key="form">
              <div class="form-group">
                <label>姓名</label>
                <input v-model="form.name" type="text" placeholder="您的姓名" required />
              </div>
              <div class="form-group">
                <label>邮箱</label>
                <input v-model="form.email" type="email" placeholder="your@email.com" required />
              </div>
              <div class="form-group">
                <label>留言</label>
                <textarea v-model="form.message" placeholder="请描述您的需求..." rows="4" required></textarea>
              </div>
              <button type="submit" class="btn-primary" style="width:100%; justify-content:center;">
                发送消息
              </button>
            </form>
          </transition>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-hero {
  padding: 80px 0 40px;
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

.page-desc { color: var(--text-secondary); font-size: 18px; }

/* Mission */
.mission-section { padding: 60px 0; }

.mission-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.mission-card {
  padding: 40px 32px;
  background: var(--bg-card);
  border: 1px solid rgba(184, 41, 234, 0.15);
  border-radius: var(--radius-md);
  text-align: center;
  transition: all 0.3s ease;
}

.mission-card:hover {
  border-color: rgba(184, 41, 234, 0.4);
  transform: translateY(-4px);
  box-shadow: var(--shadow-neon);
}

.mission-icon { font-size: 48px; margin-bottom: 20px; }

.mission-card h3 {
  font-family: 'Orbitron', sans-serif;
  font-size: 18px;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.mission-card p {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.8;
}

/* Timeline */
.timeline-section {
  padding: 80px 0;
  background: var(--bg-secondary);
}

.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0; bottom: 0;
  width: 2px;
  background: linear-gradient(var(--neon-purple), var(--neon-blue));
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  width: 50%;
  padding: 0 40px 40px 0;
}

.timeline-item.right {
  margin-left: 50%;
  padding: 0 0 40px 40px;
}

.timeline-dot {
  position: absolute;
  right: -8px;
  top: 8px;
  width: 16px; height: 16px;
  background: var(--neon-purple);
  border-radius: 50%;
  box-shadow: 0 0 12px var(--neon-purple);
}

.timeline-item.right .timeline-dot {
  right: auto;
  left: -8px;
}

.timeline-card {
  padding: 24px;
  background: var(--bg-card);
  border: 1px solid rgba(184, 41, 234, 0.15);
  border-radius: var(--radius-md);
}

.timeline-year {
  font-family: 'Orbitron', sans-serif;
  font-size: 24px;
  font-weight: 800;
}

.timeline-card h4 {
  font-family: 'Orbitron', sans-serif;
  font-size: 16px;
  margin: 8px 0;
  letter-spacing: 1px;
}

.timeline-card p {
  color: var(--text-secondary);
  font-size: 14px;
}

/* Team */
.team-section { padding: 80px 0; }

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.team-card {
  text-align: center;
  padding: 40px 20px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

.team-card:hover {
  border-color: rgba(184, 41, 234, 0.3);
  transform: translateY(-4px);
}

.team-avatar {
  font-size: 56px;
  margin-bottom: 16px;
}

.team-card h4 {
  font-family: 'Orbitron', sans-serif;
  font-size: 15px;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}

.team-card p {
  color: var(--neon-blue);
  font-size: 13px;
}

/* Contact */
.contact-section {
  padding: 80px 0;
  background: var(--bg-secondary);
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}

.contact-desc {
  color: var(--text-secondary);
  font-size: 16px;
  margin-bottom: 32px;
  line-height: 1.8;
}

.contact-items { display: flex; flex-direction: column; gap: 24px; }

.contact-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.ci-icon { font-size: 28px; }

.contact-item h4 {
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}

.contact-item p {
  color: var(--text-secondary);
  font-size: 14px;
}

/* Form */
.contact-form-wrapper {
  background: var(--bg-card);
  border: 1px solid rgba(184, 41, 234, 0.2);
  border-radius: var(--radius-md);
  padding: 40px;
}

.contact-form { display: flex; flex-direction: column; gap: 20px; }

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  color: var(--text-secondary);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-primary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm);
  color: #fff;
  font-size: 15px;
  font-family: inherit;
  outline: none;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--neon-purple);
  box-shadow: 0 0 12px rgba(184, 41, 234, 0.2);
}

.form-group textarea { resize: vertical; }

.success-msg {
  text-align: center;
  padding: 40px;
}

.success-msg span { font-size: 48px; display: block; margin-bottom: 16px; }
.success-msg h3 {
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  margin-bottom: 8px;
}
.success-msg p { color: var(--text-secondary); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 1024px) {
  .mission-grid { grid-template-columns: 1fr; }
  .team-grid { grid-template-columns: repeat(2, 1fr); }
  .contact-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .page-title { font-size: 28px; }
  .timeline::before { left: 20px; }
  .timeline-item,
  .timeline-item.right {
    width: 100%;
    margin-left: 0;
    padding: 0 0 30px 50px;
  }
  .timeline-dot,
  .timeline-item.right .timeline-dot {
    left: 12px; right: auto;
  }
  .team-grid { grid-template-columns: 1fr 1fr; }
  .contact-form-wrapper { padding: 24px; }
}
</style>
