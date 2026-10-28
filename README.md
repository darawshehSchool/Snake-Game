# Neon Viper — Retro-Modern Arcade Snake

A complete, self-contained **Arcade Snake Game** built with vanilla **HTML5 Canvas**, **CSS3**, and **JavaScript (ES6+)** with zero external libraries, images, or runtime dependencies.

---

## Features

- **60 FPS Interpolated Canvas Rendering**: Decouples fixed-timestep grid logic from smooth sub-pixel rendering (`requestAnimationFrame`) with reactive grid illumination, tapered neon segments, directional eyes, particle bursts, and floating score popups.
- **Full Keyboard & Multi-Layout WASD Support**:
  - Control the viper with **WASD** (`W`, `A`, `S`, `D`) or **Arrow Keys** (`↑`, `↓`, `←`, `→`).
  - Uses physical hardware key codes (`KeyW`, `KeyA`, `KeyS`, `KeyD`) alongside character and numeric key fallbacks so `WASD` works regardless of Caps Lock, Shift, or OS keyboard layout (e.g., English or Arabic).
  - Real-time visual key-press feedback on the sidebar `<kbd>` indicators and on-screen D-Pad.
- **2-Step Direction Input Buffer (Anti-Reversal Lock)**: Prevents accidental 180° self-collisions when executing rapid corner turns within a single grid tick.
- **Progressive Velocity Scaling**: Game speed gradually increases with every plasma apple harvested (`1.0x` up to `2.8x` overdrive), tracked by a live HUD speed meter and level indicator.
- **Persistent High Scores**: Automatically saves and loads your all-time best score via `localStorage`.
- **Web Audio API Arcade Synthesizer**: Custom procedural sound effects for directional turns, eating plasma cores, speed-level upgrades, pause/resume, new high-score fanfares, and collisions—with a mute/unmute toggle (`M`).
- **Responsive Desktop & Mobile Design**: Playable on desktop, tablet, and mobile viewports with both **touch-swipe gestures** on the arena and an ergonomic **on-screen D-Pad**.

---

## Project Structure

```text
fast game/
├── index.html       # Semantic arcade cabinet layout, HUD, canvas stage, and overlays
├── css/
│   ├── style.css    # 3-layer design tokens (primitive, semantic, component) & responsive styles
│   └── style.cs     # Mirrored stylesheet copy
├── js/
│   └── main.js      # Game loop, canvas renderer, Web Audio synth, localStorage, and input engine
└── README.md        # Project documentation
```

---

## Controls

| Action | Desktop Keyboard | Mobile / Touch |
| :--- | :--- | :--- |
| **Move Up** | `W` or `↑` (Arrow Up) | Swipe Up / Tap D-Pad `▲` |
| **Move Down** | `S` or `↓` (Arrow Down) | Swipe Down / Tap D-Pad `▼` |
| **Move Left** | `A` or `←` (Arrow Left) | Swipe Left / Tap D-Pad `◀` |
| **Move Right** | `D` or `→` (Arrow Right) | Swipe Right / Tap D-Pad `▶` |
| **Start / Pause / Resume** | `Space` or `P` | Tap **Start** / **Pause** button |
| **Quick Restart** | `R` | Tap **Restart** button |
| **Mute / Unmute Audio** | `M` | Tap **Speaker** button |

---

## Getting Started

No build step or server is required:

1. Clone or download this repository.
2. Open `index.html` directly in any modern desktop or mobile web browser.
3. Click **Start Game** or press any **WASD / Arrow** key to launch immediately.
