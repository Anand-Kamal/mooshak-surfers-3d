# Mooshak Surfers 3D: Lalbaug Pandal Heist 🐭🥮

A festive, interactive 3D endless runner developed for the **Vinayaka Chaturthi Game Design Contest**. 

Play as **Mooshak**, the loyal vahana of Lord Ganesha, sprinting through a vibrant temple pandal courtyard. Gather sacred Motichoor Laddus and Royal Modaks to present at Bappa’s lotus feet, dodge household hazards, outrun an angry Dadi brandishing her rubber chappal, and compete on a live cross-campus cloud leaderboard!

---

## 🌟 Core Features

- **Thematic Indian Setting:** Procedurally generated Lalbaug marble runway adorned with marigold floral rangoli patterns, grand pillars, and a towering Lord Ganesha murti at the horizon.
- **Fair Gameplay Loop:** Snappy lane-switching, vertical jump/slide clearances, smooth distance tracking, and responsive hazard hitboxes.
- **Dual Sweet Scoring:**
  - **Motichoor Laddu (+1 Pt):** Classic bundi sweet garnished with silver leaf (*varq*) and pistachios.
  - **Royal Golden Modak (+5 Pts):** Pleated sacred prasad with a distinct golden starburst aura and custom chime audio.
- **Dadi’s 50-Laddu Rage Event:** Every 50 sweets collected triggers an angry dialogue banner, screen shake, and a homing red rubber chappal that must be dodged in real time.
- **Temple Darbar Store:** Spend gathered sweets in the sanctum to unlock the *Swarna Modak Magnet* and *Vahana Kavach (Shield)*.
- **Live Cross-Campus Cloud Leaderboard:** Backed by **Firebase Realtime Database** to track and display real-time persistent high scores across colleges and devices.
- **100% Procedural & Self-Contained:** All 3D textures are drawn directly to HTML5 Canvas buffers; all festival sound effects and Nashik Dhol-Tasha beats are synthesized natively via the Web Audio API (zero external image or MP3 dependencies).

---

## 🕹️ Controls

### Desktop (Keyboard)
| Action | Key Bindings |
| :--- | :--- |
| **Switch Lanes** | `A` / `D` or `Left Arrow` / `Right Arrow` |
| **Jump** | `W` or `Up Arrow` or `Space` |
| **Duck / Slide** | `S` or `Down Arrow` |

### Mobile & Tablet (Touch)
| Action | Gesture |
| :--- | :--- |
| **Switch Lanes** | Swipe **Left** / **Right** |
| **Jump** | Swipe **Up** |
| **Duck / Slide** | Swipe **Down** |

---

## 🏆 Cross-Campus Leaderboard System

- Enter your **Name** and **Campus / College** on the start screen.
- Runs are evaluated based on total **Mithai Score** and **Distance (Meters)**.
- High scores automatically sync to the Firebase Realtime Database cloud backend.
- View real-time standings at any time by clicking **🏆 LEADERBOARD**.

---

## 🛠️ Tech Stack & Architecture

- **Frontend & UI:** HTML5, CSS3 (Custom Responsive Festive UI)
- **3D Graphics Engine:** [Three.js](https://three.js/) (r128 WebGL Renderer)
- **Asset Pipeline:** Pure Synchronous HTML5 Canvas Texture Generation (Zero CORS/404 issues)
- **Audio Engine:** Web Audio API (Real-time dynamic synthesis of Dhol beats, cymbals, and bells)
- **Cloud Backend:** Firebase Realtime Database
- **Deployment:** GitHub Pages

---

## 🚀 Local Setup & Running

1. Clone the repository:
   ```bash
   git clone [https://github.com/](https://github.com/)<your-username>/mooshak-surfers-3d.git
