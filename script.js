/* =========================================================
   CHAOS SYNDICATE
   script.js
   ========================================================= */

"use strict";

/* =========================================================
   CREW DATA
   ========================================================= */

const crew = {
  deepika: {
    name: "Deepika",
    nickname: "DΞΞP",
    role: "CHAOS QUEEN 👑",
    id: "ROOT-001",
    bio: "Owner of the entire chaos system. Reality officially has no control here.",
    xp: 999,
    chaos: "MAX",
    battles: 0,
    pfp: "pfp-deepika"
  },

  yashika: {
    name: "Yashika",
    nickname: "YASH",
    role: "CRIME PARTNER 🧨",
    id: "PARTNER-002",
    bio: "The person most likely to turn a normal plan into absolute chaos.",
    xp: 750,
    chaos: "HIGH",
    battles: 0,
    pfp: "pfp-yashika"
  },

  mariya: {
    name: "Mariya",
    nickname: "MARI",
    role: "BFF 🦋",
    id: "MARIYA-003",
    bio: "Brain of the group until somebody activates random chaos mode.",
    xp: 820,
    chaos: "HIGH",
    battles: 0,
    pfp: "pfp-mariya"
  },

  bro: {
    name: "Bro",
    nickname: "BRO",
    role: "BRO 🛠️",
    id: "BRO-004",
    bio: "System tank. Professional protector of the inner circle.",
    xp: 690,
    chaos: "MED",
    battles: 0,
    pfp: "pfp-bro"
  },

  dora: {
    name: "Dora",
    nickname: "DORA",
    role: "BESTIE 🐻",
    id: "DORA-005",
    bio: "Nobody knows what Dora will do next. Including Dora.",
    xp: 777,
    chaos: "???",
    battles: 0,
    pfp: "pfp-dora"
  }
};


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let chaos = Number(localStorage.getItem("chaosLevel") || 1);
let battles = Number(localStorage.getItem("battleCount") || 0);
let secrets = Number(localStorage.getItem("secretCount") || 0);
let gameScore = Number(localStorage.getItem("gameScore") || 0);

let currentSong = 0;
let localSongs = [];

let cameraStream = null;

let drawing = false;
let drawCanvas = null;
let drawCtx = null;

let challengeInterval = null;


/* =========================================================
   HELPERS
   ========================================================= */

function $(id) {
  return document.getElementById(id);
}

function saveStats() {
  localStorage.setItem("chaosLevel", chaos);
  localStorage.setItem("battleCount", battles);
  localStorage.setItem("secretCount", secrets);
  localStorage.setItem("gameScore", gameScore);
}

function updateDashboard() {
  const chaosEl = $("chaosLevel");
  const battleEl = $("battleCount");
  const secretEl = $("secretCount");
  const scoreEl = $("gameScore");

  if (chaosEl) {
    chaosEl.textContent = String(chaos).padStart(3, "0");
  }

  if (battleEl) {
    battleEl.textContent = battles;
  }

  if (secretEl) {
    secretEl.textContent = secrets;
  }

  if (scoreEl) {
    scoreEl.textContent = `SCORE: ${gameScore}`;
  }
}

function toast(message) {
  let box = $("toast");

  if (!box) {
    box = document.createElement("div");
    box.id = "toast";
    box.className = "toast";
    document.body.appendChild(box);
  }

  box.textContent = message;
  box.classList.add("show");

  clearTimeout(box._timer);

  box._timer = setTimeout(() => {
    box.classList.remove("show");
  }, 2500);
}

function addChaos(amount = 1) {
  chaos += amount;

  if (chaos > 999) {
    chaos = 999;
  }

  saveStats();
  updateDashboard();
}


/* =========================================================
   BOOT SCREEN
   ========================================================= */

function startBoot() {
  const boot = $("bootScreen");

  if (!boot) return;

  setTimeout(() => {
    boot.classList.add("hidden");
  }, 2800);
}


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function showSection(sectionId) {
  const pages = document.querySelectorAll(".page");

  pages.forEach(page => {
    page.classList.remove("active");
  });

  const target = $(sectionId);

  if (!target) {
    toast("ROOM NOT FOUND");
    return;
  }

  target.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (sectionId === "draw") {
    setupDrawing();
  }

  if (sectionId === "wall") {
    renderWall();
  }

  if (sectionId === "chat") {
    renderChat();
  }

  if (sectionId === "fm") {
    updateMusicDisplay();
  }
}


