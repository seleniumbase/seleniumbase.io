// --- Retro Web Audio Synthesizer (Zero External Audio Files Needed) ---
class ArcadeSynth {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type, duration, delay = 0, gainVal = 0.12) {
    if (!this.enabled) return;
    this.init();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(this.ctx.currentTime + delay);
    osc.stop(this.ctx.currentTime + delay + duration);
  }

  coin() {
    this.playTone(987.77, 'square', 0.08, 0);     // B5
    this.playTone(1318.51, 'square', 0.28, 0.08); // E6
  }

  laser() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  explosion() {
    this.playTone(140, 'sawtooth', 0.18, 0, 0.16);
    this.playTone(75, 'square', 0.24, 0.04, 0.16);
  }

  gameOver() {
    this.playTone(392, 'square', 0.16, 0);
    this.playTone(349.23, 'square', 0.16, 0.18);
    this.playTone(329.63, 'square', 0.16, 0.36);
    this.playTone(261.63, 'sawtooth', 0.45, 0.54);
  }
}

const synth = new ArcadeSynth();

// --- State & DOM Elements ---
let credits = 0;
let score = 0;

const creditEl = document.getElementById('credit-count');
const scoreEl = document.getElementById('player-score');
const insertCoinBtn = document.getElementById('insert-coin-btn');
const soundToggleBtn = document.getElementById('sound-toggle-btn');
const startGameBtn = document.getElementById('start-game-btn');
const gameStatusEl = document.getElementById('game-status');

function updateHUD() {
  creditEl.textContent = String(credits).padStart(2, '0');
  scoreEl.textContent = String(score).padStart(6, '0');
  startGameBtn.disabled = credits <= 0 || gameRunning;

  if (!gameRunning) {
    gameStatusEl.textContent = credits > 0 ? 'READY - PRESS START 1P' : 'INSERT COIN TO PLAY';
  }
}

insertCoinBtn.addEventListener('click', () => {
  credits = Math.min(99, credits + 1);
  synth.coin();
  updateHUD();
});

soundToggleBtn.addEventListener('click', () => {
  synth.enabled = !synth.enabled;
  soundToggleBtn.textContent = `SFX: ${synth.enabled ? 'ON' : 'OFF'}`;
  soundToggleBtn.setAttribute('aria-pressed', String(synth.enabled));
});

// --- Cabinet Spec Modal ---
const cabinetSpecs = {
  'cyber-runner': {
    title: "CYBER RUNNER '84 // HARDWARE SPECS",
    body: "CPU: Dual Motorola 68000 @ 12 MHz • Display: 25-inch Wells-Gardner CRT • Controls: Force-feedback steering wheel + turbo shifter • Top Speed: 220 MPH."
  },
  'void-invaders': {
    title: "VOID INVADERS // HARDWARE SPECS",
    body: "CPU: Zilog Z80 @ 4 MHz • Sound: Yamaha YM2149 FM Synth • Display: Vertical Raster RGB • Difficulty: Brutal after Wave 6."
  },
  'dungeon-byte': {
    title: "DUNGEON BYTE // HARDWARE SPECS",
    body: "Players: 2 Simultaneous Co-Op • Joysticks: 8-Way Leaf Switch • Features: Battery-backed high-score table & secret warp rooms."
  }
};

const modal = document.getElementById('spec-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

document.querySelectorAll('.inspect-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const key = e.target.closest('.cabinet-card').dataset.cabinet;
    const spec = cabinetSpecs[key];
    if (!spec) return;
    modalTitle.textContent = spec.title;
    modalBody.textContent = spec.body;
    modal.classList.remove('hidden');
    synth.playTone(660, 'square', 0.08);
  });
});

document.getElementById('close-modal-btn').addEventListener('click', () => {
  modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.add('hidden');
});

