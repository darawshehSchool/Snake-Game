(() => {
  'use strict';

  /* ======================================================================
     1. CONFIGURATION & CONSTANTS
     ====================================================================== */
  const GRID_SIZE = 20;                            // 20x20 logical grid
  const CANVAS_LOGIC_SIZE = 600;                   // 600x600 coordinate space
  const CELL_SIZE = CANVAS_LOGIC_SIZE / GRID_SIZE; // 30px per cell

  const BASE_STEP_MS = 145;                        // Initial speed: 145ms per grid cell
  const MIN_STEP_MS = 52;                          // Maximum speed cap: 52ms per grid cell
  const SPEED_DECAY_PER_FOOD = 2.6;                // Speed increase per food eaten
  const POINTS_PER_FOOD = 10;
  const STORAGE_KEY = 'neon_viper_best_score_v1';

  const DIRS = {
    UP:    { x:  0, y: -1, name: 'UP' },
    DOWN:  { x:  0, y:  1, name: 'DOWN' },
    LEFT:  { x: -1, y:  0, name: 'LEFT' },
    RIGHT: { x:  1, y:  0, name: 'RIGHT' }
  };

  /* ======================================================================
     2. WEB AUDIO SYNTHESIZER (Zero External Dependencies)
     ====================================================================== */
  class ArcadeAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      if (this.enabled) {
        this.init();
        this.playClick();
      }
      return this.enabled;
    }

    playTone(freq, type, duration, vol = 0.12, slideFreq = null, delay = 0) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const now = this.ctx.currentTime + delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        if (slideFreq) {
          osc.frequency.exponentialRampToValueAtTime(slideFreq, now + duration);
        }

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.02);
      } catch (_) {
        // Ignore audio errors on restricted devices
      }
    }

    playTurn() {
      this.playTone(240, 'triangle', 0.045, 0.06, 310);
    }

    playEat(speedMultiplier = 1) {
      const base = 440 + Math.min(300, (speedMultiplier - 1) * 180);
      this.playTone(base, 'sine', 0.09, 0.14, base * 1.25, 0);
      this.playTone(base * 1.5, 'triangle', 0.14, 0.14, base * 2, 0.055);
    }

    playSpeedUp() {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((n, i) => {
        this.playTone(n, 'triangle', 0.11, 0.12, null, i * 0.055);
      });
    }

    playClick() {
      this.playTone(620, 'sine', 0.05, 0.08, 880);
    }

    playPause(isPaused) {
      if (isPaused) {
        this.playTone(520, 'sine', 0.08, 0.1, 340, 0);
      } else {
        this.playTone(340, 'sine', 0.08, 0.1, 560, 0);
      }
    }

    playCrash() {
      this.playTone(190, 'sawtooth', 0.32, 0.18, 45, 0);
      this.playTone(135, 'square', 0.38, 0.14, 38, 0.05);
    }

    playNewRecord() {
      const melody = [587.33, 783.99, 987.77, 1174.66];
      melody.forEach((freq, idx) => {
        this.playTone(freq, 'triangle', 0.16, 0.15, null, idx * 0.08);
      });
    }
  }

  /* ======================================================================
     3. DOM ELEMENTS & STATE
     ====================================================================== */
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const canvasContainer = document.getElementById('canvasContainer');

  // Header & Telemetry Elements
  const scoreDisplay = document.getElementById('scoreDisplay');
  const bestScoreDisplay = document.getElementById('bestScoreDisplay');
  const speedDisplay = document.getElementById('speedDisplay');
  const lengthDisplay = document.getElementById('lengthDisplay');
  const levelDisplay = document.getElementById('levelDisplay');
  const speedBarFill = document.getElementById('speedBarFill');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');

  // Toolbar Buttons
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const pauseBtnLabel = document.getElementById('pauseBtnLabel');
  const pauseIcon = document.getElementById('pauseIcon');
  const restartBtn = document.getElementById('restartBtn');
  const soundBtn = document.getElementById('soundBtn');
  const soundOnIcon = document.getElementById('soundOnIcon');
  const soundOffIcon = document.getElementById('soundOffIcon');

  // Overlays & Overlay Buttons
  const startOverlay = document.getElementById('startOverlay');
  const pauseOverlay = document.getElementById('pauseOverlay');
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  const overlayStartBtn = document.getElementById('overlayStartBtn');
  const overlayResumeBtn = document.getElementById('overlayResumeBtn');
  const overlayPauseRestartBtn = document.getElementById('overlayPauseRestartBtn');
  const overlayRestartBtn = document.getElementById('overlayRestartBtn');

  // Game Over Summary Elements
  const gameOverBadge = document.getElementById('gameOverBadge');
  const gameOverReason = document.getElementById('gameOverReason');
  const finalScoreVal = document.getElementById('finalScoreVal');
  const finalBestVal = document.getElementById('finalBestVal');
  const finalApplesVal = document.getElementById('finalApplesVal');
  const finalSpeedVal = document.getElementById('finalSpeedVal');

  // Touch D-Pad Buttons
  const dpadButtons = document.querySelectorAll('.dpad-btn');

  const audio = new ArcadeAudio();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Persistent Best Score
  let bestScore = 0;
  function loadBestScore() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!Number.isNaN(parsed) && parsed >= 0) {
          bestScore = parsed;
        }
      }
    } catch (_) {
      bestScore = 0;
    }
    bestScoreDisplay.textContent = String(bestScore);
  }

  function saveBestScore(newBest) {
    bestScore = newBest;
    bestScoreDisplay.textContent = String(bestScore);
    try {
      localStorage.setItem(STORAGE_KEY, String(bestScore));
    } catch (_) {
      // Ignore storage error in restricted mode
    }
  }

  /* ======================================================================
     4. GAME STATE VARIABLES
     ====================================================================== */
  // States: 'IDLE' | 'RUNNING' | 'PAUSED' | 'GAMEOVER'
  let gameState = 'IDLE';

  let snake = [];
  let prevSnake = [];
  let currentDir = DIRS.RIGHT;
  let directionQueue = []; // Buffered turns to prevent instant self-reversal
  let food = { x: 14, y: 10 };
  let score = 0;
  let applesEaten = 0;
  let stepIntervalMs = BASE_STEP_MS;
  let newRecordAchieved = false;
  let stepsTaken = 0;

  // Timing & Interpolation
  let lastFrameTime = performance.now();
  let tickAccumulator = 0;

  // Visual FX Arrays
  let particles = [];
  let floatingTexts = [];
  let foodSpawnTime = performance.now();

  /* ======================================================================
     5. INITIALIZATION & GAME RESET
     ====================================================================== */
  function initGameData(isPreview = false) {
    const startX = isPreview ? 10 : 8;
    const startY = isPreview ? 1 : 10;

    snake = [
      { x: startX,     y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY }
    ];
    prevSnake = snake.map(seg => ({ ...seg }));

    currentDir = DIRS.RIGHT;
    directionQueue = [];
    score = 0;
    applesEaten = 0;
    stepIntervalMs = BASE_STEP_MS;
    newRecordAchieved = false;
    stepsTaken = 0;
    tickAccumulator = 0;
    particles = [];
    floatingTexts = [];

    if (isPreview) {
      food = { x: 15, y: 1 };
      foodSpawnTime = performance.now() - 500;
    } else {
      spawnFood();
    }
    updateHUD(false);
  }

  function spawnFood() {
    const occupied = new Set(snake.map(s => `${s.x},${s.y}`));
    const available = [];

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (!occupied.has(`${x},${y}`)) {
          available.push({ x, y });
        }
      }
    }

    if (available.length > 0) {
      const choice = available[Math.floor(Math.random() * available.length)];
      food = choice;
      foodSpawnTime = performance.now();
    }
  }

  /* ======================================================================
     6. DIRECTION QUEUE (Prevents 180° Instant Reversal Bug)
     ====================================================================== */
  function isOppositeDirection(dirA, dirB) {
    return dirA.x + dirB.x === 0 && dirA.y + dirB.y === 0;
  }

  function queueDirection(newDirKey) {
    const desiredDir = DIRS[newDirKey];
    if (!desiredDir) return;

    // Visual highlight on D-pad and sidebar kbd badge
    flashDirectionIndicator(newDirKey);

    if (gameState !== 'RUNNING') return;

    // If the player presses A / Left on tick 0 before any step has been taken,
    // orient the starting 3-segment horizontal snake to face LEFT so A works immediately on launch.
    if (stepsTaken === 0 && directionQueue.length === 0 && newDirKey === 'LEFT' && currentDir.name === 'RIGHT') {
      snake.reverse();
      prevSnake = snake.map(seg => ({ ...seg }));
      currentDir = DIRS.LEFT;
      audio.playTurn();
      return;
    }

    // Compare against the last queued direction, or current committed direction if queue is empty
    const referenceDir = directionQueue.length > 0
      ? directionQueue[directionQueue.length - 1]
      : currentDir;

    // Ignore same direction or 180-degree instant reversal
    if (desiredDir.name === referenceDir.name || isOppositeDirection(desiredDir, referenceDir)) {
      return;
    }

    // Cap buffer at 2 rapid inputs per tick so controls feel snappy without lag
    if (directionQueue.length < 2) {
      directionQueue.push(desiredDir);
      audio.playTurn();
    }
  }

  function flashDirectionIndicator(dirKey) {
    const dpadBtn = document.querySelector(`.dpad-btn[data-dir="${dirKey}"]`);
    if (dpadBtn) {
      dpadBtn.classList.add('active-press');
      setTimeout(() => dpadBtn.classList.remove('active-press'), 130);
    }
    const kbdEls = document.querySelectorAll(`kbd[data-dir="${dirKey}"]`);
    kbdEls.forEach((el) => {
      el.classList.add('active-key');
      setTimeout(() => el.classList.remove('active-key'), 130);
    });
  }

  /* ======================================================================
     7. GAMEPLAY STATE TRANSITIONS (Start, Pause/Resume, Restart, Game Over)
     ====================================================================== */
  function releaseButtonFocus() {
    if (document.activeElement && typeof document.activeElement.blur === 'function' && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
    if (canvas && typeof canvas.focus === 'function') {
      canvas.focus({ preventScroll: true });
    }
  }

  function startGame() {
    audio.init();
    audio.playClick();
    initGameData();
    gameState = 'RUNNING';
    lastFrameTime = performance.now();
    syncUIState();
    releaseButtonFocus();
  }

  function togglePause() {
    if (gameState === 'RUNNING') {
      gameState = 'PAUSED';
      audio.playPause(true);
      syncUIState();
    } else if (gameState === 'PAUSED') {
      gameState = 'RUNNING';
      lastFrameTime = performance.now();
      audio.playPause(false);
      syncUIState();
      releaseButtonFocus();
    }
  }

  function restartGame() {
    audio.init();
    audio.playClick();
    initGameData();
    gameState = 'RUNNING';
    lastFrameTime = performance.now();
    syncUIState();
    releaseButtonFocus();
  }

  function triggerGameOver(reasonText) {
    gameState = 'GAMEOVER';

    if (!prefersReducedMotion) {
      canvasContainer.classList.remove('shake');
      void canvasContainer.offsetWidth; // Reflow to restart animation
      canvasContainer.classList.add('shake');
    }

    // Spawn crash particles at head
    const head = snake[0];
    spawnParticles(
      (head.x + 0.5) * CELL_SIZE,
      (head.y + 0.5) * CELL_SIZE,
      '#F43F5E',
      28
    );

    if (newRecordAchieved && score > 0) {
      audio.playNewRecord();
      gameOverBadge.textContent = 'New Best Score!';
      gameOverBadge.className = 'overlay-badge record';
    } else {
      audio.playCrash();
      gameOverBadge.textContent = 'Collision Detected';
      gameOverBadge.className = 'overlay-badge danger';
    }

    gameOverReason.textContent = reasonText;
    finalScoreVal.textContent = String(score);
    finalBestVal.textContent = String(bestScore);
    finalApplesVal.textContent = String(applesEaten);
    finalSpeedVal.textContent = getSpeedMultiplierText();

    syncUIState();
  }

  function syncUIState() {
    // Overlays
    startOverlay.classList.toggle('hidden', gameState !== 'IDLE');
    pauseOverlay.classList.toggle('hidden', gameState !== 'PAUSED');
    gameOverOverlay.classList.toggle('hidden', gameState !== 'GAMEOVER');

    // Toolbar Buttons
    if (gameState === 'IDLE') {
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      restartBtn.disabled = true;
      pauseBtnLabel.textContent = 'Pause';
      statusDot.className = 'status-dot';
      statusText.textContent = 'READY TO LAUNCH';
    } else if (gameState === 'RUNNING') {
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      restartBtn.disabled = false;
      pauseBtnLabel.textContent = 'Pause';
      pauseIcon.innerHTML = '<rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect>';
      statusDot.className = 'status-dot';
      statusText.textContent = 'IN PROGRESS';
    } else if (gameState === 'PAUSED') {
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      restartBtn.disabled = false;
      pauseBtnLabel.textContent = 'Resume';
      pauseIcon.innerHTML = '<polygon points="6 4 20 12 6 20 6 4"></polygon>';
      statusDot.className = 'status-dot paused';
      statusText.textContent = 'SYSTEM PAUSED';
    } else if (gameState === 'GAMEOVER') {
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      restartBtn.disabled = false;
      pauseBtnLabel.textContent = 'Pause';
      statusDot.className = 'status-dot over';
      statusText.textContent = 'RUN TERMINATED';
    }
  }

  /* ======================================================================
     8. HUD & SPEED CALCULATIONS
     ====================================================================== */
  function getSpeedMultiplier() {
    return BASE_STEP_MS / stepIntervalMs;
  }

  function getSpeedMultiplierText() {
    return `${getSpeedMultiplier().toFixed(1)}x`;
  }

  function updateHUD(animateScore = false) {
    scoreDisplay.textContent = String(score);
    bestScoreDisplay.textContent = String(bestScore);
    speedDisplay.textContent = getSpeedMultiplierText();
    lengthDisplay.textContent = String(snake.length);

    const level = Math.floor(applesEaten / 5) + 1;
    levelDisplay.textContent = String(level);

    const speedProgress = Math.min(
      100,
      Math.max(12, ((BASE_STEP_MS - stepIntervalMs) / (BASE_STEP_MS - MIN_STEP_MS)) * 100)
    );
    speedBarFill.style.width = `${speedProgress}%`;

    if (animateScore && !prefersReducedMotion) {
      scoreDisplay.classList.add('pop');
      setTimeout(() => scoreDisplay.classList.remove('pop'), 160);
    }
  }

  /* ======================================================================
     9. CORE LOGIC STEP (Fixed-Timestep Grid Update)
     ====================================================================== */
  function stepGameLogic() {
    // Record previous positions for smooth 60fps interpolation
    prevSnake = snake.map(seg => ({ ...seg }));

    // Consume next valid buffered direction
    if (directionQueue.length > 0) {
      currentDir = directionQueue.shift();
    }

    const nextHead = {
      x: snake[0].x + currentDir.x,
      y: snake[0].y + currentDir.y
    };

    // 1. Check Wall Collision
    if (
      nextHead.x < 0 ||
      nextHead.x >= GRID_SIZE ||
      nextHead.y < 0 ||
      nextHead.y >= GRID_SIZE
    ) {
      triggerGameOver('Your viper collided with the perimeter energy wall.');
      return;
    }

    // 2. Check Will Eat Food
    const eatingFood = (nextHead.x === food.x && nextHead.y === food.y);

    // 3. Check Self Collision (Note: if not eating, the last tail segment moves out of the way)
    const checkLimit = eatingFood ? snake.length : snake.length - 1;
    for (let i = 0; i < checkLimit; i++) {
      if (snake[i].x === nextHead.x && snake[i].y === nextHead.y) {
        triggerGameOver('Your viper collided with its own cybernetic tail.');
        return;
      }
    }

    // 4. Advance Snake
    stepsTaken += 1;
    snake.unshift(nextHead);

    if (eatingFood) {
      // Keep tail so snake grows by 1, duplicate tail in prevSnake so interpolation length matches
      prevSnake.push({ ...prevSnake[prevSnake.length - 1] });

      applesEaten += 1;
      score += POINTS_PER_FOOD;

      if (score > bestScore) {
        newRecordAchieved = true;
        saveBestScore(score);
      }

      // Gradually increase speed as score increases
      const prevLevel = Math.floor((applesEaten - 1) / 5) + 1;
      stepIntervalMs = Math.max(
        MIN_STEP_MS,
        BASE_STEP_MS - applesEaten * SPEED_DECAY_PER_FOOD
      );
      const newLevel = Math.floor(applesEaten / 5) + 1;

      // Audio & Visual Feedback
      const foodPx = (food.x + 0.5) * CELL_SIZE;
      const foodPy = (food.y + 0.5) * CELL_SIZE;

      spawnParticles(foodPx, foodPy, '#F43F5E', 18);
      spawnParticles(foodPx, foodPy, '#34D399', 10);
      spawnFloatingText(`+${POINTS_PER_FOOD}`, foodPx, foodPy - 8, '#34D399');

      if (newLevel > prevLevel) {
        audio.playSpeedUp();
        spawnFloatingText(`SPEED LEVEL ${newLevel}!`, CANVAS_LOGIC_SIZE / 2, 70, '#22D3EE');
      } else {
        audio.playEat(getSpeedMultiplier());
      }

      updateHUD(true);
      spawnFood();
    } else {
      snake.pop();
    }
  }

  /* ======================================================================
     10. VISUAL FX (Particles & Floating Score Popups)
     ====================================================================== */
  function spawnParticles(x, y, color, count = 16) {
    if (prefersReducedMotion) return;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 1.4 + Math.random() * 3.8;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 3.2,
        color,
        alpha: 1,
        decay: 0.024 + Math.random() * 0.02
      });
    }
  }

  function spawnFloatingText(text, x, y, color = '#34D399') {
    if (prefersReducedMotion) return;
    floatingTexts.push({
      text,
      x: Math.max(55, Math.min(CANVAS_LOGIC_SIZE - 55, x)),
      y: Math.max(35, Math.min(CANVAS_LOGIC_SIZE - 25, y)),
      vy: -1.1,
      alpha: 1,
      color
    });
  }

  function updateAndDrawFX() {
    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Floating Score / Level Texts
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.022;

      if (ft.alpha <= 0) {
        floatingTexts.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, ft.alpha));
      ctx.font = '800 15px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = ft.color;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 8;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
  }

  /* ======================================================================
     11. CANVAS RENDERER (60FPS Interpolated Arcade Graphics)
     ====================================================================== */
  function drawRoundedRect(x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function renderScene(interpFactor, timestamp) {
    // 1. Deep Cyber Arena Background
    ctx.fillStyle = '#070712';
    ctx.fillRect(0, 0, CANVAS_LOGIC_SIZE, CANVAS_LOGIC_SIZE);

    // 2. Reactive Grid Cells near Head & Food
    const head = snake[0] || { x: 10, y: 10 };
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const distHead = Math.hypot(x - head.x, y - head.y);
        const distFood = Math.hypot(x - food.x, y - food.y);

        if (distHead < 3.2) {
          const intensity = (1 - distHead / 3.2) * 0.09;
          ctx.fillStyle = `rgba(52, 211, 153, ${intensity})`;
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        } else if (distFood < 2.8) {
          const intensity = (1 - distFood / 2.8) * 0.08;
          ctx.fillStyle = `rgba(244, 63, 94, ${intensity})`;
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    // 3. Crisp Grid Hairlines
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.085)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < GRID_SIZE; i++) {
      const pos = i * CELL_SIZE;
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, CANVAS_LOGIC_SIZE);
      ctx.moveTo(0, pos);
      ctx.lineTo(CANVAS_LOGIC_SIZE, pos);
    }
    ctx.stroke();

    // 4. Draw Pulsing Plasma Core Food
    const foodCenterX = (food.x + 0.5) * CELL_SIZE;
    const foodCenterY = (food.y + 0.5) * CELL_SIZE;
    const elapsedFood = Math.max(0, timestamp - foodSpawnTime);
    const spawnScale = Math.max(0.35, Math.min(1, elapsedFood / 180));
    const pulse = prefersReducedMotion ? 1 : 1 + Math.sin(timestamp * 0.008) * 0.12;
    const haloRadius = Math.max(2, CELL_SIZE * 0.44 * spawnScale);
    const coreRadius = Math.max(2, (CELL_SIZE * 0.34) * pulse * spawnScale);

    ctx.save();
    // Outer Orbiting Halo Ring
    ctx.strokeStyle = 'rgba(251, 113, 133, 0.45)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(foodCenterX, foodCenterY, haloRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Glowing Plasma Orb
    ctx.shadowColor = '#F43F5E';
    ctx.shadowBlur = 18;
    const foodGrad = ctx.createRadialGradient(
      foodCenterX - 2, foodCenterY - 2, 0.5,
      foodCenterX, foodCenterY, coreRadius
    );
    foodGrad.addColorStop(0, '#FFF1F2');
    foodGrad.addColorStop(0.45, '#FB7185');
    foodGrad.addColorStop(1, '#E11D48');

    ctx.fillStyle = foodGrad;
    ctx.beginPath();
    ctx.arc(foodCenterX, foodCenterY, coreRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. Draw Interpolated Neon Snake (Tail to Head)
    const t = (gameState === 'RUNNING' && !prefersReducedMotion) ? interpFactor : 1;

    for (let i = snake.length - 1; i >= 0; i--) {
      const curr = snake[i];
      const prev = prevSnake[i] || curr;

      const ix = prev.x + (curr.x - prev.x) * t;
      const iy = prev.y + (curr.y - prev.y) * t;

      const cx = (ix + 0.5) * CELL_SIZE;
      const cy = (iy + 0.5) * CELL_SIZE;

      const isHead = (i === 0);
      const ratio = i / Math.max(1, snake.length - 1);

      // Taper slightly toward tail
      const segSize = isHead
        ? CELL_SIZE * 0.88
        : CELL_SIZE * (0.82 - ratio * 0.22);

      const half = segSize / 2;

      ctx.save();
      if (isHead) {
        ctx.shadowColor = '#34D399';
        ctx.shadowBlur = 16;
        ctx.fillStyle = '#34D399';
      } else {
        // Smooth neon gradient from Emerald -> Cyan -> Violet along the body
        const r = Math.round(52 + ratio * (124 - 52));
        const g = Math.round(211 + ratio * (58 - 211));
        const b = Math.round(153 + ratio * (237 - 153));
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
        ctx.shadowBlur = 8;
      }

      drawRoundedRect(cx - half, cy - half, segSize, segSize, isHead ? 9 : 7);
      ctx.fill();

      // Inner Core Highlight on Body Segments
      if (!isHead && i % 2 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
        drawRoundedRect(cx - half * 0.45, cy - half * 0.45, segSize * 0.45, segSize * 0.45, 3);
        ctx.fill();
      }

      // Directional Eyes on the Viper Head
      if (isHead) {
        const eyeOffsetForward = CELL_SIZE * 0.16;
        const eyeOffsetSide = CELL_SIZE * 0.18;

        const perpX = -currentDir.y;
        const perpY = currentDir.x;

        const leftEyeX = cx + currentDir.x * eyeOffsetForward + perpX * eyeOffsetSide;
        const leftEyeY = cy + currentDir.y * eyeOffsetForward + perpY * eyeOffsetSide;
        const rightEyeX = cx + currentDir.x * eyeOffsetForward - perpX * eyeOffsetSide;
        const rightEyeY = cy + currentDir.y * eyeOffsetForward - perpY * eyeOffsetSide;

        ctx.fillStyle = '#070712';
        ctx.beginPath();
        ctx.arc(leftEyeX, leftEyeY, 3.2, 0, Math.PI * 2);
        ctx.arc(rightEyeX, rightEyeY, 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(leftEyeX + currentDir.x * 0.8, leftEyeY + currentDir.y * 0.8, 1.3, 0, Math.PI * 2);
        ctx.arc(rightEyeX + currentDir.x * 0.8, rightEyeY + currentDir.y * 0.8, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // 6. Particles & Floating Text Popups
    updateAndDrawFX();
  }

  /* ======================================================================
     12. MAIN ANIMATION LOOP (requestAnimationFrame)
     ====================================================================== */
  function gameLoop(timestamp) {
    requestAnimationFrame(gameLoop);

    const delta = Math.max(0, Math.min(100, timestamp - lastFrameTime));
    lastFrameTime = timestamp;

    if (gameState === 'RUNNING') {
      tickAccumulator += delta;
      while (tickAccumulator >= stepIntervalMs && gameState === 'RUNNING') {
        tickAccumulator -= stepIntervalMs;
        stepGameLogic();
      }
    }

    const interp = Math.max(0, Math.min(1, tickAccumulator / stepIntervalMs));
    renderScene(interp, timestamp);
  }

  /* ======================================================================
     13. INPUT HANDLERS (WASD + Arrow Keys via e.code & e.key, Touch, D-Pad)
     ====================================================================== */
  // Physical keycode mapping (works across English, Arabic, CapsLock, etc.)
  const CODE_TO_DIR = {
    KeyW: 'UP',       ArrowUp: 'UP',
    KeyS: 'DOWN',     ArrowDown: 'DOWN',
    KeyA: 'LEFT',     ArrowLeft: 'LEFT',
    KeyD: 'RIGHT',    ArrowRight: 'RIGHT'
  };

  // Character key fallback (including Arabic keyboard layout equivalents for WASD)
  const KEY_TO_DIR = {
    w: 'UP',    W: 'UP',    ArrowUp: 'UP',    Up: 'UP',       'ص': 'UP',
    s: 'DOWN',  S: 'DOWN',  ArrowDown: 'DOWN',Down: 'DOWN',   'س': 'DOWN',
    a: 'LEFT',  A: 'LEFT',  ArrowLeft: 'LEFT',Left: 'LEFT',   'ش': 'LEFT',
    d: 'RIGHT', D: 'RIGHT', ArrowRight: 'RIGHT',Right: 'RIGHT','ي': 'RIGHT'
  };

  // Legacy numeric keyCode fallback (87=W, 83=S, 65=A, 68=D, 38=Up, 40=Down, 37=Left, 39=Right)
  const KEYCODE_TO_DIR = {
    87: 'UP',    38: 'UP',
    83: 'DOWN',  40: 'DOWN',
    65: 'LEFT',  37: 'LEFT',
    68: 'RIGHT', 39: 'RIGHT'
  };

  function resolveDirectionFromKeyboardEvent(e) {
    const code = e.code || '';
    if (CODE_TO_DIR[code]) return CODE_TO_DIR[code];

    const key = e.key || '';
    if (KEY_TO_DIR[key]) return KEY_TO_DIR[key];
    if (key.length === 1 && KEY_TO_DIR[key.toLowerCase()]) {
      return KEY_TO_DIR[key.toLowerCase()];
    }

    const numCode = e.keyCode || e.which || 0;
    if (KEYCODE_TO_DIR[numCode]) return KEYCODE_TO_DIR[numCode];

    return null;
  }

  function handleKeyDown(e) {
    const code = e.code || '';
    const key = e.key || '';

    const mappedDir = resolveDirectionFromKeyboardEvent(e);
    if (mappedDir) {
      e.preventDefault();
      if (gameState === 'IDLE') {
        startGame();
      }
      queueDirection(mappedDir);
      return;
    }

    // Space or P: Start / Pause / Resume / Play Again
    if (code === 'Space' || code === 'KeyP' || key === ' ' || key === 'p' || key === 'P' || key === 'ح') {
      e.preventDefault();
      if (gameState === 'IDLE' || gameState === 'GAMEOVER') {
        startGame();
      } else if (gameState === 'RUNNING' || gameState === 'PAUSED') {
        togglePause();
      }
      return;
    }

    // R: Quick Restart
    if (code === 'KeyR' || key === 'r' || key === 'R' || key === 'ق') {
      e.preventDefault();
      if (gameState !== 'IDLE') {
        restartGame();
      }
      return;
    }

    // M: Mute / Unmute Audio
    if (code === 'KeyM' || key === 'm' || key === 'M' || key === 'ة') {
      e.preventDefault();
      handleSoundToggle();
    }
  }

  // Listen on window in capture phase so no focused element can swallow WASD/Arrow keys
  window.addEventListener('keydown', handleKeyDown, { capture: true });

  // On-Screen D-Pad Buttons (PointerDown for zero mobile tap delay)
  dpadButtons.forEach((btn) => {
    const dir = btn.getAttribute('data-dir');
    const triggerDir = (e) => {
      e.preventDefault();
      btn.classList.add('active-press');
      if (gameState === 'IDLE') {
        startGame();
      }
      queueDirection(dir);
    };
    const releaseDir = () => btn.classList.remove('active-press');

    btn.addEventListener('pointerdown', triggerDir);
    btn.addEventListener('pointerup', releaseDir);
    btn.addEventListener('pointerleave', releaseDir);
    btn.addEventListener('pointercancel', releaseDir);
  });

  // Touch Swipe Gestures on the Canvas Arena
  let touchStartX = null;
  let touchStartY = null;
  const SWIPE_THRESHOLD = 22;

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (touchStartX === null || touchStartY === null || e.touches.length === 0) return;

    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;

    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      queueDirection(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      queueDirection(dy > 0 ? 'DOWN' : 'UP');
    }

    // Reset origin so continuous finger movement can chain turns smoothly
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    touchStartX = null;
    touchStartY = null;
  }, { passive: true });

  // UI Button Wiring
  function handleSoundToggle() {
    const isEnabled = audio.toggle();
    soundBtn.setAttribute('aria-pressed', String(isEnabled));
    soundOnIcon.style.display = isEnabled ? 'block' : 'none';
    soundOffIcon.style.display = isEnabled ? 'none' : 'block';
    releaseButtonFocus();
  }

  startBtn.addEventListener('click', startGame);
  overlayStartBtn.addEventListener('click', startGame);

  pauseBtn.addEventListener('click', togglePause);
  overlayResumeBtn.addEventListener('click', togglePause);

  restartBtn.addEventListener('click', restartGame);
  overlayPauseRestartBtn.addEventListener('click', restartGame);
  overlayRestartBtn.addEventListener('click', restartGame);

  soundBtn.addEventListener('click', handleSoundToggle);

  // Automatically pause if browser tab loses visibility mid-run
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && gameState === 'RUNNING') {
      togglePause();
    }
  });

  /* ======================================================================
     14. BOOTSTRAP
     ====================================================================== */
  Object.defineProperty(window, '__NEON_VIPER_DEBUG', {
    get() {
      return {
        gameState,
        currentDir: currentDir.name,
        queuedDirs: directionQueue.map(d => d.name),
        snake: snake.map(s => ({ ...s })),
        food: { ...food },
        score,
        bestScore,
        stepsTaken
      };
    }
  });

  loadBestScore();
  initGameData(true);
  syncUIState();
  requestAnimationFrame(gameLoop);
})();
