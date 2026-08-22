const RARITY_MAP = {
  'MIL-SPEC': { color: '#4b69ff', bg: 'rgba(75, 105, 255, 0.15)', glow: 'rgba(75, 105, 255, 0.35)' },
  'RESTRICTED': { color: '#8847ff', bg: 'rgba(136, 71, 255, 0.15)', glow: 'rgba(136, 71, 255, 0.35)' },
  'CLASSIFIED': { color: '#d32ce6', bg: 'rgba(211, 44, 230, 0.15)', glow: 'rgba(211, 44, 230, 0.35)' },
  'COVERT': { color: '#eb4b4b', bg: 'rgba(235, 75, 75, 0.15)', glow: 'rgba(235, 75, 75, 0.4)' },
  'EXOTIC / CONTRABAND': { color: '#ffd700', bg: 'rgba(255, 215, 0, 0.18)', glow: 'rgba(255, 215, 0, 0.5)' }
};

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

function spinRoulette() {
  if (isSpinning) return;
  audio.init(); audio.playWhoosh();
  isSpinning = true;
  const btn = document.getElementById('openCaseBtn');
  btn.classList.add('spinning');
  btn.querySelector('.open-case-text').textContent = 'UNBOXING...';

  const pool = getFiltered();
  const winner = pool[Math.floor(Math.random() * pool.length)];
  const winIndex = 48;

  const cards = document.getElementById('rouletteTrack').children;
  if (cards[winIndex]) {
    const rInfo = RARITY_MAP[winner.rarity] || RARITY_MAP['MIL-SPEC'];
    cards[winIndex].style.color = rInfo.color;
    cards[winIndex].style.borderColor = `${rInfo.color}90`;
    cards[winIndex].innerHTML = `<span class="roulette-item-cat" style="color:${rInfo.color}">${winner.categoryDisplay}</span><span class="roulette-item-title">${winner.name}</span><span class="roulette-item-sub">${winner.subtag}</span>`;
  }

  const vp = document.getElementById('trackViewport');
  const offset = (Math.random() * 60) - 30;
  const target = - (winIndex * CARD_WIDTH) + (vp.clientWidth / 2) - (CARD_WIDTH / 2) + offset;
  const track = document.getElementById('rouletteTrack');
  track.style.transition = 'transform 5000ms cubic-bezier(0.12, 0.8, 0.2, 1)';
  track.style.transform = `translateX(${target}px)`;

  const start = Date.now();
  const interval = setInterval(() => {
    const elapsed = Date.now() - start;
    if (elapsed >= 4880) { clearInterval(interval); return; }
    if (Math.random() < Math.pow(1 - (elapsed/5000), 2) * 1.6) {
      audio.playTick();
      if (navigator.vibrate) navigator.vibrate(8);
    }
  }, 45);

  setTimeout(() => {
    isSpinning = false;
    btn.classList.remove('spinning');
    btn.querySelector('.open-case-text').textContent = 'OPEN CASE';
    if (cards[winIndex]) {
      cards[winIndex].classList.add('winning-highlight');
      setTimeout(() => cards[winIndex].classList.remove('winning-highlight'), 1800);
    }
    audio.playWin(winner.rarity);
    if (navigator.vibrate) navigator.vibrate([40, 60, 80]);
    renderDetail(winner, true);
    showToast(`🎉 Unboxed: ${winner.name}!`);
  }, 5100);
}

const mainCard = document.getElementById('mainGenreCard');
mainCard.addEventListener('mousemove', (e) => {
  const rect = mainCard.getBoundingClientRect();
  const x = e.clientX - rect.left, y = e.clientY - rect.top;
  const rotX = ((y - rect.height/2) / (rect.height/2)) * -6;
  const rotY = ((x - rect.width/2) / (rect.width/2)) * 6;
  mainCard.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
});
mainCard.addEventListener('mouseleave', () => mainCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)');

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

// Init
setupRouletteTrack();
renderDetail(GENRES_DATA[0], false);
updateHistoryCounts();