/* =========================================================
   PROFILE SYSTEM
   ========================================================= */

function openProfile(id) {
  const member = crew[id];

  if (!member) {
    toast("PROFILE NOT FOUND");
    return;
  }

  const modal = $("profileModal");

  if (!modal) return;

  const pfp = $("profilePfp");
  const role = $("profileRole");
  const name = $("profileName");
  const nickname = $("profileNickname");
  const bio = $("profileBio");
  const xp = $("profileXP");
  const chaosValue = $("profileChaos");
  const battleValue = $("profileBattles");

  if (pfp) {
    pfp.className = `profile-pfp ${member.pfp}`;
  }

  if (role) role.textContent = member.role;
  if (name) name.textContent = member.name;
  if (nickname) nickname.textContent = member.nickname;
  if (bio) bio.textContent = member.bio;
  if (xp) xp.textContent = member.xp;
  if (chaosValue) chaosValue.textContent = member.chaos;
  if (battleValue) battleValue.textContent = member.battles;

  modal.classList.add("active");

  addChaos(1);
}

function closeProfile() {
  const modal = $("profileModal");

  if (modal) {
    modal.classList.remove("active");
  }
}


/* =========================================================
   CHAOS SYSTEM
   ========================================================= */

const chaosMessages = [
  "SYSTEM BREACH DETECTED ⚡",
  "DORA MOMENT DETECTED 🐻💀",
  "YASHIKA MODE ACTIVATED 🧨",
  "MARIYA BRAIN MODE ONLINE 🦋🧠",
  "BRO SHIELD DEPLOYED 🛠️",
  "OWNER MODE DETECTED 👑",
  "UNKNOWN SIGNAL FOUND 📡",
  "SOMEONE PRESSED THE CHAOS BUTTON 💀",
  "REALITY SHIFT IN PROGRESS 🌌",
  "NEW CLASSIFIED FILE DISCOVERED 🔐",
  "THE INNER CIRCLE HAS AWAKENED ⚡",
  "404: NORMALITY NOT FOUND 💀"
];

function activateChaos() {
  addChaos(Math.floor(Math.random() * 20) + 5);

  const message =
    chaosMessages[Math.floor(Math.random() * chaosMessages.length)];

  const system = $("systemMessage");

  if (system) {
    system.textContent = message;
  }

  document.body.classList.add("glitch");

  setTimeout(() => {
    document.body.classList.remove("glitch");
  }, 700);

  toast(message);
}


/* =========================================================
   RANDOM CHAOS GENERATOR
   ========================================================= */

function randomChaos() {
  const events = [
    "Dora has entered the system. Nobody is safe. 🐻",
    "Yashika changed the rules. Again. 🧨",
    "Bro activated maximum defense. 🛠️",
    "Mariya has calculated your next move. 🦋🧠",
    "Deepika has overridden reality. 👑",
    "A mysterious file appeared in the system. 🔐",
    "The website is pretending to be normal. Failed. 💀",
    "Everyone gets +10 chaos XP.",
    "A secret signal has been detected. 📡",
    "CHAOS LEVEL CRITICAL ⚡"
  ];

  const result =
    events[Math.floor(Math.random() * events.length)];

  gameScore += 10;
  addChaos(5);

  const output = $("gameOutput");

  if (output) {
    output.textContent = result;
  }

  saveStats();
  updateDashboard();
}


/* =========================================================
   CHAT SYSTEM
   ========================================================= */

function getChat() {
  try {
    return JSON.parse(localStorage.getItem("chaosChat")) || [];
  } catch {
    return [];
  }
}

function saveChat(messages) {
  localStorage.setItem("chaosChat", JSON.stringify(messages));
}

