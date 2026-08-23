const RARITY_MAP = {
  'MIL-SPEC': { color: '#4b69ff', bg: 'rgba(75, 105, 255, 0.15)', glow: 'rgba(75, 105, 255, 0.35)' },
  'RESTRICTED': { color: '#8847ff', bg: 'rgba(136, 71, 255, 0.15)', glow: 'rgba(136, 71, 255, 0.35)' },
  'CLASSIFIED': { color: '#d32ce6', bg: 'rgba(211, 44, 230, 0.15)', glow: 'rgba(211, 44, 230, 0.35)' },
  'COVERT': { color: '#eb4b4b', bg: 'rgba(235, 75, 75, 0.15)', glow: 'rgba(235, 75, 75, 0.4)' },
  'EXOTIC / CONTRABAND': { color: '#ffd700', bg: 'rgba(255, 215, 0, 0.18)', glow: 'rgba(255, 215, 0, 0.5)' }
};

/* =========================================================
   PROCEDURAL SVG ARTWORK GENERATOR
   ========================================================= */
function generateProceduralArtwork(genre) {
  const color = (RARITY_MAP[genre.rarity] || RARITY_MAP['MIL-SPEC']).color;
  const idSeed = genre.id * 17;
  
  let shapes = '';
  if (genre.category === 'GLITCH') {
    shapes = `
      <g opacity="0.6" stroke="${color}" stroke-width="1.5" fill="none">
        <polygon points="120,20 280,20 340,100 280,180 120,180 60,100" stroke-dasharray="8 4"/>
        <line x1="60" y1="100" x2="340" y2="100" />
        <rect x="170" y="70" width="60" height="60" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="2"/>
        <circle cx="200" cy="100" r="15" fill="${color}"/>
      </g>
    `;
  } else if (genre.category === 'RAP' || genre.category === 'PHONK') {
    shapes = `
      <g opacity="0.65">
        <path d="M 40 100 Q 100 20 160 100 T 280 100 T 360 100" fill="none" stroke="${color}" stroke-width="3" />
        <path d="M 40 100 Q 100 160 160 100 T 280 100 T 360 100" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="4 4" />
        <circle cx="200" cy="100" r="45" fill="none" stroke="${color}" stroke-width="2" />
        <polygon points="200,65 230,120 170,120" fill="${color}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (genre.category === 'ROCK') {
    shapes = `
      <g opacity="0.6" stroke="${color}" stroke-width="2" fill="none">
        <polygon points="200,15 225,85 300,90 240,135 260,200 200,160 140,200 160,135 100,90 175,85" />
        <circle cx="200" cy="108" r="28" stroke="${color}" stroke-width="1" />
      </g>
    `;
  } else if (genre.category === 'INDIE' || genre.category === 'AESTHETIC') {
    shapes = `
      <g opacity="0.7">
        <circle cx="200" cy="95" r="55" fill="none" stroke="${color}" stroke-width="2"/>
        <path d="M 175 60 A 45 45 0 0 0 225 130 A 40 40 0 0 1 175 60" fill="${color}" fill-opacity="0.3" stroke="${color}"/>
        <circle cx="150" cy="60" r="3" fill="#fff"/>
        <circle cx="250" cy="120" r="4" fill="#fff"/>
        <circle cx="270" cy="70" r="2" fill="#fff"/>
      </g>
    `;
  } else if (genre.category === 'GLOBAL') {
    shapes = `
      <g opacity="0.6" stroke="${color}" stroke-width="1.8" fill="none">
        <circle cx="200" cy="95" r="58" />
        <circle cx="200" cy="95" r="40" stroke-dasharray="6 3"/>
        <circle cx="200" cy="95" r="22" fill="${color}" fill-opacity="0.2"/>
        <line x1="200" y1="20" x2="200" y2="170" />
        <line x1="125" y1="95" x2="275" y2="95" />
      </g>
    `;
  } else {
    // ELECTRONIC / BASS
    shapes = `
      <g opacity="0.65" stroke="${color}" stroke-width="1.8" fill="none">
        <rect x="140" y="40" width="120" height="110" rx="8" />
        <rect x="160" y="55" width="80" height="80" rx="6" stroke-dasharray="4 4"/>
        <line x1="140" y1="40" x2="260" y2="150" />
        <line x1="260" y1="40" x2="140" y2="150" />
        <circle cx="200" cy="95" r="14" fill="${color}" />
      </g>
    `;
  }

  return `
    <svg viewBox="0 0 400 190" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad_${idSeed}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
          <stop offset="60%" stop-color="#111624" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#07090e" stop-opacity="1"/>
        </linearGradient>
        <pattern id="gridPattern_${idSeed}" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bgGrad_${idSeed})"/>
      <rect width="100%" height="100%" fill="url(#gridPattern_${idSeed})"/>
      ${shapes}
      <text x="385" y="175" text-anchor="end" fill="rgba(255,255,255,0.25)" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="11" letter-spacing="2">${genre.categoryDisplay}</text>
    </svg>
  `;
}

class AudioEngine {
  constructor() { this.ctx = null; this.soundEnabled = true; }
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }
  playWhoosh() {
    if (!this.soundEnabled) return; this.init(); if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(); osc.stop(this.ctx.currentTime + 0.32);
    } catch(e){}
  }
  playTick() {
    if (!this.soundEnabled) return; this.init(); if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
      osc.type = 'triangle'; osc.frequency.setValueAtTime(900 + Math.random() * 200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(); osc.stop(this.ctx.currentTime + 0.035);
    } catch(e){}
  }
  playWin(rarity = 'MIL-SPEC') {
    if (!this.soundEnabled) return; this.init(); if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      let notes = (rarity === 'COVERT' || rarity.includes('EXOTIC')) ? [523, 659, 784, 1046, 1318] : [440, 554, 659, 880];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
        osc.type = 'sine'; osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.22, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.45);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(now + i * 0.07); osc.stop(now + i * 0.07 + 0.5);
      });
    } catch(e){}
  }
}
const audio = new AudioEngine();

// Canvas Particles
const pCanvas = document.getElementById('particleCanvas'), pCtx = pCanvas.getContext('2d');
let particles = [];
function resizeCanvas() { pCanvas.width = window.innerWidth; pCanvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas); resizeCanvas();

class Spark {
  constructor(x, y, color) {
    this.x = x; this.y = y; this.color = color;
    const angle = Math.random() * Math.PI * 2, speed = Math.random() * 8 + 3;
    this.vx = Math.cos(angle) * speed; this.vy = Math.sin(angle) * speed - 2;
    this.radius = Math.random() * 4 + 2; this.alpha = 1; this.decay = Math.random() * 0.02 + 0.015;
  }
  update() { this.x += this.vx; this.y += this.vy; this.vy += 0.15; this.alpha -= this.decay; }
  draw(ctx) {
    ctx.save(); ctx.globalAlpha = Math.max(0, this.alpha); ctx.fillStyle = this.color;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
}
function triggerBurst(color) {
  const rect = document.getElementById('mainGenreCard').getBoundingClientRect();
  for (let i = 0; i < 70; i++) particles.push(new Spark(rect.left + rect.width/2, rect.top + rect.height/2, color));
}
function loopParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update(); particles[i].draw(pCtx);
    if (particles[i].alpha <= 0) particles.splice(i, 1);
  }
  requestAnimationFrame(loopParticles);
}
loopParticles();

function scrambleText(element, finalText) {
  const chars = '!<>-_\\/[]{}—=+*^?#';
  let iter = 0;
  clearInterval(element.scrambleInterval);
  element.scrambleInterval = setInterval(() => {
    element.textContent = finalText.split('').map((c, i) => i < iter ? finalText[i] : (c === ' ' ? ' ' : chars[Math.floor(Math.random()*chars.length)])).join('');
    if (iter >= finalText.length) clearInterval(element.scrambleInterval);
    iter += 1;
  }, 30);
}

const GENRES_DATA = [
  { id: 1, name: "Deconstructed Club", category: "GLITCH", categoryDisplay: "DIGITAL & GLITCH", subtag: "Industrial Avant", rarity: "CLASSIFIED", description: "Avant-garde dance music that tears apart traditional club rhythms into metallic clangs, crystalline textures, and sudden visceral drops.", origin: "Berlin / NY", peakEra: "2016–Present", energy: "🔥 Avant", spotifyQuery: "Deconstructed Club", ytMusicQuery: "Deconstructed Club music", artists: ["Arca", "Amnesia Scanner", "Lotic", "Toxe", "Total Freedom", "Rabit", "Sega Bodega", "Kelela", "Shygirl", "Eartheater"] },
  { id: 2, name: "Dark Pop", category: "INDIE", categoryDisplay: "INDIE & ALT", subtag: "Menacing Whisper", rarity: "MIL-SPEC", description: "Minor-key, cinematic pop driven by whispering vocal layers, ominous strings, and menacing sub-bass.", origin: "LA / Global", peakEra: "2018–Present", energy: "🖤 Dark", spotifyQuery: "Dark Pop", ytMusicQuery: "Dark pop playlist", artists: ["Billie Eilish", "FINNEAS", "Lorde (Pure Heroine)", "Banks", "Sevdaliza", "Sub Urban", "Melanie Martinez", "Bishop Briggs", "AURORA", "Two Feet"] },
  { id: 3, name: "Drift Phonk", category: "PHONK", categoryDisplay: "PHONK & DRIFT", subtag: "Cowbell • 160 BPM", rarity: "COVERT", description: "Distorted cowbell melodies, chopped Memphis rap vocals, and thunderous basslines made famous by street racing edits.", origin: "Russia / Internet", peakEra: "2020–Present", energy: "🏎️ Adrenaline Rush", spotifyQuery: "Drift Phonk", ytMusicQuery: "Drift phonk playlist", artists: ["Kordhell", "DVRST", "Pharmacist", "Hensonn", "SXID", "Kaito Shoma", "PlayaPhonk", "Shadxwbxrn", "MUPP", "Dxrk"] },
  { id: 4, name: "Rage Rap", category: "RAP", categoryDisplay: "RAP & UNDERGROUND", subtag: "Saw-Wave Synth Rhythms", rarity: "COVERT", description: "High-octane trap music defined by pulsating EDM lead synths, distorted 808s, and mosh-pit vocal deliveries.", origin: "Atlanta / Soundcloud", peakEra: "2020–Present", energy: "🔥 High Voltage", spotifyQuery: "Rage Rap", ytMusicQuery: "Rage rap playlist", artists: ["Playboi Carti", "Trippie Redd", "Yeat", "Ken Carson", "Destroy Lonely", "SoFaygo", "Homixide Gang", "Lancey Foux", "Lil Uzi Vert", "SSGKobe"] },
  { id: 5, name: "Modern P-Pop", category: "GLOBAL", categoryDisplay: "GLOBAL & REGIONAL", subtag: "Pinoy Idol Harmonies & Beats", rarity: "COVERT", description: "Cutting-edge Philippine pop music showcasing world-class vocal agility, traditional Filipino cultural elements, and tight EDM choreography.", origin: "Manila, Philippines", peakEra: "2020–Present", energy: "🇵🇭 High Energy Idol", spotifyQuery: "P-Pop Modern Filipino Pop", ytMusicQuery: "P-Pop songs playlist", artists: ["SB19", "BINI", "Alamat", "BGYO", "VXON", "Press Hit Play", "G22", "KAIA", "YGIG", "Felip (Ken)"] },
  { id: 6, name: "Brazilian Phonk", category: "PHONK", categoryDisplay: "PHONK & DRIFT", subtag: "Funk Mandelão Bass", rarity: "COVERT", description: "A fiery cross-pollination of Brazilian Baile Funk rhythms and heavy European drift phonk distorted cowbells.", origin: "São Paulo / Global", peakEra: "2022–Present", energy: "🔥 Explosive", spotifyQuery: "Brazilian Phonk", ytMusicQuery: "Brazilian phonk playlist", artists: ["DJ Paulinho PHL", "Slowboy", "Crazy Mano", "Phonkha", "Mc Mazzie", "DJ FKU", "Ariis", "G3OX_EM", "DJ K", "Mu540"] },
  { id: 7, name: "Midwest Emo Revival", category: "ROCK", categoryDisplay: "ROCK & POST-PUNK", subtag: "Twinkly Telecasters & Screams", rarity: "CLASSIFIED", description: "Mathy open-tuned sparkling guitar arpeggios that build to explosive, voice-cracking emotional choruses.", origin: "American Midwest", peakEra: "2019–Present", energy: "🎸 Twinkly Heartbreak", spotifyQuery: "Midwest Emo", ytMusicQuery: "Midwest emo playlist", artists: ["American Football", "Modern Baseball", "Marietta", "Hot Mulligan", "Mom Jeans.", "Tiny Moving Parts", "Origami Angel", "Free Throw", "The Hotelier", "Foxing"] },
  { id: 8, name: "Breakcore 2.0", category: "ELECTRONIC", categoryDisplay: "ELECTRONIC & BASS", subtag: "Frenetic Sliced Breaks", rarity: "CLASSIFIED", description: "Ultra-fast, micro-sliced Amen break patterns intertwined with melancholic anime melodies and emotional synth washes.", origin: "Internet / Australia", peakEra: "2020–Present", energy: "🌪️ Manic Melancholy", spotifyQuery: "Breakcore", ytMusicQuery: "Breakcore mix", artists: ["Sewerslvt", "Machine Girl", "Venetian Snares", "Igorrr", "Goreshit", "Loli in early 20s", "Nedaj", "Tokyopill", "Metaroom", "Replicant"] },
  { id: 9, name: "Hyperpop", category: "GLITCH", categoryDisplay: "DIGITAL & GLITCH", subtag: "Maximalist Sugar Rush", rarity: "COVERT", description: "Exaggerated high-velocity pop combining pitch-shifted vocal hooks, abrasive synth distortion, and playful metallic design.", origin: "London / Internet", peakEra: "2018–Present", energy: "⚡ Hyper", spotifyQuery: "Hyperpop", ytMusicQuery: "Hyperpop playlist", artists: ["SOPHIE", "Charli xcx", "100 gecs", "A. G. Cook", "Dorian Electra", "Hannah Diamond", "Dylan Brady", "Slayyyter", "Namo", "Danny L Harle"] },
  { id: 10, name: "Amapiano", category: "GLOBAL", categoryDisplay: "GLOBAL & REGIONAL", subtag: "The Iconic Log Drum", rarity: "COVERT", description: "South African deep house hybrid propelled by deep resonant log drum basslines, lush jazz keyboards, and infectious percussion.", origin: "Pretoria / Johannesburg, SA", peakEra: "2019–Present", energy: "🌍 Hypnotic Log Drum", spotifyQuery: "Amapiano", ytMusicQuery: "Amapiano playlist", artists: ["Kabza De Small", "DJ Maphorisa", "Uncle Waffles", "Focalistic", "Major League DJz", "Kelvin Momo", "Tyler ICU", "DBN Gogo", "Kamo Mphela", "Young Stunna"] }
];

let currentCategory = 'ALL', currentGenre = null, isSpinning = false;
let favorites = JSON.parse(localStorage.getItem('genz_favs_v2') || '[]');
let historyList = JSON.parse(localStorage.getItem('genz_hist_v2') || '[]');
let currentActiveTab = 'favs';
const CARD_WIDTH = 172;

function getFiltered() {
  return currentCategory === 'ALL' ? GENRES_DATA : GENRES_DATA.filter(g => g.category === currentCategory);
}

function renderDetail(genre, isUnbox = false) {
  currentGenre = genre;
  const rInfo = RARITY_MAP[genre.rarity] || RARITY_MAP['MIL-SPEC'];
  document.documentElement.style.setProperty('--active-accent', rInfo.color);
  document.documentElement.style.setProperty('--active-accent-glow', rInfo.glow);

  document.getElementById('proceduralArtSlot').innerHTML = generateProceduralArtwork(genre);
  document.getElementById('cardCategory').textContent = genre.categoryDisplay;
  
  const rPill = document.getElementById('cardRarity');
  rPill.textContent = genre.rarity; rPill.style.color = rInfo.color;
  rPill.style.backgroundColor = rInfo.bg; rPill.style.boxShadow = `0 0 14px ${rInfo.glow}`;
  document.getElementById('cardSubtag').textContent = genre.subtag;
  
  const titleEl = document.getElementById('cardTitle');
  if (isUnbox) scrambleText(titleEl, genre.name); else titleEl.textContent = genre.name;

  document.getElementById('cardDescription').textContent = genre.description;
  document.getElementById('cardOrigin').textContent = genre.origin;
  document.getElementById('cardEra').textContent = genre.peakEra;
  document.getElementById('cardEnergy').textContent = genre.energy;

  const card = document.getElementById('mainGenreCard');
  card.style.borderColor = `${rInfo.color}65`;
  card.style.boxShadow = `0 16px 44px rgba(0,0,0,0.65), 0 0 28px ${rInfo.glow}`;

  document.getElementById('spotifyBtn').href = `https://open.spotify.com/search/${encodeURIComponent(genre.spotifyQuery)}`;
  document.getElementById('ytmusicBtn').href = `https://music.youtube.com/search?q=${encodeURIComponent(genre.ytMusicQuery)}`;

  const grid = document.getElementById('artistsGrid');
  grid.innerHTML = '';
  genre.artists.forEach((a, i) => {
    const p = document.createElement('div'); p.className = 'artist-pill';
    p.innerHTML = `<div class="artist-info"><span class="artist-num">${String(i+1).padStart(2,'0')}</span><span class="artist-name">${a}</span></div><span class="artist-arrow">▾</span>`;
    p.onclick = () => openArtistPopover(a);
    grid.appendChild(p);
  });

  const fav = document.getElementById('favBtn');
  fav.textContent = favorites.includes(genre.id) ? '★' : '☆';
  fav.classList.toggle('favorited', favorites.includes(genre.id));

  if (isUnbox) {
    triggerBurst(rInfo.color);
    historyList = [genre.id, ...historyList.filter(id => id !== genre.id)].slice(0, 50);
    localStorage.setItem('genz_hist_v2', JSON.stringify(historyList));
    updateHistoryCounts();
  }
}

