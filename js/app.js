/**
 * Fourth Wall Breaking Interactive Experience
 * A personalized journey for Setayesh - Multi-page version
 */

// DOM Elements
const header = document.querySelector('.header');
const dynamicHeader = document.getElementById('dynamic-header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-menu a');
const greetingText = document.getElementById('greeting-text');
const thoughtBubble = document.getElementById('thought-bubble');
const curiousButton = document.getElementById('curious-button');
const skepticalButton = document.getElementById('skeptical-button');
const revealMoreButton = document.getElementById('reveal-more');
const revealContent = document.getElementById('reveal-content');
const memoryCards = document.querySelectorAll('.memory-card');
const reactionButtons = document.querySelectorAll('.reaction-btn');
const reactionResponse = document.getElementById('reaction-response');
const conversationSelect = document.getElementById('conversation-topics');
const conversationResponse = document.getElementById('conversation-response');
const growthButtons = document.querySelectorAll('.growth-btn');
const growthResponse = document.getElementById('growth-response');
const notYetBtn = document.getElementById('not-yet-btn');
const revealer = document.getElementById('revealer');
const phoneNumber = document.getElementById('phone-number');
const emailAddress = document.getElementById('email-address');
const yesConnect = document.getElementById('yes-connect');
const maybeLater = document.getElementById('maybe-later');
const finalMessage = document.getElementById('final-message');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const showEasterEgg = document.getElementById('show-easter-egg');
const resetExperience = document.getElementById('reset-experience');
const hiddenMessage = document.getElementById('hidden-message');
const currentDate = document.getElementById('current-date');

// Store user data
let userData = JSON.parse(localStorage.getItem('setayeshData')) || {
  visits: 0,
  lastVisit: null,
  reactions: [],
  choices: {},
  darkMode: false
};

// Update visit count
updateUserData();

// Set current date in footer
if (currentDate) {
  const now = new Date();
  currentDate.textContent = now.toLocaleDateString();
}

// Dynamic greeting based on visit count
function updateGreeting() {
  if (!greetingText) return;

  if (userData.visits > 1) {
    const timeSince = getTimeSinceLastVisit();
    greetingText.innerHTML = `وای برگشتی ستایش! ${timeSince} از آخرین باری که اینجا بودی گذشته. منتظر بودم که دوباره با هم حرف بزنیم.`;

    // Update thought bubble too
    if (thoughtBubble) {
      thoughtBubble.textContent = "چه خوب که برگشتی...";
    }

    // Update header too
    if (dynamicHeader) {
      dynamicHeader.textContent = "خوش اومدی ستایش جان";
    }
  }
}

// Calculate time since last visit
function getTimeSinceLastVisit() {
  if (!userData.lastVisit) return "مدتی";

  const now = new Date();
  const last = new Date(userData.lastVisit);
  const diffTime = Math.abs(now - last);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (diffDays > 0) {
    return diffDays === 1 ? "1 روز" : `${diffDays} روز`;
  } else {
    return diffHours === 1 ? "1 ساعت" : `${diffHours} ساعت`;
  }
}

// Update user data
function updateUserData() {
  userData.visits += 1;
  userData.lastVisit = new Date().toISOString();
  localStorage.setItem('setayeshData', JSON.stringify(userData));

  // Apply saved preferences
  if (userData.darkMode) {
    document.body.classList.add('dark-mode');
  }

  updateGreeting();
  updateNavigationState();
  initializePageElements();
}

// Initialize page-specific elements
function initializePageElements() {
  // Initialize only elements that exist on current page
  const pageName = window.location.pathname.split('/').pop() || 'index.html';

  // Track progress through the experience
  if (!userData.progress) {
    userData.progress = { currentPage: pageName, completedPages: [] };
  }

  // Add current page to completed pages if not already there
  if (!userData.progress.completedPages.includes(pageName)) {
    userData.progress.completedPages.push(pageName);
  }

  // Update current page in progress
  userData.progress.currentPage = pageName;
  localStorage.setItem('setayeshData', JSON.stringify(userData));
}

