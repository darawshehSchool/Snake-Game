/* ==========================================================================
   1. THREE-LAYER DESIGN TOKENS (design-system + ui-ux-pro-max)
   ========================================================================== */
:root {
  /* Layer 1: Primitive Tokens */
  --primitive-obsidian-950: #070712;
  --primitive-obsidian-900: #0F0F23;
  --primitive-obsidian-800: #16152D;
  --primitive-obsidian-700: #1E1C35;
  --primitive-obsidian-600: #27273B;
  --primitive-violet-600: #7C3AED;
  --primitive-violet-500: #8B5CF6;
  --primitive-violet-400: #A78BFA;
  --primitive-violet-900: #4C1D95;
  --primitive-rose-500: #F43F5E;
  --primitive-rose-400: #FB7185;
  --primitive-emerald-400: #34D399;
  --primitive-emerald-500: #10B981;
  --primitive-cyan-400: #22D3EE;
  --primitive-amber-400: #FBBF24;
  --primitive-slate-100: #F1F5F9;
  --primitive-slate-200: #E2E8F0;
  --primitive-slate-400: #94A3B8;
  --primitive-slate-500: #64748B;

  /* Layer 2: Semantic Tokens */
  --color-background: var(--primitive-obsidian-900);
  --color-background-deep: var(--primitive-obsidian-950);
  --color-foreground: var(--primitive-slate-200);
  --color-foreground-bright: var(--primitive-slate-100);
  --color-card: var(--primitive-obsidian-700);
  --color-card-elevated: var(--primitive-obsidian-600);
  --color-muted: var(--primitive-obsidian-600);
  --color-muted-foreground: var(--primitive-slate-400);
  --color-primary: var(--primitive-violet-600);
  --color-primary-hover: var(--primitive-violet-500);
  --color-secondary: var(--primitive-violet-400);
  --color-accent: var(--primitive-rose-500);
  --color-accent-hover: var(--primitive-rose-400);
  --color-success: var(--primitive-emerald-400);
  --color-warning: var(--primitive-amber-400);
  --color-info: var(--primitive-cyan-400);
  --color-border: rgba(139, 92, 246, 0.28);
  --color-border-strong: rgba(167, 139, 250, 0.55);
  --color-ring: var(--primitive-violet-400);

  /* Layer 3: Component Tokens */
  --cabinet-bg: rgba(30, 28, 53, 0.78);
  --cabinet-border: var(--color-border);
  --cabinet-radius: 20px;
  --panel-radius: 14px;
  --btn-radius: 10px;
  --shadow-neon-primary: 0 0 24px rgba(124, 58, 237, 0.42);
  --shadow-neon-accent: 0 0 24px rgba(244, 63, 94, 0.45);
  --shadow-neon-emerald: 0 0 20px rgba(52, 211, 153, 0.38);
  --shadow-elevation: 0 20px 50px rgba(0, 0, 0, 0.65);

  /* Spacing & Rhythm (4/8dp scale) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  /* Typography (100% self-contained system stack) */
  --font-display: ui-monospace, 'Cascadia Code', 'JetBrains Mono', 'Fira Code', 'SFMono-Regular', Consolas, monospace;
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  /* Motion Tokens */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 150ms;
  --duration-normal: 240ms;
}

/* ==========================================================================
   2. RESET & BASE STYLES
   ========================================================================== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

html, body {
  width: 100%;
  min-height: 100dvh;
  background-color: var(--color-background-deep);
  background-image:
    radial-gradient(circle at 15% 15%, rgba(124, 58, 237, 0.18) 0%, transparent 45%),
    radial-gradient(circle at 85% 80%, rgba(244, 63, 94, 0.14) 0%, transparent 45%),
    radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.06) 0%, transparent 60%),
    linear-gradient(180deg, var(--color-background-deep) 0%, var(--color-background) 100%);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  line-height: 1.5;
  overflow-x: hidden;
  user-select: none;
  -webkit-user-select: none;
}

/* Subtle Ambient Arcade Grid Overlay */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(139, 92, 246, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.04) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
  z-index: 0;
}

/* ==========================================================================
   3. APP SHELL & RESPONSIVE LAYOUT
   ========================================================================== */
.app-wrapper {
  position: relative;
  z-index: 1;
  max-width: 1120px;
  margin: 0 auto;
  padding: var(--space-4);
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-4);
}