function setupRouletteTrack() {
  const track = document.getElementById('rouletteTrack');
  track.innerHTML = '';
  const pool = getFiltered();
  document.getElementById('caseCountBadge').textContent = `${pool.length} GENRES`;
  
  for (let i = 0; i < 60; i++) {
    const item = pool[Math.floor(Math.random() * pool.length)];
    const rInfo = RARITY_MAP[item.rarity] || RARITY_MAP['MIL-SPEC'];
    const card = document.createElement('div');
    card.className = 'roulette-item-card';
    card.style.color = rInfo.color;
    card.style.borderColor = `${rInfo.color}35`;
    card.innerHTML = `<span class="roulette-item-cat" style="color:${rInfo.color}">${item.categoryDisplay}</span><span class="roulette-item-title">${item.name}</span><span class="roulette-item-sub">${item.subtag}</span>`;
    track.appendChild(card);
  }
  
  track.style.transition = 'none';
  const vp = document.getElementById('trackViewport');
  track.style.transform = `translateX(${(vp.clientWidth / 2) - (CARD_WIDTH / 2)}px)`;
}

/* =========================================================
   INFINITE SPIN ANIMATION ENGINE
   ========================================================= */
function spinRoulette() {
  if (isSpinning) return;
  audio.init();
  audio.playWhoosh();
  isSpinning = true;

  const btn = document.getElementById('openCaseBtn');
  btn.classList.add('spinning');
  btn.querySelector('.open-case-text').textContent = 'UNBOXING...';

  const pool = getFiltered();
  const winner = pool[Math.floor(Math.random() * pool.length)];
  const winIndex = 48; // Target index in reel

  const track = document.getElementById('rouletteTrack');
  const vp = document.getElementById('trackViewport');
  const viewportWidth = vp.clientWidth || 400;
  const initialOffset = (viewportWidth / 2) - (CARD_WIDTH / 2);

  // 1. Rebuild track with fresh pool items
  track.innerHTML = '';
  for (let i = 0; i < 60; i++) {
    let item;
    if (i === 0 && currentGenre) {
      item = currentGenre;
    } else if (i === winIndex) {
      item = winner;
    } else {
      item = pool[Math.floor(Math.random() * pool.length)];
    }
    const rInfo = RARITY_MAP[item.rarity] || RARITY_MAP['MIL-SPEC'];
    const card = document.createElement('div');
    card.className = 'roulette-item-card';
    card.style.color = rInfo.color;
    card.style.borderColor = `${rInfo.color}35`;
    card.innerHTML = `<span class="roulette-item-cat" style="color:${rInfo.color}">${item.categoryDisplay}</span><span class="roulette-item-title">${item.name}</span><span class="roulette-item-sub">${item.subtag}</span>`;
    track.appendChild(card);
  }

  // 2. Snap to start position with NO transition
  track.style.transition = 'none';
  track.style.transform = `translateX(${initialOffset}px)`;

  // 3. Force DOM Reflow
  void track.offsetWidth;

  // 4. Trigger spin on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const randomOffset = (Math.random() * 60) - 30;
      const targetTranslateX = - (winIndex * CARD_WIDTH) + initialOffset + randomOffset;
      const durationMs = 5000;

      track.style.transition = `transform ${durationMs}ms cubic-bezier(0.12, 0.8, 0.2, 1)`;
      track.style.transform = `translateX(${targetTranslateX}px)`;

      const startTicking = Date.now();
      const tickInterval = setInterval(() => {
        const elapsed = Date.now() - startTicking;
        if (elapsed >= durationMs - 120) {
          clearInterval(tickInterval);
          return;
        }
        const progress = elapsed / durationMs;
        const tickProbability = Math.pow(1 - progress, 2);
        if (Math.random() < tickProbability * 1.6) {
          audio.playTick();
          if (navigator.vibrate) navigator.vibrate(8);
        }
      }, 45);

      setTimeout(() => {
        isSpinning = false;
        btn.classList.remove('spinning');
        btn.querySelector('.open-case-text').textContent = 'OPEN CASE';
        
        const cards = track.children;
        if (cards[winIndex]) {
          cards[winIndex].classList.add('winning-highlight');
          setTimeout(() => cards[winIndex].classList.remove('winning-highlight'), 1800);
        }
        audio.playWin(winner.rarity);
        if (navigator.vibrate) navigator.vibrate([40, 60, 80]);
        renderDetail(winner, true);
        showToast(`🎉 Unboxed: ${winner.name}!`);
      }, durationMs + 100);
    });
  });
}