// --- Playable Mini-Game: Astro Defender ---
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let gameRunning = false;
let player = { x: canvas.width / 2 - 18, y: canvas.height - 36, w: 36, h: 18, speed: 6 };
let bullets = [];
let enemies = [];
let stars = Array.from({ length: 45 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  speed: 0.6 + Math.random() * 1.4
}));
let keys = {};
let spawnTimer = 0;

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (e.code === 'Space' && gameRunning) {
    e.preventDefault();
    fireBullet();
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

function fireBullet() {
  if (bullets.length < 4) {
    bullets.push({ x: player.x + player.w / 2 - 2, y: player.y - 8, w: 4, h: 12, speed: 9 });
    synth.laser();
  }
}

function startGame() {
  if (credits <= 0 || gameRunning) return;
  credits -= 1;
  score = 0;
  bullets = [];
  enemies = [];
  player.x = canvas.width / 2 - player.w / 2;
  gameRunning = true;
  gameStatusEl.textContent = 'WAVE IN PROGRESS';
  updateHUD();
}

startGameBtn.addEventListener('click', startGame);

function updateGame() {
  // Background starfield
  stars.forEach((s) => {
    s.y += s.speed;
    if (s.y > canvas.height) {
      s.y = 0;
      s.x = Math.random() * canvas.width;
    }
  });

  if (!gameRunning) return;

  // Player movement
  if ((keys['ArrowLeft'] || keys['KeyA']) && player.x > 10) {
    player.x -= player.speed;
  }
  if ((keys['ArrowRight'] || keys['KeyD']) && player.x < canvas.width - player.w - 10) {
    player.x += player.speed;
  }

  // Bullets
  bullets.forEach((b) => (b.y -= b.speed));
  bullets = bullets.filter((b) => b.y + b.h > 0);

  // Spawn enemies
  spawnTimer++;
  if (spawnTimer > 38) {
    spawnTimer = 0;
    enemies.push({
      x: 20 + Math.random() * (canvas.width - 56),
      y: -24,
      w: 28,
      h: 20,
      speed: 2 + Math.min(3.5, score / 2500)
    });
  }

  // Move enemies & check collisions
  for (let i = enemies.length - 1; i >= 0; i--) {
    const en = enemies[i];
    en.y += en.speed;

    // Hit by bullet
    for (let j = bullets.length - 1; j >= 0; j--) {
      const b = bullets[j];
      if (b.x < en.x + en.w && b.x + b.w > en.x && b.y < en.y + en.h && b.y + b.h > en.y) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 100;
        synth.explosion();
        updateHUD();
        break;
      }
    }

    // Reached bottom or collided with player
    if (en && en.y + en.h >= player.y) {
      gameRunning = false;
      synth.gameOver();
      updateHUD();
      break;
    }
  }
}

function drawGame() {
  ctx.fillStyle = '#05020a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stars
  ctx.fillStyle = '#7b68ee';
  stars.forEach((s) => ctx.fillRect(s.x, s.y, 2, 2));

  if (!gameRunning) {
    ctx.fillStyle = '#00f0ff';
    ctx.font = '18px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ASTRO DEFENDER', canvas.width / 2, canvas.height / 2 - 24);

    ctx.fillStyle = '#ffe600';
    ctx.font = '12px "Press Start 2P", monospace';
    const promptText = credits > 0 ? 'PRESS [START 1P] BELOW' : 'INSERT COIN TO PLAY';
    ctx.fillText(promptText, canvas.width / 2, canvas.height / 2 + 16);

    if (score > 0) {
      ctx.fillStyle = '#ff2a85';
      ctx.fillText(`FINAL SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 52);
    }
    return;
  }

  // Player Ship
  ctx.fillStyle = '#00f0ff';
  ctx.fillRect(player.x, player.y + 8, player.w, 10);
  ctx.fillRect(player.x + 12, player.y, 12, 8);

  // Lasers
  ctx.fillStyle = '#ffe600';
  bullets.forEach((b) => ctx.fillRect(b.x, b.y, b.w, b.h));

  // Alien Invaders
  ctx.fillStyle = '#ff2a85';
  enemies.forEach((en) => {
    ctx.fillRect(en.x + 4, en.y, en.w - 8, en.h - 4);
    ctx.fillRect(en.x, en.y + 6, en.w, 8);
  });
}

function gameLoop() {
  updateGame();
  drawGame();
  requestAnimationFrame(gameLoop);
}

updateHUD();
gameLoop();