/* Top Header Bar */
.arcade-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-3);
  background: var(--cabinet-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--cabinet-border);
  border-radius: var(--panel-radius);
  padding: var(--space-3) var(--space-5);
  box-shadow: var(--shadow-elevation);
}

.brand-group {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.brand-logo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  display: grid;
  place-items: center;
  box-shadow: var(--shadow-neon-primary);
  flex-shrink: 0;
}

.brand-logo svg {
  width: 24px;
  height: 24px;
  color: #ffffff;
}

.brand-title {
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2.2vw, 1.4rem);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: linear-gradient(90deg, #FFFFFF 0%, var(--primitive-violet-400) 55%, var(--primitive-emerald-400) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.brand-subtitle {
  font-size: 0.75rem;
  color: var(--color-muted-foreground);
  font-family: var(--font-display);
  letter-spacing: 0.06em;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-success);
  box-shadow: 0 0 8px var(--color-success);
  display: inline-block;
}

.status-dot.paused {
  background: var(--color-warning);
  box-shadow: 0 0 8px var(--color-warning);
}

.status-dot.over {
  background: var(--color-accent);
  box-shadow: 0 0 8px var(--color-accent);
}

/* Scoreboard Metrics in Header */
.hud-metrics {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.metric-card {
  background: rgba(7, 7, 18, 0.65);
  border: 1px solid rgba(139, 92, 246, 0.22);
  border-radius: 10px;
  padding: 6px 14px;
  min-width: 96px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
}

.metric-card.highlight {
  border-color: rgba(52, 211, 153, 0.45);
}

.metric-label {
  font-family: var(--font-display);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-muted-foreground);
}

.metric-value {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-foreground-bright);
  font-variant-numeric: tabular-nums;
  transition: transform var(--duration-fast) var(--ease-spring), color var(--duration-fast) ease;
}

.metric-value.pop {
  transform: scale(1.18);
  color: var(--color-success);
}

.metric-card.best .metric-value {
  color: var(--color-warning);
}

.metric-card.speed .metric-value {
  color: var(--color-info);
}

/* Main Workspace Grid */
.arcade-main {
  display: grid;
  grid-template-columns: 1fr 310px;
  gap: var(--space-4);
  align-items: start;
}

/* ==========================================================================
   4. CANVAS STAGE & OVERLAYS
   ========================================================================== */
.stage-panel {
  background: var(--cabinet-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--cabinet-border);
  border-radius: var(--cabinet-radius);
  padding: var(--space-4);
  box-shadow: var(--shadow-elevation);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.canvas-container {
  position: relative;
  width: 100%;
  max-width: min(520px, 60dvh);
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  padding: 3px;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.7), rgba(52, 211, 153, 0.5), rgba(244, 63, 94, 0.6));
  box-shadow:
    0 0 35px rgba(124, 58, 237, 0.25),
    inset 0 0 20px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  touch-action: none;
}

.canvas-inner {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--color-background-deep);
  border-radius: 11px;
  overflow: hidden;
}

canvas#gameCanvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: crosshair;
  outline: none;
}

/* CRT Subtle Scanline Overlay */
.scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 3px,
    rgba(0, 0, 0, 0.16) 3px,
    rgba(0, 0, 0, 0.16) 4px
  );
  pointer-events: none;
  z-index: 2;
}

/* Screen Shake Animation */
@keyframes shake {
  0%, 100% { transform: translate3d(0, 0, 0); }
  20% { transform: translate3d(-6px, 4px, 0); }
  40% { transform: translate3d(6px, -4px, 0); }
  60% { transform: translate3d(-4px, -3px, 0); }
  80% { transform: translate3d(4px, 3px, 0); }
}

.canvas-container.shake {
  animation: shake 260ms ease-in-out;
}

/* Interactive Overlays (Start, Pause, Game Over) */
.stage-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  background: rgba(7, 7, 18, 0.35);
  backdrop-filter: blur(1.5px);
  -webkit-backdrop-filter: blur(1.5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
  text-align: center;
  opacity: 1;
  visibility: visible;
  transition: opacity var(--duration-normal) var(--ease-out-expo),
              visibility var(--duration-normal) var(--ease-out-expo);
}

.stage-overlay.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.overlay-card {
  max-width: 420px;
  width: 100%;
  background: rgba(30, 28, 53, 0.9);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--panel-radius);
  padding: var(--space-6);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.7), var(--shadow-neon-primary);
  transform: translateY(0) scale(1);
  transition: transform var(--duration-normal) var(--ease-out-expo);
}