/* =========================================================
   COLLAPSIBLE ACCORDION HANDLERS
   ========================================================= */
const genreCardHeader = document.getElementById('genreCardHeader');
const genreAccordionDrawer = document.getElementById('genreAccordionDrawer');
const genreChevron = document.getElementById('genreChevron');

genreCardHeader.onclick = () => {
  const isExpanded = genreAccordionDrawer.classList.toggle('expanded');
  genreChevron.classList.toggle('rotated', isExpanded);
};

const artistsHeader = document.getElementById('artistsHeader');
const artistsAccordionDrawer = document.getElementById('artistsAccordionDrawer');
const artistsChevron = document.getElementById('artistsChevron');
const artistsToggleText = document.getElementById('artistsToggleText');

artistsHeader.onclick = () => {
  const isExpanded = artistsAccordionDrawer.classList.toggle('expanded');
  artistsChevron.classList.toggle('rotated', isExpanded);
  artistsToggleText.textContent = isExpanded ? 'Tap to hide' : 'Tap to view';
};

function openArtistPopover(name) {
  document.getElementById('modalArtistName').textContent = name;
  document.getElementById('modalSpotifyLink').href = `https://open.spotify.com/search/${encodeURIComponent(name)}`;
  document.getElementById('modalYtMusicLink').href = `https://music.youtube.com/search?q=${encodeURIComponent(name)}`;
  document.getElementById('modalYoutubeLink').href = `https://www.youtube.com/results?search_query=${encodeURIComponent(name + ' music')}`;
  document.getElementById('modalCopyArtistBtn').onclick = () => {
    navigator.clipboard.writeText(name).then(() => {
      showToast(`Copied ${name}!`);
      document.getElementById('artistModal').classList.remove('active');
    });
  };
  document.getElementById('artistModal').classList.add('active');
}