function renderChat() {
  const box = $("chatMessages");

  if (!box) return;

  const messages = getChat();

  box.innerHTML = "";

  if (messages.length === 0) {
    box.innerHTML = `
      <div class="chat-message">
        <div class="chat-name">SYSTEM</div>
        Welcome to CREW CHAT ⚡
      </div>
    `;

    return;
  }

  messages.forEach(message => {
    const div = document.createElement("div");

    div.className = "chat-message";

    div.innerHTML = `
      <div class="chat-name">${escapeHTML(message.name)}</div>
      <div>${escapeHTML(message.text)}</div>
      <div class="chat-time">${escapeHTML(message.time)}</div>
    `;

    box.appendChild(div);
  });

  box.scrollTop = box.scrollHeight;
}

function sendMessage() {
  const input = $("chatInput");

  if (!input) return;

  const text = input.value.trim();

  if (!text) {
    toast("TYPE SOMETHING FIRST 💀");
    return;
  }

  const messages = getChat();

  messages.push({
    name: "Deepika",
    text,
    time: new Date().toLocaleTimeString()
  });

  saveChat(messages);

  input.value = "";

  renderChat();

  addChaos(1);
}

function quickReaction(reaction) {
  const input = $("chatInput");

  if (input) {
    input.value += reaction;
    input.focus();
  }
}


/* =========================================================
   WALL SYSTEM
   ========================================================= */

