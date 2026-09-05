// app.js - Teacher's Day Celebration Application

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initCountdown();
  initStickyNotes();
  initQuotes();
  initAudioSynthesizer();
  initPetalsCanvas();
  initConfettiTriggers();
});

/* ==========================================================================
   1. COUNTDOWN TO MONDAY CELEBRATION (September 7, 2026)
   ========================================================================== */
function initCountdown() {
  const timerDisplay = document.getElementById('countdownTimer');
  if (!timerDisplay) return;

  // Target: Monday, September 7, 2026, 09:00:00 AM
  const targetDate = new Date('2026-09-07T09:00:00+05:30').getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      timerDisplay.innerHTML = "🎉 Today is Celebration Day!";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    timerDisplay.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   2. TEACHERS CELEBRATION PHOTO & LIGHTBOX
   ========================================================================== */
let celebrationPhoto = {
  title: "The Floral Swing Celebration",
  caption: "Our teachers sharing laughter and pride on the marigold-garland swing during our festive gathering.",
  src: "assets/teachers_celebration_swing.jpg",
  likes: 148
};

window.likePhoto = function() {
  celebrationPhoto.likes += 1;
  const countEl = document.getElementById('spotlightLikeCount');
  if (countEl) countEl.innerText = celebrationPhoto.likes;

  const btn = event?.currentTarget;
  if (btn) {
    btn.classList.add('pulse-active');
    setTimeout(() => btn.classList.remove('pulse-active'), 400);
  }

  playChime(659.25); // E5 note
  showMiniConfetti();
};

window.openLightbox = function() {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const title = document.getElementById('lightboxTitle');
  const caption = document.getElementById('lightboxCaption');

  if (img) img.src = celebrationPhoto.src;
  if (title) title.innerText = celebrationPhoto.title;
  if (caption) caption.innerText = celebrationPhoto.caption;

  if (modal) {
    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
      modal.classList.add('active');
    });
    document.body.style.overflow = 'hidden';
  }
};

window.closeLightbox = function() {
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 250);
  }
};

// Keyboard controls for lightbox
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('lightboxModal');
  if (!modal || modal.classList.contains('hidden')) return;
  if (e.key === 'Escape') closeLightbox();
});

/* ==========================================================================
   4. INTERACTIVE PASTEL STICKY NOTES BOARD
   ========================================================================== */
const defaultNotes = [
  {
    id: 1,
    recipient: "All Our Wonderful Teachers",
    message: "Thank you for answering every silly doubt with a warm smile and making school feel like a second home! Happy Teacher's Day! 🌸",
    color: "yellow",
    tilt: "-2deg",
    likes: 42
  },
  {
    id: 2,
    recipient: "Mrs. Susan & Science Faculty",
    message: "I am pursuing my engineering degree today only because you taught me not to be afraid of equations. Eternal gratitude to you!",
    color: "rose",
    tilt: "1.5deg",
    likes: 38
  },
  {
    id: 3,
    recipient: "Our Math Teachers",
    message: "Who knew calculus could be fun? Thank you for the patience of saints and the warmth of true guides!",
    color: "sage",
    tilt: "-1.8deg",
    likes: 29
  },
  {
    id: 4,
    recipient: "Principal & Staff",
    message: "Wishing you a joyful Teacher's Day celebration on Monday! Your lessons in integrity and kindness echo throughout our lives.",
    color: "lavender",
    tilt: "2.2deg",
    likes: 54
  },
  {
    id: 5,
    recipient: "Language Teachers",
    message: "Thank you for teaching us how words can heal, inspire, and change someone's world. We cherish you!",
    color: "peach",
    tilt: "-1deg",
    likes: 21
  }
];

let activeSelectedColor = 'yellow';

function initStickyNotes() {
  const saved = localStorage.getItem('teachers_day_sticky_notes');
  let notes;

  if (saved) {
    const parsed = JSON.parse(saved);
    // Migrate: clear old notes that have the 'author' field (outdated format)
    if (parsed.length > 0 && parsed[0].hasOwnProperty('author')) {
      localStorage.removeItem('teachers_day_sticky_notes');
      notes = defaultNotes;
    } else {
      notes = parsed;
    }
  } else {
    notes = defaultNotes;
  }

  renderStickyNotes(notes);
  setupStickyNoteForm(notes);
}

