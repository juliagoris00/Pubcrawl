// Lille Bar Crawl Bingo
// 1) Vul hieronder je Firebase-config in voor live-scorebord.
// 2) Gebruik dezelfde eventId voor iedereen in je groep.
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
const eventId = "lille-zaterdag-barcrawl-2026";

const tasks = [
  "Bestel iets in het Frans",
  "Maak een groepsselfie",
  "Proost met een vreemde",
  "Vind iemand uit Lille",
  "Drink een lokaal biertje",
  "Zing een refrein mee",
  "Doe een dansmove in de bar",
  "High-five een vreemde",
  "Vraag om een kroegtip",
  "Maak een foto met neonlicht",
  "Eet friet of een snack",
  "Bestel water tussendoor",
  "Vind iemand met een gestreept shirt",
  "Maak een foto van een gek glas",
  "Iemand zegt ‘santé’",
  "Speel steen-papier-schaar met een local",
  "Krijg een compliment",
  "Geef iemand een bijnaam voor de avond",
  "Spot een vrijgezellenfeest",
  "Maak een foto bij de Grand Place",
  "Laat iemand een liedje kiezen",
  "Doe alsof je gids bent",
  "Leer één Frans woord",
  "Maak een cheers-video",
  "Laat de groep stemmen op de volgende bar",
  "Neem een 0.0 of frisronde",
  "Vind de goedkoopste pint",
  "Maak een foto met de bartender, alleen met toestemming",
  "Speel luchtgitaar",
  "Vraag naar de specialiteit van de bar",
  "Maak een foto van de meest Franse outfit",
  "Iemand morst een beetje",
  "Doe een mini-polonaise",
  "Laat iemand je kaart aftekenen",
  "Vertel een slechte mop",
  "Spot een hond",
  "Zeg ‘merci beaucoup’ overdreven netjes",
  "Bedenk een groepsyell",
  "Maak een foto met iets roods",
  "Win een korte toast-battle"
];

const storageKey = `bingo-${eventId}`;
const playerIdKey = `${storageKey}-player-id`;
let state = loadState();
let db = null;
let dbApi = null;

const board = document.querySelector('#board');
const playerName = document.querySelector('#playerName');
const checkedCount = document.querySelector('#checkedCount');
const bingoCount = document.querySelector('#bingoCount');
const rankText = document.querySelector('#rankText');
const bingoBanner = document.querySelector('#bingoBanner');
const scoreboard = document.querySelector('#scoreboard');
const syncStatus = document.querySelector('#syncStatus');

init();

async function init() {
  playerName.value = state.name || "";
  if (!state.card.length) createCard();
  renderBoard();
  renderStats();
  bindEvents();
  await initFirebase();
  await publishScore();
}

function bindEvents() {
  document.querySelector('#saveNameBtn').addEventListener('click', () => {
    state.name = cleanName(playerName.value);
    saveState();
    publishScore();
  });
  playerName.addEventListener('change', () => {
    state.name = cleanName(playerName.value);
    saveState();
    publishScore();
  });
  document.querySelector('#newCardBtn').addEventListener('click', () => {
    const ok = confirm('Nieuwe kaart maken? Je huidige vinkjes verdwijnen.');
    if (!ok) return;
    createCard();
    state.checked = [12];
    saveState();
    renderBoard();
    renderStats();
    publishScore();
  });
  document.querySelector('#shareBtn').addEventListener('click', async () => {
    const shareData = { title: 'Lille Bar Crawl Bingo', text: 'Doe mee met Bar Crawl Bingo 🍻', url: location.href };
    if (navigator.share) await navigator.share(shareData);
    else {
      await navigator.clipboard.writeText(location.href);
      alert('Link gekopieerd!');
    }
  });
}

function createCard() {
  const shuffled = shuffle([...tasks]).slice(0, 24);
  shuffled.splice(12, 0, '🍻 GRATIS VAKJE: Cheers!');
  state.card = shuffled;
  state.checked = [12];
  state.createdAt = Date.now();
  saveState();
}

function renderBoard() {
  board.innerHTML = '';
  state.card.forEach((task, index) => {
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.type = 'button';
    cell.textContent = task;
    if (index === 12) cell.classList.add('free');
    if (state.checked.includes(index)) cell.classList.add('checked');
    cell.addEventListener('click', () => toggleCell(index));
    board.appendChild(cell);
  });
}