// Handle Sticky Header
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.style.padding = '15px 0';
    header.style.backgroundColor = userData.darkMode ? 'rgba(45, 52, 54, 0.98)' : 'rgba(255, 255, 255, 0.98)';
    header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.padding = '20px 0';
    header.style.backgroundColor = userData.darkMode ? 'rgba(45, 52, 54, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
  }
});

// Mobile Menu Toggle
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navbar.classList.toggle('active');
  });
}

// Close mobile menu when clicking nav links
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuBtn.classList.remove('active');
    navbar.classList.remove('active');
  });
});

// Active Link on Scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (scrollY >= (sectionTop - 300)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
});

// Page navigation tracking
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Record page visits in user data
if (!userData.pageVisits) {
  userData.pageVisits = {};
}

// Mark current page as visited
userData.pageVisits[currentPage] = true;
localStorage.setItem('setayeshData', JSON.stringify(userData));

// Update navigation based on visit history
function updateNavigationState() {
  const navLinks = document.querySelectorAll('.nav-menu a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Add visited class to links for pages user has seen
    if (userData.pageVisits && userData.pageVisits[href]) {
      link.classList.add('visited');
    }
  });
}

// Interactive Hero Section - only on index page
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
  if (curiousButton && skepticalButton && thoughtBubble) {
    curiousButton.addEventListener('mouseenter', () => {
      thoughtBubble.textContent = "می‌دونستم کنجکاو می‌شی...";
    });

    skepticalButton.addEventListener('mouseenter', () => {
      thoughtBubble.textContent = "اشکالی نداره که شک داری. من هم همینطور بودم.";
    });

    curiousButton.addEventListener('mouseleave', () => {
      thoughtBubble.textContent = "می‌خواستم یک چیزی بهت بگم...";
    });

    skepticalButton.addEventListener('mouseleave', () => {
      thoughtBubble.textContent = "می‌خواستم یک چیزی بهت بگم...";
    });
  }
}

// Reveal More Button
if (revealMoreButton && revealContent) {
  revealMoreButton.addEventListener('click', () => {
    if (revealContent.classList.contains('hidden')) {
      revealContent.classList.remove('hidden');
      revealMoreButton.textContent = 'نمایش کمتر';

      // Record this interaction
      userData.choices.revealedMore = true;
      localStorage.setItem('setayeshData', JSON.stringify(userData));
    } else {
      revealContent.classList.add('hidden');
      revealMoreButton.textContent = 'این کیه؟';
    }
  });
}

// Memory Cards Flip Effect
if (memoryCards.length) {
  memoryCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');

      // Record which memories were viewed
      const memoryId = card.id;
      if (!userData.choices.viewedMemories) {
        userData.choices.viewedMemories = [];
      }

      if (!userData.choices.viewedMemories.includes(memoryId)) {
        userData.choices.viewedMemories.push(memoryId);
        localStorage.setItem('setayeshData', JSON.stringify(userData));
      }
    });
  });
}

// Reaction Buttons
if (reactionButtons.length && reactionResponse) {
  const reactionResponses = {
    'reaction-intrigued': "خوشحالم که برات جالبه! کلی وقت گذاشتم تا یه چیز خاص فقط واسه تو درست کنم.",
    'reaction-confused': "می‌فهمم که شاید یکم غیرمنتظره باشه. راحت باش و با خیال راحت همه جاشو ببین - امیدوارم هرچی جلوتر میری بیشتر برات جا بیفته.",
    'reaction-concerned': "به نظرت کاملاً احترام میذارم. می‌دونم که غیرعادیه. ولی باور کن با نیت خوب و از روی احترام زیاد به تو ساختمش."
  };

  reactionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const reactionType = button.id;
      reactionResponse.textContent = reactionResponses[reactionType];
      reactionResponse.classList.add('active');

      // Record the reaction
      userData.reactions.push(reactionType);
      localStorage.setItem('setayeshData', JSON.stringify(userData));

      // Highlight selected button
      reactionButtons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
    });
  });
}