function renderStickyNotes(notes) {
  const grid = document.getElementById('stickyNotesGrid');
  if (!grid) return;

  grid.innerHTML = notes.map((note) => `
    <div class="sticky-note note-${note.color} rounded-2xl p-5 shadow-pin text-stone-800 flex flex-col justify-between min-h-[220px]" style="transform: rotate(${note.tilt});">
      <!-- Pushpin -->
      <div class="sticky-pin"></div>

      <div>
        <div class="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2 border-b border-stone-900/10 pb-1.5 flex items-center justify-between">
          <span class="truncate">To: ${escapeHtml(note.recipient)}</span>
          <span>📌</span>
        </div>
        <p class="font-handwriting text-xl sm:text-2xl text-stone-900 leading-snug my-2">
          "${escapeHtml(note.message)}"
        </p>
      </div>

      <div class="pt-3 border-t border-stone-900/10 flex items-center justify-end mt-auto">
        <button onclick="likeStickyNote(${note.id})" class="flex items-center gap-1 text-xs text-rose-700 bg-white/60 hover:bg-white px-2 py-0.5 rounded-full border border-stone-300 transition-colors">
          <i data-lucide="heart" class="w-3 h-3 fill-rose-500 text-rose-500"></i>
          <span id="note-likes-${note.id}">${note.likes || 0}</span>
        </button>
      </div>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();

  // Update stat badge
  const statEl = document.getElementById('statNotesCount');
  if (statEl) statEl.innerText = notes.length;
}

function setupStickyNoteForm(notes) {
  const form = document.getElementById('noteForm');
  const messageInput = document.getElementById('noteMessage');
  const charCount = document.getElementById('charCount');
  const colorBtns = document.querySelectorAll('.color-choice');

  // Character Counter
  if (messageInput && charCount) {
    messageInput.addEventListener('input', () => {
      charCount.innerText = `${messageInput.value.length}/280`;
    });
  }

  // Color picker selection
  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => {
        b.classList.remove('ring-2', 'ring-gold-400', 'scale-110');
      });
      btn.classList.add('ring-2', 'ring-gold-400', 'scale-110');
      activeSelectedColor = btn.dataset.color;
    });
  });

  // Submit Handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const recipient = document.getElementById('noteRecipient').value.trim();
      const author = document.getElementById('noteAuthor').value.trim();
      const message = messageInput.value.trim();

      if (!recipient || !author || !message) return;

      // Random natural tilt between -2.8deg and +2.8deg
      const randomTilt = ((Math.random() * 5.6) - 2.8).toFixed(1) + 'deg';

      const newNote = {
        id: Date.now(),
        recipient,
        author,
        message,
        color: activeSelectedColor,
        tilt: randomTilt,
        likes: 1
      };

      notes.unshift(newNote);
      localStorage.setItem('teachers_day_sticky_notes', JSON.stringify(notes));
      renderStickyNotes(notes);

      // Reset form
      form.reset();
      if (charCount) charCount.innerText = '0/280';

      playChime(523.25); // C5 chord chime
      showConfettiBurst();

      // Scroll to notes grid
      document.getElementById('stickyNotesGrid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}

window.likeStickyNote = function(id) {
  const saved = localStorage.getItem('teachers_day_sticky_notes');
  let notes = saved ? JSON.parse(saved) : defaultNotes;
  const target = notes.find(n => n.id === id);
  if (target) {
    target.likes = (target.likes || 0) + 1;
    localStorage.setItem('teachers_day_sticky_notes', JSON.stringify(notes));
    const countEl = document.getElementById(`note-likes-${id}`);
    if (countEl) countEl.innerText = target.likes;
    playChime(698.46); // F5
    showMiniConfetti();
  }
};


/* ==========================================================================
   5. WORDS OF WISDOM (Inspiring Quotes Generator)
   ========================================================================== */
const wisdomQuotes = [
  {
    quote: "A good teacher can inspire hope, ignite the imagination, and instill a love of learning.",
    author: "Brad Henry"
  },
  {
    quote: "Teaching is a very noble profession that shapes the character, caliber, and future of an individual.",
    author: "Dr. A. P. J. Abdul Kalam"
  },
  {
    quote: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela"
  },
  {
    quote: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.",
    author: "Maya Angelou"
  },
  {
    quote: "One child, one teacher, one book, one pen can change the world.",
    author: "Malala Yousafzai"
  },
  {
    quote: "The influence of a great teacher can never be erased.",
    author: "Ancient Proverb"
  }
];

let currentQuoteIndex = 0;

function initQuotes() {
  const quoteText = document.getElementById('quoteText');
  const quoteAuthor = document.getElementById('quoteAuthor');
  const nextBtn = document.getElementById('nextQuoteBtn');

  if (!nextBtn) return;

  nextBtn.addEventListener('click', () => {
    currentQuoteIndex = (currentQuoteIndex + 1) % wisdomQuotes.length;
    
    quoteText.classList.add('opacity-0');
    quoteAuthor.classList.add('opacity-0');

    setTimeout(() => {
      quoteText.innerText = `"${wisdomQuotes[currentQuoteIndex].quote}"`;
      quoteAuthor.innerText = `— ${wisdomQuotes[currentQuoteIndex].author}`;
      quoteText.classList.remove('opacity-0');
      quoteAuthor.classList.remove('opacity-0');
    }, 200);

    playChime(659.25);
  });
}


/* ==========================================================================
   6. BACKGROUND MUSIC PLAYER (Real Audio File)
   ========================================================================== */
let isAudioPlaying = false;
let bgAudio = null;

// Lightweight UI chime using Web Audio API (for button clicks, note pins, etc.)
function playChime(freq = 523.25, type = 'sine', duration = 1.0) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
    setTimeout(() => ctx.close(), (duration + 0.2) * 1000);
  } catch (_) {}
}

function initAudioSynthesizer() {
  const toggleBtn = document.getElementById('audioToggleBtn');
  const icon = document.getElementById('audioIcon');
  const wave = document.getElementById('audioPlayingWave');

  if (!toggleBtn) return;

  // Create audio element with the real music file
  bgAudio = new Audio('assets/music.mp3');
  bgAudio.loop = true;
  bgAudio.volume = 0.45;

  // Fade in helper
  function fadeIn() {
    bgAudio.volume = 0;
    bgAudio.play().catch(() => {});
    let vol = 0;
    const step = setInterval(() => {
      vol = Math.min(vol + 0.04, 0.45);
      bgAudio.volume = vol;
      if (vol >= 0.45) clearInterval(step);
    }, 80);
  }

  // Fade out helper
  function fadeOut() {
    let vol = bgAudio.volume;
    const step = setInterval(() => {
      vol = Math.max(vol - 0.05, 0);
      bgAudio.volume = vol;
      if (vol <= 0) {
        bgAudio.pause();
        bgAudio.currentTime = 0;
        clearInterval(step);
      }
    }, 80);
  }

  toggleBtn.addEventListener('click', () => {
    isAudioPlaying = !isAudioPlaying;

    if (isAudioPlaying) {
      wave?.classList.remove('hidden');
      icon?.classList.add('text-amber-600');
      fadeIn();
    } else {
      wave?.classList.add('hidden');
      icon?.classList.remove('text-amber-600');
      fadeOut();
    }
  });
}


/* ==========================================================================
   7. FALLING MARIGOLD & SAKURA PETALS (Canvas Animation)
   ========================================================================== */
function initPetalsCanvas() {
  const canvas = document.getElementById('petalsCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const petalColors = [
    '#FBDD94', // Marigold Light
    '#F7C655', // Marigold Yellow
    '#F5D3D9', // Pastel Rose
    '#FAD2E1', // Sakura Pink
    '#FFF0F2'  // Cream Rose
  ];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 0.9 + 0.5;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 1.5;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.opacity = Math.random() * 0.5 + 0.3;
      this.oscillationSpeed = Math.random() * 0.02 + 0.01;
      this.oscillationAmp = Math.random() * 1.5 + 0.5;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * this.oscillationSpeed) * this.oscillationAmp + this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      // Draw rounded petal shape
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size, -this.size, this.size * 1.5, this.size, 0, this.size * 1.5);
      ctx.bezierCurveTo(-this.size * 1.5, this.size, -this.size, -this.size, 0, 0);
      ctx.fill();
      ctx.restore();
    }
  }

  // Create 35 calm floating petals
  for (let i = 0; i < 35; i++) {
    petals.push(new Petal());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();

  // Flower Shower Button
  const showerBtn = document.getElementById('flowerShowerBtn');
  if (showerBtn) {
    showerBtn.addEventListener('click', () => {
      for (let i = 0; i < 25; i++) {
        petals.push(new Petal());
      }
      playChime(659.25);
      showConfettiBurst();
    });
  }
}


/* ==========================================================================
   8. CONFETTI TRIGGERS
   ========================================================================== */
function initConfettiTriggers() {
  const confettiBtn = document.getElementById('confettiBtn');
  if (confettiBtn) {
    confettiBtn.addEventListener('click', () => {
      showConfettiBurst();
      playChime(783.99);
    });
  }
}

function showConfettiBurst() {
  if (typeof confetti !== 'function') return;

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.65 },
    colors: ['#F5C067', '#EE9CA7', '#94B08E', '#FFD166', '#F4A261']
  });
}

function showMiniConfetti() {
  if (typeof confetti !== 'function') return;

  confetti({
    particleCount: 25,
    spread: 45,
    origin: { y: 0.75 },
    colors: ['#F5C067', '#F5D3D9', '#94B08E']
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