function showToast(msg) {
  const t = document.getElementById('toastPill');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function updateHistoryCounts() {
  document.getElementById('favCount').textContent = favorites.length;
  document.getElementById('histCount').textContent = historyList.length;
}

// Bind Controls
document.getElementById('openCaseBtn').onclick = spinRoulette;
document.querySelectorAll('.category-chip[data-cat]').forEach(chip => {
  chip.onclick = () => {
    if (isSpinning) return;
    document.querySelectorAll('.category-chip[data-cat]').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentCategory = chip.getAttribute('data-cat');
    setupRouletteTrack();
  };
});

document.getElementById('favBtn').onclick = () => {
  if (!currentGenre) return;
  if (favorites.includes(currentGenre.id)) {
    favorites = favorites.filter(id => id !== currentGenre.id);
    showToast('Removed from Saved');
  } else {
    favorites.push(currentGenre.id);
    showToast('Saved to Vault ⭐');
  }
  localStorage.setItem('genz_favs_v2', JSON.stringify(favorites));
  document.getElementById('favBtn').textContent = favorites.includes(currentGenre.id) ? '★' : '☆';
  document.getElementById('favBtn').classList.toggle('favorited', favorites.includes(currentGenre.id));
  updateHistoryCounts();
};

document.getElementById('copyBtn').onclick = () => {
  if (!currentGenre) return;
  const text = `⚡ ${currentGenre.name} (${currentGenre.categoryDisplay})\n${currentGenre.description}\nOrigin: ${currentGenre.origin} | Era: ${currentGenre.peakEra} | Energy: ${currentGenre.energy}\nTop Artists: ${currentGenre.artists.slice(0, 5).join(', ')}`;
  navigator.clipboard.writeText(text).then(() => showToast('📋 Copied genre card info!'));
};

document.getElementById('soundToggleBtn').onclick = () => {
  audio.soundEnabled = !audio.soundEnabled;
  document.getElementById('soundIcon').textContent = audio.soundEnabled ? '🔊' : '🔇';
  showToast(audio.soundEnabled ? 'Audio Enabled' : 'Audio Muted');
};

document.getElementById('closeArtistModal').onclick = () => document.getElementById('artistModal').classList.remove('active');

// Mode Switch
document.getElementById('rouletteModeBtn').onclick = () => {
  document.getElementById('rouletteModeBtn').classList.add('active');
  document.getElementById('manualModeBtn').classList.remove('active');
  document.getElementById('rouletteContainer').style.display = 'block';
  document.getElementById('manualBrowser').classList.remove('active');
};

document.getElementById('manualModeBtn').onclick = () => {
  document.getElementById('manualModeBtn').classList.add('active');
  document.getElementById('rouletteModeBtn').classList.remove('active');
  document.getElementById('rouletteContainer').style.display = 'none';
  document.getElementById('manualBrowser').classList.add('active');
  renderManualList();
};

function renderManualList(query = '') {
  const manualListItems = document.getElementById('manualListItems');
  manualListItems.innerHTML = '';
  const pool = getFiltered();
  const filtered = pool.filter(g => {
    if (!query) return true;
    const q = query.toLowerCase();
    return g.name.toLowerCase().includes(q) ||
           g.subtag.toLowerCase().includes(q) ||
           g.description.toLowerCase().includes(q) ||
           g.artists.some(a => a.toLowerCase().includes(q));
  });

  if (filtered.length === 0) {
    manualListItems.innerHTML = '<div style="color:var(--text-dim); text-align:center; padding:16px; font-size:0.8rem;">No genres found.</div>';
    return;
  }

  filtered.forEach(item => {
    const rInfo = RARITY_MAP[item.rarity] || RARITY_MAP['MIL-SPEC'];
    const row = document.createElement('div');
    row.className = 'manual-row';
    row.innerHTML = `
      <div>
        <div class="manual-row-title">${item.name}</div>
        <div class="manual-row-cat">${item.categoryDisplay} • ${item.subtag}</div>
      </div>
      <span style="font-size:0.7rem; font-weight:700; color:${rInfo.color}">${item.rarity}</span>
    `;
    row.onclick = () => {
      renderDetail(item, true);
      showToast(`Selected ${item.name}`);
    };
    manualListItems.appendChild(row);
  });
}

document.getElementById('genreSearchInput').oninput = (e) => {
  renderManualList(e.target.value);
};

// Vault Modal
document.getElementById('savedHistoryBtn').onclick = () => {
  renderHistoryModal();
  document.getElementById('historyModal').classList.add('active');
};
document.getElementById('closeHistoryModal').onclick = () => document.getElementById('historyModal').classList.remove('active');
document.getElementById('historyModal').onclick = (e) => {
  if (e.target === document.getElementById('historyModal')) document.getElementById('historyModal').classList.remove('active');
};

document.getElementById('tabFavoritesBtn').onclick = () => {
  currentActiveTab = 'favs';
  document.getElementById('tabFavoritesBtn').classList.add('active');
  document.getElementById('tabRecentBtn').classList.remove('active');
  renderHistoryModal();
};
document.getElementById('tabRecentBtn').onclick = () => {
  currentActiveTab = 'hist';
  document.getElementById('tabRecentBtn').classList.add('active');
  document.getElementById('tabFavoritesBtn').classList.remove('active');
  renderHistoryModal();
};

function renderHistoryModal() {
  updateHistoryCounts();
  const listContainer = document.getElementById('historyListItems');
  listContainer.innerHTML = '';
  const ids = currentActiveTab === 'favs' ? favorites : historyList;

  if (ids.length === 0) {
    listContainer.innerHTML = `<div style="color:var(--text-dim); text-align:center; padding:20px; font-size:0.84rem;">No items in ${currentActiveTab === 'favs' ? 'Favorites' : 'History'} yet.</div>`;
    return;
  }

  ids.forEach(id => {
    const item = GENRES_DATA.find(g => g.id === id);
    if (!item) return;
    const rInfo = RARITY_MAP[item.rarity] || RARITY_MAP['MIL-SPEC'];
    const row = document.createElement('div');
    row.className = 'manual-row';
    row.innerHTML = `
      <div>
        <div class="manual-row-title">${item.name}</div>
        <div class="manual-row-cat">${item.categoryDisplay} • ${item.energy}</div>
      </div>
      <span style="font-size:0.7rem; font-weight:700; color:${rInfo.color}">${item.rarity}</span>
    `;
    row.onclick = () => {
      renderDetail(item, false);
      document.getElementById('historyModal').classList.remove('active');
      showToast(`Loaded ${item.name}`);
    };
    listContainer.appendChild(row);
  });
}

// Init
setupRouletteTrack();
renderDetail(GENRES_DATA[0], false);
updateHistoryCounts();