// Conversation Topics
if (conversationSelect && conversationResponse) {
  const conversationResponses = {
    'books': "همیشه تصور می‌کردم با هم درباره کتابای مورد علاقه‌ات حرف می‌زنیم. جوری که چشمات وقتی از داستانایی که دوست داری حرف می‌زنی برق می‌زنن... دوست دارم بدونم کدوم شخصیت‌ها بیشتر تو ذهنت موندن.",
    'travel': "ژاپن، درسته؟ یادمه گفتی می‌خوای شکوفه‌های گیلاس رو ببینی. دوست دارم بدونم چه جاهای دیگه‌ای دوست داری بری و چرا اینقدر برات جذابن.",
    'philosophy': "سؤالای بزرگ درباره اینکه ما کی هستیم و چرا اینجاییم... خیلی کنجکاوم بدونم دیدگاهت درباره این سفر که بهش می‌گیم زندگی چیه. چی بهت انگیزه می‌ده و به زندگیت معنا می‌بخشه؟",
    'dreams': "همه یه سری رویاهای خاص دارن که تو قلبشون نگه می‌دارن. دوست دارم از رویاهات بشنوم - همونایی که وقتی فکر می‌کنی کسی حواسش نیست، باعث می‌شن لبخند بزنی."
  };

  conversationSelect.addEventListener('change', () => {
    const selectedTopic = conversationSelect.value;
    if (selectedTopic) {
      conversationResponse.textContent = conversationResponses[selectedTopic];
      conversationResponse.classList.add('active');

      // Record the choice
      userData.choices.conversationTopic = selectedTopic;
      localStorage.setItem('setayeshData', JSON.stringify(userData));
    } else {
      conversationResponse.classList.remove('active');
    }
  });
}

// Growth Buttons
if (growthButtons.length && growthResponse) {
  const growthResponses = {
    'challenges': "روشی که با چالش‌ها روبرو می‌شی خیلی در موردت بهم می‌گه. چالش‌ها به ما شکل می‌دن، مگه نه؟ خیلی تحسینت می‌کنم که از سختی‌ها فرار نمی‌کنی.",
    'learning': "کنجکاویت یکی از قشنگ‌ترین ویژگی‌هاته. اینکه همیشه می‌خوای بیشتر بدونی و دنیای اطرافت رو بهتر بشناسی.",
    'connection': "تو ارتباط با آدمای دیگه‌ست که معمولاً بیشترین رشد رو تجربه می‌کنیم. اینکه چقدر برای روابط معنی‌دار ارزش قائلی، خیلی چیزا درموردت می‌گه."
  };

  growthButtons.forEach(button => {
    button.addEventListener('click', () => {
      const growthType = button.getAttribute('data-growth');
      growthResponse.textContent = growthResponses[growthType];
      growthResponse.classList.add('active');

      // Record the choice
      userData.choices.growthValue = growthType;
      localStorage.setItem('setayeshData', JSON.stringify(userData));

      // Highlight selected button
      growthButtons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
    });
  });
}

// Not Yet Button
if (notYetBtn) {
  notYetBtn.addEventListener('click', () => {
    alert("اشکالی نداره ستایش جان. هر وقت خواستی برگرد. من اینجا منتظرتم :)");
  });
}

// Revealer (Name)
if (revealer) {
  revealer.addEventListener('click', () => {
    revealer.style.textDecoration = 'none';
    revealer.style.color = 'var(--primary-dark)';
    revealer.style.fontWeight = '700';
  });
}