.stage-overlay.hidden .overlay-card {
  transform: translateY(12px) scale(0.96);
}

.overlay-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: rgba(124, 58, 237, 0.22);
  color: var(--color-secondary);
  border: 1px solid rgba(167, 139, 250, 0.4);
  margin-bottom: var(--space-3);
}

.overlay-badge.danger {
  background: rgba(244, 63, 94, 0.2);
  color: var(--primitive-rose-400);
  border-color: rgba(244, 63, 94, 0.45);
}

.overlay-badge.record {
  background: rgba(251, 191, 36, 0.2);
  color: var(--color-warning);
  border-color: rgba(251, 191, 36, 0.5);
}

.overlay-title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2.1rem);
  font-weight: 900;
  letter-spacing: 0.06em;
  color: var(--color-foreground-bright);
  margin-bottom: var(--space-2);
  text-shadow: 0 0 18px rgba(124, 58, 237, 0.6);
}

.overlay-desc {
  font-size: 0.92rem;
  color: var(--color-muted-foreground);
  margin-bottom: var(--space-5);
}

/* Quick Instructions Grid inside Start Overlay */
.quick-tips {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
  text-align: left;
  margin-bottom: var(--space-5);
}

.tip-box {
  background: rgba(7, 7, 18, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tip-box svg {
  width: 20px;
  height: 20px;
  color: var(--color-success);
  flex-shrink: 0;
}

.tip-text {
  font-size: 0.76rem;
  line-height: 1.3;
  color: var(--color-foreground);
}

.tip-text strong {
  display: block;
  font-family: var(--font-display);
  font-size: 0.7rem;
  color: var(--color-secondary);
  text-transform: uppercase;
}

/* Game Over Summary Stats */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}

.summary-item {
  background: rgba(7, 7, 18, 0.65);
  border: 1px solid rgba(139, 92, 246, 0.22);
  border-radius: 10px;
  padding: 10px;
}

.summary-item .label {
  font-family: var(--font-display);
  font-size: 0.65rem;
  text-transform: uppercase;
  color: var(--color-muted-foreground);
  letter-spacing: 0.08em;
}

.summary-item .val {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-foreground-bright);
  margin-top: 2px;
}

/* ==========================================================================
   5. BUTTONS & CONTROLS (Tactile Arcade Controls)
   ========================================================================== */
.control-bar {
  width: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.btn-group {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
  flex: 1;
}

.btn {
  appearance: none;
  border: 1px solid var(--color-border);
  background: var(--color-card-elevated);
  color: var(--color-foreground-bright);
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 10px 16px;
  min-height: 44px;
  border-radius: var(--btn-radius);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition:
    background-color var(--duration-fast) ease,
    border-color var(--duration-fast) ease,
    box-shadow var(--duration-fast) ease,
    opacity var(--duration-fast) ease;
}

.btn svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.btn:hover:not(:disabled) {
  background: rgba(124, 58, 237, 0.25);
  border-color: var(--color-border-strong);
  box-shadow: 0 0 16px rgba(124, 58, 237, 0.3);
}

.btn:active:not(:disabled) {
  opacity: 0.85;
}

.btn:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), #6D28D9);
  border-color: rgba(167, 139, 250, 0.6);
  color: #ffffff;
  box-shadow: var(--shadow-neon-primary);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-primary-hover), var(--color-primary));
  border-color: #ffffff;
  box-shadow: 0 0 28px rgba(124, 58, 237, 0.65);
}

.btn-accent {
  background: linear-gradient(135deg, var(--color-accent), #E11D48);
  border-color: rgba(251, 113, 133, 0.6);
  color: #ffffff;
  box-shadow: var(--shadow-neon-accent);
}

.btn-accent:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-accent-hover), var(--color-accent));
  border-color: #ffffff;
  box-shadow: 0 0 28px rgba(244, 63, 94, 0.65);
}

.btn-full {
  width: 100%;
  padding: 13px 20px;
  font-size: 0.92rem;
}

.btn-icon-only {
  padding: 10px;
  min-width: 44px;
}

/* ==========================================================================
   6. ON-SCREEN TOUCH D-PAD (Mobile & Touch Ergonomics >= 48px targets)
   ========================================================================== */
