// Game data with real images from 759gaming assets
export const categories = [
  { id: 'all', name: '全部', icon: '🎮' },
  { id: 'slot', name: '老虎机', icon: '🎰' },
  { id: 'fish', name: '捕鱼', icon: '🐟' },
  { id: 'live', name: '真人视讯', icon: '🎥' },
  { id: 'card', name: '棋牌', icon: '🃏' },
  { id: 'mini', name: '迷你游戏', icon: '⚡' },
  { id: 'sport', name: '体育竞技', icon: '⚽' }
]

export const providers = [
  'PG Soft', 'JILI', 'Pragmatic Play', 'Hacksaw', 'CQ9', 'FA CHAI', 'JDB', 'TADA'
]

export const games = [
  {
    id: 1,
    title: "Tiger's Grace",
    provider: 'PG Soft',
    category: 'slot',
    image: '/images/games/759/01.jpg',
    hot: true,
    new: false,
    rtp: 96.81,
    description: '迎接财富之虎，在充满东方神韵的卷轴上追寻巨额奖金。独特的金色虎纹符号带来无限好运。',
    features: ['Free Spins', 'Wild Multiplier', 'Bonus Game'],
    volatility: 'Medium'
  },
  {
    id: 2,
    title: 'Aztec Freespin',
    provider: 'Pragmatic Play',
    category: 'slot',
    image: '/images/games/759/02.jpg',
    hot: true,
    new: false,
    rtp: 96.50,
    description: '探索古老的阿兹特克文明，解锁神秘的免费旋转奖励。黄金面具符号开启宝藏之门。',
    features: ['Cluster Pays', 'Multiplier Spots', 'Free Spins'],
    volatility: 'High'
  },
  {
    id: 3,
    title: 'Ocean King',
    provider: 'JILI',
    category: 'fish',
    image: '/images/games/759/03.jpg',
    hot: false,
    new: true,
    rtp: 97.20,
    description: '深海捕鱼盛宴！精美的海底场景，多种武器选择，捕获稀有鱼种赢取丰厚奖励。',
    features: ['Multi-player', 'Boss Battle', 'Special Weapons'],
    volatility: 'Medium'
  },
  {
    id: 4,
    title: 'Dragons Grace',
    provider: 'PG Soft',
    category: 'slot',
    image: '/images/games/759/04.jpg',
    hot: true,
    new: false,
    rtp: 96.83,
    description: '孵化神龙蛋，释放远古力量！级联卷轴机制配合龙焰特效，打造极致视觉体验。',
    features: ['Cascading Reels', 'Dragon Feature', 'Progressive Multiplier'],
    volatility: 'High'
  },
  {
    id: 5,
    title: 'Fortune Sheep',
    provider: 'JILI',
    category: 'live',
    image: '/images/games/759/05.jpg',
    hot: false,
    new: false,
    rtp: 98.76,
    description: '可爱的绵羊主题赌场游戏。流畅的动画效果和多种下注选项，带来欢乐体验。',
    features: ['Live Dealer', 'Multiple Tables', 'Side Bets'],
    volatility: 'Low'
  },
  {
    id: 6,
    title: 'Phoenix Legend',
    provider: 'JILI',
    category: 'card',
    image: '/images/games/759/049.jpg',
    hot: false,
    new: true,
    rtp: 96.40,
    description: '凤凰涅槃传说。收集凤凰符号触发特殊奖励回合，浴火重生赢取大奖。',
    features: ['Card Collection', 'Bonus Round', 'Jackpot'],
    volatility: 'Medium'
  },
  {
    id: 7,
    title: 'Gate of Olympus',
    provider: 'Pragmatic Play',
    category: 'mini',
    image: '/images/games/759/050.jpg',
    hot: true,
    new: false,
    rtp: 95.50,
    description: '宙斯亲自降临！Pay Anywhere机制搭配随机乘数，最高可达500倍。',
    features: ['Wheel Bonus', 'Pachinko', 'Coin Flip', 'Cash Hunt'],
    volatility: 'High'
  },
  {
    id: 8,
    title: 'Zombie Hunter',
    provider: 'Hacksaw',
    category: 'slot',
    image: '/images/games/759/051.jpg',
    hot: true,
    new: false,
    rtp: 96.38,
    description: '末日僵尸猎杀主题的高波动性老虎机。VS符号对决带来高达100倍的乘数。',
    features: ['VS Symbols', 'Duel at Dawn', 'Train Robbery'],
    volatility: 'Extreme'
  },
  {
    id: 9,
    title: 'Glory of Roma',
    provider: 'JDB',
    category: 'slot',
    image: '/images/games/759/052.jpg',
    hot: false,
    new: true,
    rtp: 97.10,
    description: '古罗马竞技场主题。角斗士符号组合触发免费旋转和累积奖池。',
    features: ['Gladiator Bonus', 'Free Games', 'Jackpot'],
    volatility: 'Medium'
  },
  {
    id: 10,
    title: 'Captains Bounty',
    provider: 'FA CHAI',
    category: 'fish',
    image: '/images/games/759/053.jpg',
    hot: false,
    new: false,
    rtp: 97.50,
    description: '海盗船长寻宝之旅。使用特殊技能捕获传说中的宝藏，赢取丰厚赏金。',
    features: ['God Mode', 'Chain Lightning', 'Golden Fish'],
    volatility: 'Medium'
  },
  {
    id: 11,
    title: 'Empire of Gold',
    provider: 'Pragmatic Play',
    category: 'slot',
    image: '/images/games/759/054.jpg',
    hot: true,
    new: false,
    rtp: 96.50,
    description: '黄金帝国主题老虎机。华丽的视觉效果搭配多重奖励机制，让你沉浸在金色的财富世界中。',
    features: ['Pay Anywhere', 'Random Multipliers', 'Free Spins'],
    volatility: 'High'
  },
  {
    id: 12,
    title: 'Chicken Dash',
    provider: 'CQ9',
    category: 'card',
    image: '/images/games/759/055.jpg',
    hot: false,
    new: true,
    rtp: 99.50,
    description: '趣味小鸡快跑主题游戏。轻松愉快的玩法搭配丰厚奖励，适合所有玩家。',
    features: ['Insurance', 'Double Down', 'Split', 'Surrender'],
    volatility: 'Low'
  }
]

export const stats = [
  { label: '精品游戏', value: '2000+', icon: '🎮' },
  { label: '合作厂商', value: '50+', icon: '🤝' },
  { label: '支持语言', value: '20+', icon: '🌍' },
  { label: '终端适配', value: '全平台', icon: '📱' }
]