function toggleCell(index) {
  if (index === 12) return;
  if (state.checked.includes(index)) state.checked = state.checked.filter(i => i !== index);
  else state.checked.push(index);
  saveState();
  renderBoard();
  renderStats(true);
  publishScore();
}

function renderStats(allowConfetti = false) {
  const bingos = countBingos(state.checked);
  checkedCount.textContent = state.checked.length;
  bingoCount.textContent = bingos;
  bingoBanner.classList.toggle('hidden', bingos === 0);
  if (allowConfetti && bingos > state.lastBingoCount) launchConfetti();
  state.lastBingoCount = bingos;
  saveState();
}

function countBingos(checked) {
  const set = new Set(checked);
  const lines = [];
  for (let r = 0; r < 5; r++) lines.push([0,1,2,3,4].map(c => r * 5 + c));
  for (let c = 0; c < 5; c++) lines.push([0,1,2,3,4].map(r => r * 5 + c));
  lines.push([0,6,12,18,24], [4,8,12,16,20]);
  return lines.filter(line => line.every(i => set.has(i))).length;
}

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (saved) return JSON.parse(saved);
  return { name: '', card: [], checked: [], lastBingoCount: 0, createdAt: Date.now() };
}
function saveState() { localStorage.setItem(storageKey, JSON.stringify(state)); }
function getPlayerId() {
  let id = localStorage.getItem(playerIdKey);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(playerIdKey, id); }
  return id;
}
function cleanName(name) { return (name || '').trim().slice(0, 24) || 'Naamloos'; }
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function initFirebase() {
  if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
    renderLocalScoreboard();
    return;
  }
  try {
    const appModule = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js');
    const dbModule = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js');
    const app = appModule.initializeApp(firebaseConfig);
    db = dbModule.getDatabase(app);
    dbApi = dbModule;
    syncStatus.textContent = 'live verbonden';
    const scoresRef = dbApi.ref(db, `events/${eventId}/players`);
    dbApi.onValue(scoresRef, snap => renderScoreboard(snap.val() || {}));
  } catch (error) {
    console.error(error);
    syncStatus.textContent = 'offline modus';
    renderLocalScoreboard();
  }
}

async function publishScore() {
  const name = cleanName(playerName.value || state.name);
  state.name = name;
  saveState();
  const payload = {
    name,
    checked: state.checked.length,
    bingos: countBingos(state.checked),
    updatedAt: Date.now()
  };
  if (!db || !dbApi) {
    renderLocalScoreboard();
    return;
  }
  await dbApi.set(dbApi.ref(db, `events/${eventId}/players/${getPlayerId()}`), payload);
}

function renderLocalScoreboard() {
  const me = { name: cleanName(playerName.value || state.name), checked: state.checked.length, bingos: countBingos(state.checked), updatedAt: Date.now() };
  renderScoreboard({ [getPlayerId()]: me });
}

function renderScoreboard(players) {
  const rows = Object.entries(players).map(([id, p]) => ({ id, ...p }))
    .sort((a, b) => (b.bingos - a.bingos) || (b.checked - a.checked) || (a.updatedAt - b.updatedAt));
  scoreboard.innerHTML = '';
  rows.slice(0, 30).forEach((p, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${escapeHtml(p.name)} <span>— ${p.bingos || 0} bingo, ${p.checked || 0}/25 vakjes</span>`;
    scoreboard.appendChild(li);
    if (p.id === getPlayerId()) rankText.textContent = `#${index + 1}`;
  });
  if (!rows.length) rankText.textContent = '–';
}
function escapeHtml(str) {
  return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
}

function launchConfetti() {
  const canvas = document.querySelector('#confetti');
  const ctx = canvas.getContext('2d');
  canvas.width = innerWidth; canvas.height = innerHeight;
  const pieces = Array.from({length: 120}, () => ({ x: Math.random()*canvas.width, y: -20, s: 4+Math.random()*8, v: 2+Math.random()*5, r: Math.random()*Math.PI }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p => { p.y += p.v; p.x += Math.sin(frame/10 + p.r)*2; ctx.fillRect(p.x, p.y, p.s, p.s*0.6); });
    frame++;
    if (frame < 120) requestAnimationFrame(draw);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  draw();
}