.touch-controls-wrapper {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding-top: var(--space-1);
}

.dpad-grid {
  display: grid;
  grid-template-columns: repeat(3, 60px);
  grid-template-rows: repeat(2, 54px);
  gap: 8px;
  justify-content: center;
}

.dpad-btn {
  appearance: none;
  background: rgba(15, 15, 35, 0.85);
  border: 1px solid var(--color-border-strong);
  border-radius: 12px;
  color: var(--color-foreground-bright);
  display: grid;
  place-items: center;
  cursor: pointer;
  min-width: 48px;
  min-height: 48px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.45);
  transition: background-color 100ms ease, border-color 100ms ease, box-shadow 100ms ease;
  touch-action: manipulation;
}

.dpad-btn svg {
  width: 24px;
  height: 24px;
  pointer-events: none;
}

.dpad-btn:hover {
  background: rgba(124, 58, 237, 0.28);
  border-color: var(--color-secondary);
}

.dpad-btn.active-press,
.dpad-btn:active {
  background: var(--color-primary);
  border-color: #ffffff;
  box-shadow: var(--shadow-neon-primary);
}

.dpad-up { grid-column: 2; grid-row: 1; }
.dpad-left { grid-column: 1; grid-row: 2; }
.dpad-down { grid-column: 2; grid-row: 2; }
.dpad-right { grid-column: 3; grid-row: 2; }

.touch-hint {
  font-size: 0.74rem;
  color: var(--color-muted-foreground);
  font-family: var(--font-display);
  letter-spacing: 0.04em;
}

/* ==========================================================================
   7. SIDEBAR PANEL (Instructions, Speed Meter, Telemetry)
   ========================================================================== */
.sidebar-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.info-card {
  background: var(--cabinet-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--cabinet-border);
  border-radius: var(--panel-radius);
  padding: var(--space-4);
  box-shadow: var(--shadow-elevation);
}

.info-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-secondary);
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid rgba(139, 92, 246, 0.18);
}

.info-card-header svg {
  width: 16px;
  height: 16px;
  color: var(--color-success);
}

/* Speed Progression Bar */
.speed-meter {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.speed-row {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-display);
  font-size: 0.76rem;
}

.speed-bar-track {
  width: 100%;
  height: 10px;
  background: rgba(7, 7, 18, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 999px;
  overflow: hidden;
}

.speed-bar-fill {
  height: 100%;
  width: 15%;
  background: linear-gradient(90deg, var(--color-success), var(--color-info), var(--color-accent));
  border-radius: 999px;
  transition: width 300ms var(--ease-out-expo);
}

/* Keybindings List */
.keybind-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
}

.keybind-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
  color: var(--color-foreground);
}

.kbd-group {
  display: inline-flex;
  gap: 4px;
}

kbd {
  font-family: var(--font-display);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 7px;
  background: rgba(7, 7, 18, 0.8);
  border: 1px solid rgba(167, 139, 250, 0.35);
  border-bottom-width: 2px;
  border-radius: 6px;
  color: var(--color-foreground-bright);
  transition: background-color 100ms ease, border-color 100ms ease, transform 100ms ease;
}

kbd.active-key {
  background: var(--color-primary);
  border-color: #ffffff;
  color: #ffffff;
  transform: scale(1.1);
}

/* Rules List */
.rules-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.83rem;
  color: var(--color-muted-foreground);
}

.rules-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.rules-list li svg {
  width: 16px;
  height: 16px;
  color: var(--color-accent);
  flex-shrink: 0;
  margin-top: 3px;
}

.rules-list li strong {
  color: var(--color-foreground-bright);
}

/* ==========================================================================
   8. RESPONSIVE BREAKPOINTS & REDUCED MOTION
   ========================================================================== */
@media (max-width: 920px) {
  .arcade-main {
    grid-template-columns: 1fr;
  }
  .sidebar-panel {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
}

@media (max-width: 560px) {
  .app-wrapper {
    padding: var(--space-2);
    gap: var(--space-2);
  }
  .arcade-header {
    padding: var(--space-3);
  }
  .metric-card {
    min-width: 78px;
    padding: 5px 10px;
  }
  .metric-value {
    font-size: 1.05rem;
  }
  .stage-panel {
    padding: var(--space-3);
  }
  .quick-tips {
    grid-template-columns: 1fr;
  }
  .btn {
    padding: 8px 12px;
    font-size: 0.76rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