function getPosts() {
  try {
    return JSON.parse(localStorage.getItem("chaosWall")) || [];
  } catch {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem("chaosWall", JSON.stringify(posts));
}

function createPost() {
  const input = $("postInput");

  if (!input) return;

  const text = input.value.trim();

  if (!text) {
    toast("EMPTY POST 💀");
    return;
  }

  const posts = getPosts();

  posts.unshift({
    author: "Deepika",
    text,
    time: new Date().toLocaleString(),
    reactions: 0
  });

  savePosts(posts);

  input.value = "";

  renderWall();

  addChaos(2);

  toast("POST DEPLOYED ⚡");
}

function renderWall() {
  const wall = $("wallPosts");

  if (!wall) return;

  const posts = getPosts();

  wall.innerHTML = "";

  if (posts.length === 0) {
    wall.innerHTML = `
      <div class="panel">
        NO POSTS YET.<br>
        BE THE FIRST TO DROP CHAOS.
      </div>
    `;

    return;
  }

  posts.forEach((post, index) => {
    const article = document.createElement("article");

    article.className = "post";

    article.innerHTML = `
      <div class="post-header">
        <span class="post-author">${escapeHTML(post.author)}</span>
        <span>${escapeHTML(post.time)}</span>
      </div>

      <p>${escapeHTML(post.text)}</p>

      <button class="btn secondary" onclick="reactPost(${index})">
        ⚡ ${post.reactions || 0}
      </button>
    `;

    wall.appendChild(article);
  });
}

function reactPost(index) {
  const posts = getPosts();

  if (!posts[index]) return;

  posts[index].reactions =
    Number(posts[index].reactions || 0) + 1;

  savePosts(posts);
  renderWall();

  addChaos(1);
}


/* =========================================================
   GAME: GUESS THE FRIEND
   ========================================================= */

function guessFriend() {
  const names = Object.keys(crew);

  const randomKey =
    names[Math.floor(Math.random() * names.length)];

  const member = crew[randomKey];

  const output = $("gameOutput");

  if (!output) return;

  output.innerHTML = `
    <strong>WHO IS THIS?</strong><br><br>
    ROLE: ${member.role}<br>
    SYSTEM ID: ${member.id}<br>
    CHAOS: ${member.chaos}
    <br><br>
    Answer: ??? 
  `;

  setTimeout(() => {
    output.innerHTML += `
      <br><br>
      <strong>ANSWER: ${member.name} 🎯</strong>
    `;

    gameScore += 25;
    addChaos(2);
    saveStats();
    updateDashboard();
  }, 2200);
}


/* =========================================================
   GAME: MOST LIKELY
   ========================================================= */

function mostLikely() {
  const questions = [
    "Who is most likely to start random chaos?",
    "Who is most likely to disappear and return like nothing happened?",
    "Who is most likely to break the system?",
    "Who is most likely to create a crazy plan?",
    "Who is most likely to say BRO WHAT?",
    "Who is most likely to find a secret?",
    "Who is most likely to win a chaos battle?"
  ];

  const question =
    questions[Math.floor(Math.random() * questions.length)];

  const names = Object.values(crew).map(member => member.name);

  const winner =
    names[Math.floor(Math.random() * names.length)];

  const output = $("gameOutput");

  if (!output) return;

  output.innerHTML = `
    <strong>MOST LIKELY?</strong><br><br>
    ${question}<br><br>
    👀 ${winner}
  `;

  gameScore += 20;
  addChaos(2);
  saveStats();
  updateDashboard();
}


/* =========================================================
   GAME: NAME SCRAMBLE
   ========================================================= */

function scrambleGame() {
  const names = Object.values(crew);

  const member =
    names[Math.floor(Math.random() * names.length)];

  const shuffled =
    member.name
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

  const output = $("gameOutput");

  if (!output) return;

  output.innerHTML = `
    <strong>NAME SCRAMBLE</strong><br><br>
    DECODE THIS:<br><br>
    <span style="font-size:28px">${shuffled}</span>
    <br><br>
    Answer appears in 3 seconds...
  `;

  setTimeout(() => {
    output.innerHTML += `
      <br><br>
      ANSWER: <strong>${member.name}</strong>
    `;

    gameScore += 30;
    addChaos(2);
    saveStats();
    updateDashboard();
  }, 3000);
}


/* =========================================================
   GAME: REACTION WAR
   ========================================================= */

function reactionGame() {
  const output = $("gameOutput");

  if (!output) return;

  output.innerHTML = `
    <strong>REACTION WAR</strong><br><br>
    WAIT...<br>
    CLICK WHEN THE SIGNAL APPEARS.
  `;

  const delay = Math.floor(Math.random() * 2500) + 1000;

  setTimeout(() => {
    output.innerHTML = `
      <button class="btn" onclick="reactionWin()">
        ⚡ CLICK NOW ⚡
      </button>
    `;
  }, delay);
}

function reactionWin() {
  gameScore += 50;
  addChaos(3);

  const output = $("gameOutput");

  if (output) {
    output.innerHTML = `
      <strong>⚡ NICE REFLEXES!</strong><br><br>
      +50 SCORE
    `;
  }

  saveStats();
  updateDashboard();
}


/* =========================================================
   GAME: SECRET CODE
   ========================================================= */

function secretCode() {
  const code =
    Math.floor(1000 + Math.random() * 9000);

  const output = $("gameOutput");

  if (!output) return;

  output.innerHTML = `
    <strong>SECRET CODE</strong><br><br>
    SYSTEM GENERATED CODE:<br><br>
    <span style="font-size:35px;letter-spacing:8px">
      ${code}
    </span>
    <br><br>
    Remember it. The system will test you.
  `;

  setTimeout(() => {
    const answer = prompt("ENTER THE SECRET CODE:");

    if (answer === String(code)) {
      gameScore += 100;
      addChaos(10);

      output.innerHTML += `
        <br><br>
        ACCESS GRANTED 🔓<br>
        +100 SCORE
      `;
    } else {
      output.innerHTML += `
        <br><br>
        ACCESS DENIED ❌
      `;
    }

    saveStats();
    updateDashboard();
  }, 1500);
}


/* =========================================================
   BATTLE SYSTEM
   ========================================================= */

const battlePowers = {
  Deepika: [
    "Reality Override 👑",
    "Owner's Wrath ⚡",
    "Chaos Command"
  ],

  Yashika: [
    "Double Cross 🧨",
    "Chaos Partner",
    "Point Thief"
  ],

  Mariya: [
    "Mind Glitch 🦋",
    "Big Brain Mode",
    "Strategic Chaos"
  ],

  Bro: [
    "Bro Shield 🛠️",
    "Maximum Defense",
    "System Tank"
  ],

  Dora: [
    "Dora Roulette 🐻",
    "Wild Card",
    "Chaos Rain"
  ]
};

function startBattle() {
  const first = $("fighterOne");
  const second = $("fighterTwo");

  if (!first || !second) return;

  const one = first.value;
  const two = second.value;

  if (one === two) {
    toast("CHOOSE TWO DIFFERENT FIGHTERS 😂");
    return;
  }

  const oneName = $("fighterOneName");
  const twoName = $("fighterTwoName");
  const energyOne = $("energyOne");
  const energyTwo = $("energyTwo");
  const result = $("battleResult");

  if (oneName) oneName.textContent = one.toUpperCase();
  if (twoName) twoName.textContent = two.toUpperCase();

  if (energyOne) {
    energyOne.className = "energy-fill";
    energyOne.style.width = "100%";
  }

  if (energyTwo) {
    energyTwo.className = "energy-fill";
    energyTwo.style.width = "100%";
  }

  if (result) {
    result.textContent = "BATTLE STARTING...";
  }

  let rounds = 0;

  const interval = setInterval(() => {
    rounds++;

    const scoreOne = Math.floor(Math.random() * 100);
    const scoreTwo = Math.floor(Math.random() * 100);

    if (energyOne) {
      energyOne.style.width =
        `${Math.max(10, 100 - rounds * 18 - scoreTwo / 10)}%`;
    }

    if (energyTwo) {
      energyTwo.style.width =
        `${Math.max(10, 100 - rounds * 18 - scoreOne / 10)}%`;
    }

    if (rounds >= 5) {
      clearInterval(interval);

      finishBattle(one, two);
    }
  }, 600);
}

function finishBattle(one, two) {
  const firstScore = Math.floor(Math.random() * 101);
  const secondScore = Math.floor(Math.random() * 101);

  const winner =
    firstScore >= secondScore ? one : two;

  const loser =
    winner === one ? two : one;

  const result = $("battleResult");

  if (result) {
    result.innerHTML = `
      🏆 WINNER: <strong>${winner}</strong><br><br>
      ${winner}: ${Math.max(firstScore, secondScore)} points<br>
      ${loser}: ${Math.min(firstScore, secondScore)} points<br><br>
      ${getPower(winner)}
    `;
  }

  battles++;

  if (crew[one.toLowerCase()]) {
    crew[one.toLowerCase()].battles++;
  }

  if (crew[two.toLowerCase()]) {
    crew[two.toLowerCase()].battles++;
  }

  gameScore += 50;
  addChaos(5);

  saveStats();
  updateDashboard();

  toast(`${winner} WINS THE CHAOS ARENA ⚡`);
}

function getPower(name) {
  const powers = battlePowers[name] || ["Unknown Power"];

  return powers[Math.floor(Math.random() * powers.length)];
}


/* =========================================================
   CHALLENGE ARENA
   ========================================================= */

const challenges = [
  "Say the first word that comes to your mind.",
  "Name 3 things in 5 seconds.",
  "Create a funny superhero name.",
  "Describe Dora using exactly 3 words. 🐻",
  "Make up a completely fake movie title.",
  "Name a food without using the letter A.",
  "Create a new crew rule.",
  "Invent a secret code name for yourself.",
  "Say something that sounds like a system error.",
  "Create the most chaotic team slogan."
];

function generateChallenge() {
  const challengeText = $("challengeText");
  const timer = $("challengeTimer");

  if (!challengeText || !timer) return;

  clearInterval(challengeInterval);

  const challenge =
    challenges[Math.floor(Math.random() * challenges.length)];

  challengeText.textContent = challenge;

  let seconds = 10;

  timer.textContent = seconds;

  challengeInterval = setInterval(() => {
    seconds--;

    timer.textContent = seconds;

    if (seconds <= 0) {
      clearInterval(challengeInterval);

      timer.textContent = "TIME!";

      gameScore += 10;
      addChaos(2);

      saveStats();
      updateDashboard();

      toast("CHALLENGE COMPLETE ⚡");
    }
  }, 1000);
}


/* =========================================================
   VOICE / MICROPHONE PERMISSION
   ========================================================= */

async function requestMic() {
  const status = $("micStatus");

  if (!navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia) {

    if (status) {
      status.textContent =
        "MICROP
