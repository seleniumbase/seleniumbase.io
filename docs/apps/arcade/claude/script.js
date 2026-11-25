(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  let credits = 0;
  const creditsEl = $('credits'), coinBtn = $('coin'), coinMsg = $('coin-msg');
  const startBtn = $('start'), overlay = $('overlay');
  const setCredits = n => { credits = n; creditsEl.textContent = n; startBtn.disabled = n < 1 && !running; };

  // ---- Coin button ----
  coinBtn.addEventListener('click', () => {
    setCredits(credits + 1);
    coinMsg.textContent = 'Credit added. Head to the Play section and press Start.';
    beep(880, .08); setTimeout(() => beep(1320, .12), 80);
  });

  // ---- Tiny sound effects ----
  let ac;
  function beep(freq, dur, type = 'square') {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.value = freq; g.gain.value = .05;
      o.connect(g); g.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + dur);
    } catch (e) {}
  }

  // ---- Star Defender ----
  const cv = $('game'), ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
  let running = false, player, bullets, enemies, dir, score, lives, keys = {}, lastShot = 0, level, raf, last = 0;
  const scoreEl = $('score'), livesEl = $('lives');

  function spawnWave() {
    enemies = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++)
      enemies.push({ x: 50 + c * 48, y: 40 + r * 34, w: 28, h: 20, row: r });
    dir = 1;
  }
  function reset() {
    player = { x: W / 2 - 16, y: H - 36, w: 32, h: 16 };
    bullets = []; score = 0; lives = 3; level = 1;
    scoreEl.textContent = 0; livesEl.textContent = 3;
    spawnWave();
  }
  function startGame() {
    if (running || credits < 1) return;
    setCredits(credits - 1);
    reset(); running = true; startBtn.disabled = true;
    overlay.classList.add('off'); last = performance.now();
    raf = requestAnimationFrame(loop);
  }
  function endGame() {
    running = false; cancelAnimationFrame(raf);
    $('overlay-title').textContent = 'GAME OVER';
    $('overlay-sub').textContent = 'Score: ' + score + (credits ? '. Press Start to play again.' : '. Insert coin to play again.');
    overlay.classList.remove('off');
    startBtn.disabled = credits < 1;
    beep(150, .5, 'sawtooth');
    checkHighScore(score);
  }
  function fire() {
    const now = performance.now();
    if (!running || now - lastShot < 280) return;
    lastShot = now; bullets.push({ x: player.x + 15, y: player.y, w: 3, h: 10 });
    beep(1000, .05);
  }
  function update(dt) {
    const sp = 260 * dt;
    if (keys.left) player.x -= sp;
    if (keys.right) player.x += sp;
    player.x = Math.max(0, Math.min(W - player.w, player.x));
    if (keys.fire) fire();
    bullets.forEach(b => b.y -= 420 * dt);
    bullets = bullets.filter(b => b.y > -10);

    const speed = (30 + level * 12 + (32 - enemies.length) * 3) * dt;
    let edge = false;
    enemies.forEach(e => { e.x += dir * speed; if (e.x < 8 || e.x + e.w > W - 8) edge = true; });
    if (edge) { dir *= -1; enemies.forEach(e => e.y += 14); }

    for (const b of bullets) for (const e of enemies) {
      if (!b.dead && !e.dead && b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
        b.dead = e.dead = true; score += 10 * (4 - e.row); scoreEl.textContent = score; beep(300, .08, 'sawtooth');
      }
    }
    bullets = bullets.filter(b => !b.dead); enemies = enemies.filter(e => !e.dead);
    if (!enemies.length) { level++; spawnWave(); beep(660, .2); }

    if (enemies.some(e => e.y + e.h >= player.y)) {
      lives--; livesEl.textContent = lives; beep(120, .3, 'sawtooth');
      if (lives <= 0) return endGame();
      spawnWave();
    }
  }
  const colors = ['#ff2e97', '#ff8a1f', '#ffe600', '#39ff88'];
  function draw() {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 40; i++) ctx.fillRect((i * 97) % W, (i * 53 + level * 7) % H, 2, 2);
    enemies.forEach(e => {
      ctx.fillStyle = colors[e.row];
      ctx.fillRect(e.x + 4, e.y, e.w - 8, e.h);
      ctx.fillRect(e.x, e.y + 6, e.w, 8);
      ctx.fillStyle = '#000'; ctx.fillRect(e.x + 8, e.y + 5, 4, 4); ctx.fillRect(e.x + e.w - 12, e.y + 5, 4, 4);
    });
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(player.x, player.y + 8, player.w, 8);
    ctx.fillRect(player.x + 12, player.y, 8, 10);
    ctx.fillStyle = '#ffe600';
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));
  }
  function loop(t) {
    if (!running) return;
    const dt = Math.min((t - last) / 1000, .05); last = t;
    update(dt); if (running) { draw(); raf = requestAnimationFrame(loop); }
  }

  // ---- Controls ----
  startBtn.addEventListener('click', startGame);
  const map = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ' ': 'fire' };
  addEventListener('keydown', e => {
    if (!map[e.key] || /INPUT/.test(document.activeElement.tagName)) return;
    if (running) e.preventDefault();
    keys[map[e.key]] = true;
  });
  addEventListener('keyup', e => { if (map[e.key]) keys[map[e.key]] = false; });
  [['left', 'left'], ['right', 'right'], ['fire', 'fire']].forEach(([id, k]) => {
    const b = $(id);
    ['pointerdown'].forEach(ev => b.addEventListener(ev, e => { e.preventDefault(); keys[k] = true; }));
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, () => keys[k] = false));
  });

  // ---- High scores (saved in this browser) ----
  const KEY = 'neonQuarterScores', list = $('score-list'), form = $('name-form');
  let pending = 0;
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } };
  const save = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };
  let scores = load() || [{n:'ACE',s:900},{n:'ZAP',s:700},{n:'REX',s:500},{n:'MOE',s:300},{n:'POP',s:100}];
  function render() {
    list.innerHTML = '';
    scores.forEach(x => {
      const li = document.createElement('li');
      li.innerHTML = '<span></span><span></span>';
      li.children[0].textContent = x.n; li.children[1].textContent = x.s;
      list.appendChild(li);
    });
  }
  function checkHighScore(s) {
    if (s > 0 && (scores.length < 5 || s > scores[scores.length - 1].s)) {
      pending = s; form.classList.remove('hidden');
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      $('initials').focus({ preventScroll: true });
    }
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const n = $('initials').value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
    if (!n) return;
    scores.push({ n, s: pending });
    scores.sort((a, b) => b.s - a.s); scores = scores.slice(0, 5);
    save(scores); render(); form.classList.add('hidden'); form.reset(); pending = 0;
  });

  render(); setCredits(0); startBtn.disabled = true; reset(); draw();
})();
