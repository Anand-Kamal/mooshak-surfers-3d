// --- 1. LIVE CLOUD LEADERBOARD CONFIGURATION (Firebase Realtime DB) ---
const firebaseConfig = {
  apiKey: "AIzaSyCsnjGSmKiwaZtIFMuP4VMygBV7BHNKKZk",
  authDomain: "mooshak-surfers.firebaseapp.com",
  databaseURL: "https://mooshak-surfers-default-rtdb.firebaseio.com",
  projectId: "mooshak-surfers",
  storageBucket: "mooshak-surfers.firebasestorage.app",
  messagingSenderId: "345843668785",
  appId: "1:345843668785:web:980b094c707ce3d3614210"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

class GlobalCloudLeaderboard {
  constructor() {
    this.dbRef = db.ref('campus_leaderboard');
  }

  // Upload or update player's personal best score in the cloud
  submitScore(name, campus, score, dist) {
    let cleanName = (name && name.trim()) ? name.trim() : "Player Mooshak";
    let cleanCampus = (campus && campus.trim()) ? campus.trim() : "Host Campus";

    const userKey = btoa(encodeURIComponent((cleanName + "_" + cleanCampus).toLowerCase())).replace(/[/+=]/g, "");
    const playerRef = db.ref('campus_leaderboard/' + userKey);

    playerRef.once('value', (snapshot) => {
      const data = snapshot.val();
      if (!data || score > data.score || (score === data.score && dist > data.distance)) {
        playerRef.set({
          name: cleanName,
          campus: cleanCampus,
          score: score,
          distance: dist,
          timestamp: Date.now()
        });
      }
    });
  }

  // Fetch top 8 live high scores across all campuses
  fetchTopScores(callback) {
    this.dbRef.orderByChild('score').limitToLast(8).once('value', (snapshot) => {
      const scores = [];
      snapshot.forEach((child) => {
        scores.push(child.val());
      });
      scores.reverse();
      callback(scores);
    });
  }
}

const leaderboardManager = new GlobalCloudLeaderboard();

function renderLeaderboardTable() {
  const tbody = document.getElementById('leaderboard-body');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#ffaa00;">Loading Bappa\'s Standings... 🥮</td></tr>';

  leaderboardManager.fetchTopScores((scores) => {
    tbody.innerHTML = '';
    if (!scores || scores.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No records yet. Be the first!</td></tr>';
      return;
    }

    scores.forEach((entry, idx) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><b>#${idx + 1}</b></td>
        <td>${entry.name}</td>
        <td style="color:#ffaa00;">${entry.campus}</td>
        <td style="color:#ffd700; font-weight:bold;">${entry.score} 🥮</td>
        <td>${entry.distance}m</td>
      `;
      tbody.appendChild(row);
    });
  });
}

// --- 2. PROCEDURAL SOUND ENGINE ---
class DesiFestivalAudio {
  constructor() {
    this.ctx = null;
    this.dholInterval = null;
    this.tempo = 290;
  }

  init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  playBell() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1300, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playModakChime() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, this.ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playCymbal() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2400, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playDadiYell() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(620, this.ctx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(220, this.ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playCrash() {
    if (!this.ctx) return;
    const bufSize = Math.floor(this.ctx.sampleRate * 0.35);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.55, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
    noise.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  startDhol(tempo = 290) {
    this.stopDhol();
    this.tempo = tempo;
    let step = 0;

    this.dholInterval = setInterval(() => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';

      const isBass = step % 2 === 0;
      osc.frequency.setValueAtTime(isBass ? 95 : 160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(isBass ? 0.22 : 0.14, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);

      step++;
    }, this.tempo);
  }

  updateTempo(tempo) {
    if (Math.abs(this.tempo - tempo) > 15) {
      this.startDhol(tempo);
    }
  }

  stopDhol() {
    if (this.dholInterval) clearInterval(this.dholInterval);
  }
}

const sfx = new DesiFestivalAudio();

// --- 3. PROCEDURAL CANVAS TEXTURES ---
function makeBappaCanvas() {
  const c = document.createElement('canvas');
  c.width = 400; c.height = 500;
  const ctx = c.getContext('2d');

  const grad = ctx.createRadialGradient(200, 180, 20, 200, 180, 140);
  grad.addColorStop(0, '#ffff33');
  grad.addColorStop(0.7, '#ff6600');
  grad.addColorStop(1, 'rgba(255,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(200, 180, 140, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#e6005c';
  ctx.beginPath(); ctx.ellipse(200, 440, 140, 40, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ff3385';
  ctx.beginPath(); ctx.ellipse(200, 430, 120, 30, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#ff7700';
  ctx.beginPath(); ctx.ellipse(200, 340, 90, 75, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#ffd700';
  ctx.fillRect(130, 370, 140, 45);

  ctx.fillStyle = '#ff8800';
  ctx.beginPath(); ctx.ellipse(95, 190, 50, 40, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(305, 190, 50, 40, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffa366';
  ctx.beginPath(); ctx.ellipse(95, 190, 30, 22, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(305, 190, 30, 22, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#ff8800';
  ctx.beginPath(); ctx.arc(200, 190, 60, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(185, 210);
  ctx.quadraticCurveTo(180, 290, 225, 290);
  ctx.quadraticCurveTo(245, 290, 240, 265);
  ctx.quadraticCurveTo(215, 260, 210, 210);
  ctx.fill();

  ctx.fillStyle = '#ff0000';
  ctx.fillRect(196, 145, 8, 22);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(180, 155, 40, 4);

  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.moveTo(150, 145); ctx.lineTo(200, 40); ctx.lineTo(250, 145);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function makeMooshakCanvas() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');

  ctx.strokeStyle = '#ff9999';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(180, 160);
  ctx.quadraticCurveTo(230, 130, 210, 80);
  ctx.stroke();

  ctx.fillStyle = '#ff4400';
  ctx.beginPath();
  ctx.moveTo(140, 110);
  ctx.quadraticCurveTo(200, 100, 190, 140);
  ctx.lineTo(130, 130);
  ctx.fill();

  ctx.fillStyle = '#69584d';
  ctx.beginPath(); ctx.ellipse(120, 140, 65, 45, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#a8988d';
  ctx.beginPath(); ctx.ellipse(110, 150, 40, 25, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#ff9999';
  ctx.beginPath(); ctx.arc(80, 185, 14, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(150, 185, 14, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#69584d';
  ctx.beginPath(); ctx.ellipse(70, 115, 40, 28, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ff9999';
  ctx.beginPath();
  ctx.moveTo(35, 115); ctx.lineTo(60, 100); ctx.lineTo(60, 130);
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(33, 115, 6, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#69584d';
  ctx.beginPath(); ctx.ellipse(105, 80, 24, 30, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ff9999';
  ctx.beginPath(); ctx.ellipse(105, 80, 15, 20, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(65, 105, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(67, 103, 2, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 112); ctx.lineTo(12, 104);
  ctx.moveTo(40, 118); ctx.lineTo(12, 124);
  ctx.stroke();

  ctx.fillStyle = '#ffaa00';
  ctx.beginPath(); ctx.arc(60, 145, 18, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 3;
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function makeDadiCanvas() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 340;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#b3003b';
  ctx.beginPath(); ctx.ellipse(128, 230, 65, 80, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(128, 230, 65, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.fillStyle = '#d99879';
  ctx.beginPath(); ctx.arc(100, 315, 16, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(156, 315, 16, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#c0c0c0';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(86, 305); ctx.lineTo(114, 305);
  ctx.moveTo(142, 305); ctx.lineTo(170, 305);
  ctx.stroke();

  ctx.fillStyle = '#d99879';
  ctx.beginPath(); ctx.arc(128, 100, 42, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#e6e6e6';
  ctx.beginPath(); ctx.arc(128, 55, 26, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.setLineDash([8, 6]);
  ctx.beginPath(); ctx.arc(128, 55, 30, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = '#222';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(105, 90); ctx.lineTo(122, 98);
  ctx.moveTo(151, 90); ctx.lineTo(134, 98);
  ctx.stroke();

  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.arc(114, 102, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(142, 102, 5, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#ff0000';
  ctx.beginPath(); ctx.arc(128, 85, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4a0d0d';
  ctx.beginPath(); ctx.ellipse(128, 122, 12, 9, 0, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = '#d99879';
  ctx.lineWidth = 18;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(175, 180);
  ctx.quadraticCurveTo(215, 140, 210, 95);
  ctx.stroke();

  ctx.fillStyle = '#ff0000';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(210, 75, 18, 34, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#0033cc';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(200, 80); ctx.lineTo(210, 65); ctx.lineTo(220, 80);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function makeChulhaCanvas() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#8c3b19';
  ctx.strokeStyle = '#59200a';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(40, 210);
  ctx.quadraticCurveTo(128, 160, 216, 210);
  ctx.lineTo(200, 110);
  ctx.quadraticCurveTo(128, 80, 56, 110);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#260901';
  ctx.beginPath(); ctx.ellipse(128, 175, 55, 34, 0, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = '#4d2600';
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(85, 185); ctx.lineTo(171, 165);
  ctx.moveTo(90, 165); ctx.lineTo(166, 185);
  ctx.stroke();

  ctx.fillStyle = '#ff3300';
  ctx.beginPath();
  ctx.moveTo(100, 180);
  ctx.quadraticCurveTo(128, 80, 156, 180);
  ctx.quadraticCurveTo(140, 140, 128, 100);
  ctx.quadraticCurveTo(116, 140, 100, 180);
  ctx.fill();

  ctx.fillStyle = '#ffcc00';
  ctx.beginPath();
  ctx.moveTo(115, 180);
  ctx.quadraticCurveTo(128, 120, 141, 180);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function makeMouseTrapCanvas() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#b07846';
  ctx.strokeStyle = '#5c3818';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(30, 60, 196, 136, 12);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#d9d9d9';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(45, 75, 166, 50, 6);
  ctx.stroke();

  ctx.fillStyle = '#777777';
  ctx.fillRect(115, 110, 26, 36);

  ctx.fillStyle = '#ffaa00';
  ctx.strokeStyle = '#ff7700';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(128, 135); ctx.lineTo(145, 160); ctx.lineTo(111, 160);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function makeChappalCanvas() {
  const c = document.createElement('canvas');
  c.width = 160; c.height = 240;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#ff1a1a';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(80, 120, 48, 95, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#0033cc';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(50, 130); ctx.lineTo(80, 85); ctx.lineTo(110, 130);
  ctx.stroke();
  ctx.fillStyle = '#0033cc';
  ctx.beginPath(); ctx.arc(80, 85, 10, 0, Math.PI * 2); ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function makeLadduCanvas() {
  const c = document.createElement('canvas');
  c.width = 200; c.height = 200;
  const ctx = c.getContext('2d');

  const glow = ctx.createRadialGradient(100, 100, 40, 100, 100, 95);
  glow.addColorStop(0, 'rgba(255, 170, 0, 0.4)');
  glow.addColorStop(1, 'rgba(255, 100, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(100, 100, 95, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#ff7700';
  ctx.beginPath(); ctx.arc(100, 100, 70, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#ffa500';
  ctx.lineWidth = 4;
  ctx.stroke();

  const colors = ['#ff9900', '#ffaa11', '#ffcc00', '#e65c00'];
  for (let i = 0; i < 45; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 55;
    const bx = 100 + Math.cos(angle) * dist;
    const by = 100 + Math.sin(angle) * dist;
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.beginPath();
    ctx.arc(bx, by, 7 + Math.random() * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#f5fafa';
  ctx.beginPath();
  ctx.moveTo(85, 80); ctx.lineTo(125, 70); ctx.lineTo(110, 105); ctx.lineTo(75, 95);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#339933';
  ctx.beginPath(); ctx.ellipse(80, 110, 9, 5, 0.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(115, 90, 8, 4, -0.3, 0, Math.PI * 2); ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function makeModakCanvas() {
  const c = document.createElement('canvas');
  c.width = 220; c.height = 240;
  const ctx = c.getContext('2d');

  const aura = ctx.createRadialGradient(110, 130, 20, 110, 130, 105);
  aura.addColorStop(0, 'rgba(255, 230, 0, 0.7)');
  aura.addColorStop(0.7, 'rgba(255, 170, 0, 0.3)');
  aura.addColorStop(1, 'rgba(255, 100, 0, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath(); ctx.arc(110, 130, 105, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#fff4cc';
  ctx.beginPath();
  ctx.moveTo(110, 25);
  ctx.bezierCurveTo(70, 70, 30, 130, 30, 175);
  ctx.bezierCurveTo(30, 220, 190, 220, 190, 175);
  ctx.bezierCurveTo(190, 130, 150, 70, 110, 25);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#e6b800';
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.strokeStyle = '#d49b00';
  ctx.lineWidth = 3.5;
  const pleatStarts = [55, 75, 95, 125, 145, 165];
  pleatStarts.forEach(px => {
    ctx.beginPath();
    ctx.moveTo(px, 195);
    ctx.quadraticCurveTo(110 + (px - 110) * 0.4, 110, 110, 25);
    ctx.stroke();
  });

  ctx.fillStyle = '#ff8800';
  ctx.beginPath();
  ctx.moveTo(110, 25); ctx.lineTo(104, 48); ctx.lineTo(116, 48);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#cc2900';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(100, 120); ctx.quadraticCurveTo(108, 140, 102, 165);
  ctx.moveTo(118, 110); ctx.quadraticCurveTo(112, 135, 120, 155);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function makeFloorCanvas() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#b33c00';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#ffbb00';
  ctx.lineWidth = 8;
  for (let i = 0; i <= 512; i += 128) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
  }

  ctx.fillStyle = '#ffea00';
  for (let x = 64; x < 512; x += 128) {
    for (let y = 64; y < 512; y += 128) {
      ctx.beginPath(); ctx.arc(x, y, 28, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ff2200';
      ctx.fillRect(x - 7, y - 7, 14, 14);
      ctx.fillStyle = '#ffea00';
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 24);
  tex.needsUpdate = true;
  return tex;
}

// Build Textures
const bappaTex = makeBappaCanvas();
const mooshakTex = makeMooshakCanvas();
const dadiTex = makeDadiCanvas();
const chulhaTex = makeChulhaCanvas();
const mousetrapTex = makeMouseTrapCanvas();
const chappalTex = makeChappalCanvas();
const ladduTex = makeLadduCanvas();
const modakTex = makeModakCanvas();
const floorTex = makeFloorCanvas();

// --- 4. SCENE & LIGHTING ---
const canvas = document.getElementById('game-canvas');
const scene = new THREE.Scene();

scene.background = new THREE.Color(0xffcca3);
scene.fog = new THREE.FogExp2(0xffcca3, 0.012);

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 280);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const ambientLight = new THREE.AmbientLight(0xfff5eb, 1.15);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xff9900, 1.6);
sunLight.position.set(12, 28, 16);
scene.add(sunLight);

// --- 5. TRACK & ENVIRONMENT ---
const LANE_WIDTH = 2.4;
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH];
let currentLane = 1;
let targetX = LANES[1];

const runwayMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.6 });
const runwayGroup = new THREE.Group();

for (let i = 0; i < 2; i++) {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(9.0, 140), runwayMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = -i * 140;
  runwayGroup.add(floor);
}
scene.add(runwayGroup);

const pillarMat = new THREE.MeshStandardMaterial({ color: 0x992b00, roughness: 0.5 });
const marigoldMat = new THREE.MeshStandardMaterial({ color: 0xff7700, emissive: 0xffaa00, emissiveIntensity: 0.35 });
const pillars = [];

for (let z = 0; z > -180; z -= 16) {
  const pLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 8.0, 10), pillarMat);
  pLeft.position.set(-5.4, 4.0, z);

  const garland = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.15, 6, 12), marigoldMat);
  garland.rotation.x = Math.PI / 2;
  garland.position.y = 2.5;
  pLeft.add(garland);

  const pRight = pLeft.clone();
  pRight.position.x = 5.4;
  scene.add(pLeft, pRight);
  pillars.push(pLeft, pRight);
}

// Bappa Murti
const bappaMat = new THREE.MeshBasicMaterial({ map: bappaTex, transparent: true, side: THREE.DoubleSide });
const bappaMesh = new THREE.Mesh(new THREE.PlaneGeometry(16, 20), bappaMat);
bappaMesh.position.set(0, 10.0, -135);
scene.add(bappaMesh);

const haloMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
const bappaHalo = new THREE.Mesh(new THREE.TorusGeometry(7.5, 0.5, 8, 32), haloMat);
bappaHalo.position.set(0, 10.5, -137);
scene.add(bappaHalo);

// Mooshak & Dadi
const mooshakMat = new THREE.MeshStandardMaterial({ map: mooshakTex, transparent: true, roughness: 0.3, side: THREE.DoubleSide });
const mooshak = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.9), mooshakMat);
mooshak.position.set(0, 0.95, 0);
scene.add(mooshak);

const shieldMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1.3, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.5 })
);
shieldMesh.position.y = 0.2;
shieldMesh.visible = false;
mooshak.add(shieldMesh);

const dadiMat = new THREE.MeshStandardMaterial({ map: dadiTex, transparent: true, roughness: 0.4, side: THREE.DoubleSide });
const dadi = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 3.2), dadiMat);
dadi.position.set(0.9, 1.6, 3.2);
scene.add(dadi);

// Chappal
const chappalMat = new THREE.MeshBasicMaterial({ map: chappalTex, transparent: true, side: THREE.DoubleSide });
const flyingChappal = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), chappalMat);
flyingChappal.visible = false;
scene.add(flyingChappal);

let chappalActive = false;
let chappalZ = 0;
let chappalX = 0;

// Obstacle Materials
const trapMat = new THREE.MeshStandardMaterial({ map: mousetrapTex, transparent: true, side: THREE.DoubleSide });
const chulhaMat = new THREE.MeshStandardMaterial({ map: chulhaTex, transparent: true, side: THREE.DoubleSide });
const ladduMat = new THREE.MeshStandardMaterial({ map: ladduTex, transparent: true, roughness: 0.2, side: THREE.DoubleSide });
const modakMat = new THREE.MeshStandardMaterial({ map: modakTex, transparent: true, roughness: 0.2, side: THREE.DoubleSide });

// --- 6. GAME STATE ---
let isRunning = false;
let speed = 26.0;
const MAX_SPEED = 48.0;

// Distance tracking accumulator
let distanceExact = 0.0;
let distance = 0;

let laddus = 0;
let bankLaddus = 0;
let lastLaddusMilestone = 0;

let hasMagnet = false;
let hasShield = false;
let shieldActive = false;

let isJumping = false;
let isSliding = false;
let jumpVelocity = 0;
const GRAVITY = -42.0;
let slideTimer = 0;

let activeObstacles = [];
let activeSweets = [];
let lastSpawnZ = -20;
let screenShake = 0;

const dadiQuotes = [
  "RUK CHOR! MERI MEHNAT KE LADDU WAPAS DE! 👵💢🩴",
  "CHAPPAL PADEGI TOH SAB BHOOL JAYEGA! 👵🔥🩴",
  "TERI MUMMY KO PHONE LAGA RAHI HOON ABHI! 👵📱",
  "HALWAI KI DUKAAN SAMAJH RAKHA HAI KYA? 👵💥🩴"
];

function spawnElements(spawnZ) {
  const lane = Math.floor(Math.random() * 3);
  const laneX = LANES[lane];
  const rand = Math.random();

  if (rand < 0.45) {
    const isTrap = Math.random() > 0.5;
    let mesh, bounds;

    if (isTrap) {
      mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.4), trapMat);
      mesh.position.set(laneX, 0.7, spawnZ);
      bounds = { yMin: 0, yMax: 1.0, type: 'trap' };
    } else {
      mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), chulhaMat);
      mesh.position.set(laneX, 0.9, spawnZ);
      bounds = { yMin: 0, yMax: 1.35, type: 'chulha' };
    }

    mesh.userData = { bounds, lane };
    scene.add(mesh);
    activeObstacles.push(mesh);
  } else {
    const isModak = Math.random() < 0.25;
    const sweetMat = isModak ? modakMat : ladduMat;
    const points = isModak ? 5 : 1;
    const sweetType = isModak ? 'modak' : 'laddu';

    for (let i = 0; i < 3; i++) {
      const sweet = new THREE.Mesh(new THREE.PlaneGeometry(isModak ? 1.1 : 0.95, isModak ? 1.2 : 0.95), sweetMat);
      sweet.position.set(laneX, isModak ? 0.75 : 0.65, spawnZ - (i * 2.6));
      sweet.userData = { lane, points, type: sweetType };
      scene.add(sweet);
      activeSweets.push(sweet);
    }
  }
}

// --- 7. CONTROLS ---
function moveLeft() {
  if (currentLane > 0) {
    currentLane--;
    targetX = LANES[currentLane];
  }
}

function moveRight() {
  if (currentLane < 2) {
    currentLane++;
    targetX = LANES[currentLane];
  }
}

function jump() {
  if (!isJumping && !isSliding) {
    isJumping = true;
    jumpVelocity = 14.8;
    sfx.playCymbal();
  }
}

function slide() {
  if (!isSliding && !isJumping) {
    isSliding = true;
    slideTimer = 0.55;
    mooshak.scale.set(1.2, 0.45, 1.0);
    mooshak.position.y = 0.4;
  }
}

window.addEventListener('keydown', (e) => {
  if (!isRunning) return;
  sfx.init();
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLeft();
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveRight();
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') jump();
  if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') slide();
});

let touchStartX = 0, touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  sfx.init();
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  if (!isRunning) return;
  const diffX = e.changedTouches[0].clientX - touchStartX;
  const diffY = e.changedTouches[0].clientY - touchStartY;
  const absX = Math.abs(diffX);
  const absY = Math.abs(diffY);

  if (Math.max(absX, absY) > 24) {
    if (absX > absY) {
      if (diffX > 0) moveRight();
      else moveLeft();
    } else {
      if (diffY < 0) jump();
      else slide();
    }
  }
}, { passive: true });

// Dadi's Rage Event
function triggerDadiRage() {
  sfx.playDadiYell();
  screenShake = 16;

  const bubble = document.getElementById('dadi-speech-bubble');
  const shoutText = document.getElementById('dadi-shout-text');
  const quote = dadiQuotes[Math.floor(Math.random() * dadiQuotes.length)];
  shoutText.innerText = quote;
  bubble.classList.remove('hidden');

  setTimeout(() => {
    bubble.classList.add('hidden');
  }, 2600);

  chappalActive = true;
  flyingChappal.visible = true;
  chappalX = targetX;
  chappalZ = dadi.position.z;
  flyingChappal.position.set(chappalX, 0.7, chappalZ);

  const warn = document.getElementById('chappal-warning');
  warn.classList.remove('hidden');
}

// --- 8. GAME OVER & SCORE SUBMISSION ---
function gameOver(reason) {
  isRunning = false;
  sfx.stopDhol();
  sfx.playCrash();
  screenShake = 22;

  const nameEl = document.getElementById('player-name');
  const campusEl = document.getElementById('player-campus');
  const pName = (nameEl && nameEl.value.trim()) ? nameEl.value.trim() : (localStorage.getItem('mooshak_player_name') || 'Anand K.');
  const pCampus = (campusEl && campusEl.value.trim()) ? campusEl.value.trim() : (localStorage.getItem('mooshak_player_campus') || 'NIAT Campus');

  // Submit to Firebase Realtime Database
  leaderboardManager.submitScore(pName, pCampus, laddus, distance);

  document.getElementById('game-over-msg').innerText = reason || '"Dadi caught you taking mithai!"';
  document.getElementById('final-laddus').innerText = laddus;
  document.getElementById('final-dist').innerText = distance;
  document.getElementById('bank-total').innerText = bankLaddus;

  document.getElementById('chappal-warning').classList.add('hidden');
  document.getElementById('dadi-speech-bubble').classList.add('hidden');
  document.getElementById('game-over-screen').classList.remove('hidden');

  updateStoreUI();
}

function updateStoreUI() {
  const magBtn = document.getElementById('buy-magnet');
  const shdBtn = document.getElementById('buy-shield');

  magBtn.disabled = hasMagnet || bankLaddus < 20;
  if (hasMagnet) magBtn.innerText = 'Active ✅';

  shdBtn.disabled = hasShield || bankLaddus < 30;
  if (hasShield) shdBtn.innerText = 'Active ✅';
}

document.getElementById('buy-magnet').addEventListener('click', () => {
  if (bankLaddus >= 20 && !hasMagnet) {
    bankLaddus -= 20;
    hasMagnet = true;
    updateStoreUI();
    document.getElementById('bank-total').innerText = bankLaddus;
  }
});

document.getElementById('buy-shield').addEventListener('click', () => {
  if (bankLaddus >= 30 && !hasShield) {
    bankLaddus -= 30;
    hasShield = true;
    updateStoreUI();
    document.getElementById('bank-total').innerText = bankLaddus;
  }
});

// Modal Triggers
function openLeaderboard() {
  renderLeaderboardTable();
  document.getElementById('leaderboard-modal').classList.remove('hidden');
}

function closeLeaderboard() {
  document.getElementById('leaderboard-modal').classList.add('hidden');
}

document.getElementById('view-leaderboard-btn').addEventListener('click', openLeaderboard);
document.getElementById('game-over-leaderboard-btn').addEventListener('click', openLeaderboard);
document.getElementById('close-leaderboard-btn').addEventListener('click', closeLeaderboard);

function startGame() {
  sfx.init();
  sfx.startDhol(290);

  const nameInput = document.getElementById('player-name').value;
  const campusInput = document.getElementById('player-campus').value;
  if (nameInput) localStorage.setItem('mooshak_player_name', nameInput.trim());
  if (campusInput) localStorage.setItem('mooshak_player_campus', campusInput.trim());

  activeObstacles.forEach(o => scene.remove(o));
  activeSweets.forEach(l => scene.remove(l));
  activeObstacles = [];
  activeSweets = [];

  currentLane = 1;
  targetX = LANES[1];
  mooshak.position.set(0, 0.95, 0);

  isJumping = false;
  isSliding = false;
  jumpVelocity = 0;
  mooshak.scale.set(1.0, 1.0, 1.0);

  shieldActive = hasShield;
  shieldMesh.visible = shieldActive;

  distanceExact = 0.0;
  distance = 0;
  
  laddus = 0;
  lastLaddusMilestone = 0;
  speed = 26.0;
  lastSpawnZ = -20;

  chappalActive = false;
  flyingChappal.visible = false;

  for (let z = -25; z > -120; z -= 14) spawnElements(z);

  document.getElementById('laddu-count').innerText = '0';
  document.getElementById('meter-count').innerText = '0';
  document.getElementById('rage-progress').innerText = '0/50';
  document.getElementById('rage-bar-fill').style.width = '0%';
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('game-over-screen').classList.add('hidden');
  document.getElementById('leaderboard-modal').classList.add('hidden');
  isRunning = true;
}

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);

window.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('mooshak_player_name');
  const savedCampus = localStorage.getItem('mooshak_player_campus');
  if (savedName && document.getElementById('player-name')) document.getElementById('player-name').value = savedName;
  if (savedCampus && document.getElementById('player-campus')) document.getElementById('player-campus').value = savedCampus;
});

// --- 9. MAIN ANIMATION LOOP ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.1);
  const time = clock.getElapsedTime();

  bappaHalo.rotation.z += delta * 1.5;

  if (isRunning) {
    speed = Math.min(MAX_SPEED, speed + delta * 0.35);
    
    // Smooth distance incrementing
    distanceExact += speed * delta * 1.5;
    distance = Math.floor(distanceExact);
    document.getElementById('meter-count').innerText = distance;

    const currentTempo = Math.max(160, 290 - Math.floor((speed - 26) * 5));
    sfx.updateTempo(currentTempo);

    const moveDist = speed * delta;

    // Snappy Lane Switching
    mooshak.position.x += (targetX - mooshak.position.x) * (delta * 16.0);
    mooshak.rotation.z = (mooshak.position.x - targetX) * 0.12;

    // Jump & Slide Physics
    if (isJumping) {
      mooshak.position.y += jumpVelocity * delta;
      jumpVelocity += GRAVITY * delta;
      if (mooshak.position.y <= 0.95) {
        mooshak.position.y = 0.95;
        isJumping = false;
      }
    }

    if (isSliding) {
      slideTimer -= delta;
      if (slideTimer <= 0) {
        isSliding = false;
        mooshak.scale.set(1.0, 1.0, 1.0);
        mooshak.position.y = 0.95;
      }
    } else if (!isJumping) {
      mooshak.position.y = 0.95 + Math.sin(time * (speed * 0.8)) * 0.08;
    }

    // Keep Dadi in lower frame
    dadi.position.x = mooshak.position.x * 0.7 + 0.8;
    dadi.position.z = mooshak.position.z + 3.2;
    dadi.position.y = 1.6 + Math.sin(time * 18) * 0.08;

    // Flying Chappal Collision
    if (chappalActive) {
      chappalZ -= delta * (speed + 22.0);
      flyingChappal.position.z = chappalZ;
      flyingChappal.rotation.z += delta * 18.0;

      if (Math.abs(chappalZ - mooshak.position.z) < 0.6) {
        if (Math.abs(chappalX - mooshak.position.x) < 0.8 && mooshak.position.y < 1.3) {
          if (shieldActive) {
            shieldActive = false;
            shieldMesh.visible = false;
            chappalActive = false;
            flyingChappal.visible = false;
            document.getElementById('chappal-warning').classList.add('hidden');
          } else {
            gameOver('💥 DADI HIT YOU WITH HER RED HAWAI CHAPPAL!');
            return;
          }
        }
      }

      if (chappalZ < mooshak.position.z - 20) {
        chappalActive = false;
        flyingChappal.visible = false;
        document.getElementById('chappal-warning').classList.add('hidden');
      }
    }

    // Runway recycling
    runwayGroup.children.forEach(track => {
      track.position.z += moveDist;
      if (track.position.z > 70) track.position.z -= 280;
    });

    pillars.forEach(p => {
      p.position.z += moveDist;
      if (p.position.z > 20) p.position.z -= 180;
    });

    lastSpawnZ += moveDist;
    if (lastSpawnZ > -100) {
      spawnElements(-140);
      lastSpawnZ = -124;
    }

    const pX = mooshak.position.x;
    const pY = mooshak.position.y;

    // Obstacle Hitbox
    for (let i = activeObstacles.length - 1; i >= 0; i--) {
      const obs = activeObstacles[i];
      obs.position.z += moveDist;

      if (Math.abs(obs.position.z - mooshak.position.z) < 0.7) {
        if (Math.abs(obs.position.x - pX) < 0.85) {
          const bounds = obs.userData.bounds;
          let hit = false;
          if (pY < bounds.yMax) hit = true;

          if (hit) {
            if (shieldActive) {
              shieldActive = false;
              shieldMesh.visible = false;
              scene.remove(obs);
              activeObstacles.splice(i, 1);
              continue;
            } else {
              gameOver(bounds.type === 'trap' ? '💥 CAUGHT IN THE MOUSE TRAP!' : '🔥 BURNED ON THE MITTI KA CHULHA!');
              return;
            }
          }
        }
      }

      if (obs.position.z > 15) {
        scene.remove(obs);
        activeObstacles.splice(i, 1);
      }
    }

    // Sweets Collection
    for (let i = activeSweets.length - 1; i >= 0; i--) {
      const sweet = activeSweets[i];
      sweet.position.z += moveDist;

      if (hasMagnet && sweet.position.z > -28) {
        sweet.position.x += (pX - sweet.position.x) * 0.18;
        sweet.position.y += (pY - sweet.position.y) * 0.18;
      }

      if (Math.abs(sweet.position.z - mooshak.position.z) < 1.1) {
        if (Math.abs(sweet.position.x - pX) < 1.15 && Math.abs(sweet.position.y - pY) < 1.4) {
          const pts = sweet.userData.points;
          laddus += pts;
          bankLaddus += pts;

          if (sweet.userData.type === 'modak') {
            sfx.playModakChime();
          } else {
            sfx.playBell();
          }

          document.getElementById('laddu-count').innerText = laddus;

          const progressInCurrent50 = laddus % 50;
          document.getElementById('rage-progress').innerText = `${progressInCurrent50}/50`;
          document.getElementById('rage-bar-fill').style.width = `${(progressInCurrent50 / 50) * 100}%`;

          if (laddus - lastLaddusMilestone >= 50) {
            lastLaddusMilestone = laddus;
            triggerDadiRage();
          }

          scene.remove(sweet);
          activeSweets.splice(i, 1);
          continue;
        }
      }

      if (sweet.position.z > 15) {
        scene.remove(sweet);
        activeSweets.splice(i, 1);
      }
    }
  }

  // Camera tracking
  let shakeOffset = (Math.random() - 0.5) * (screenShake * 0.02);
  screenShake = Math.max(0, screenShake - delta * 40);

  camera.position.x = (mooshak.position.x * 0.5) + shakeOffset;
  camera.position.y = 3.2 + (mooshak.position.y * 0.35);
  camera.position.z = mooshak.position.z + 5.2;
  camera.lookAt(mooshak.position.x * 0.25, 1.2, -12);

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();