// Contact Information Reveal - only on connect page
if (window.location.pathname.includes('connect.html')) {
  if (phoneNumber) {
    phoneNumber.addEventListener('click', () => {
      phoneNumber.textContent = '۰۹۱۲۳۴۵۶۷۸۹'; // Persian format number
    });
  }

  if (emailAddress) {
    emailAddress.addEventListener('click', () => {
      emailAddress.textContent = 'mohammad@example.com'; // Replace with actual email
    });
  }
}

// Final Buttons
if (yesConnect && maybeLater && finalMessage) {
  yesConnect.addEventListener('click', () => {
    finalMessage.classList.remove('hidden');
    // Record the choice
    userData.choices.finalDecision = 'connect';
    localStorage.setItem('emmaData', JSON.stringify(userData));
  });

  maybeLater.addEventListener('click', () => {
    finalMessage.classList.remove('hidden');
    // Record the choice
    userData.choices.finalDecision = 'maybe';
    localStorage.setItem('emmaData', JSON.stringify(userData));
  });
}

// Dark Mode Toggle
if (darkModeToggle) {
  darkModeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.toggle('dark-mode');
    userData.darkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('emmaData', JSON.stringify(userData));
  });
}

// Easter Egg
if (showEasterEgg && hiddenMessage) {
  showEasterEgg.addEventListener('click', (e) => {
    e.preventDefault();
    hiddenMessage.classList.add('visible');
    setTimeout(() => {
      hiddenMessage.classList.remove('visible');
    }, 5000);
  });
}

// Reset Experience
if (resetExperience) {
  resetExperience.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to reset your experience? This will clear all your interactions with this website.')) {
      localStorage.removeItem('emmaData');
      window.location.reload();
    }
  });
}

// Create placeholder images if they don't exist yet
function handleMissingImages() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      // Set a default placeholder image if the image fails to load
      if (this.src.includes('hero-illustration.svg')) {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2Yzc1N2QiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkEgc3BlY2lhbCBtZXNzYWdlIGZvciB5b3UuLi48L3RleHQ+PC9zdmc+';
      } else if (this.src.includes('about-illustration.svg')) {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2Yzc1N2QiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk1lbW9yaWVzIHdlIGNvdWxkIHNoYXJlLi4uPC90ZXh0Pjwvc3ZnPg==';
      } else if (this.src.includes('testimonial')) {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjlmYSIgcng9IjUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+RTwvdGV4dD48L3N2Zz4=';
      }
    });
  });
}

// Restore previous selections if they exist
function restorePreviousState() {
  // Restore conversation topic
  if (userData.choices.conversationTopic && conversationSelect) {
    conversationSelect.value = userData.choices.conversationTopic;
    const event = new Event('change');
    conversationSelect.dispatchEvent(event);
  }

  // Restore revealed content
  if (userData.choices.revealedMore && revealMoreButton && revealContent) {
    revealContent.classList.remove('hidden');
    revealMoreButton.textContent = 'Show Less';
  }

  // Restore memory card states
  if (userData.choices.viewedMemories && memoryCards.length) {
    userData.choices.viewedMemories.forEach(memoryId => {
      const card = document.getElementById(memoryId);
      if (card) card.classList.add('flipped');
    });
  }

  // Restore reaction
  if (userData.reactions.length > 0 && reactionButtons.length) {
    const lastReaction = userData.reactions[userData.reactions.length - 1];
    const button = document.getElementById(lastReaction);
    if (button) {
      button.classList.add('selected');
      const event = new Event('click');
      button.dispatchEvent(event);
    }
  }

  // Restore growth value
  if (userData.choices.growthValue && growthButtons.length) {
    const button = document.querySelector(`.growth-btn[data-growth="${userData.choices.growthValue}"]`);
    if (button) {
      button.classList.add('selected');
      const event = new Event('click');
      button.dispatchEvent(event);
    }
  }

  // Restore final decision
  if (userData.choices.finalDecision && finalMessage) {
    finalMessage.classList.remove('hidden');
  }
}

// Call initialization functions when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  handleMissingImages();
  restorePreviousState();

  // Initialize AOS (Animate On Scroll) if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }
});
