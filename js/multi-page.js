/**
 * Multi-Page Progression System
 * Controls access to pages based on user interaction
 */

// Progression state management
let progressionState = JSON.parse(localStorage.getItem('setayeshProgression')) || {
  completedPages: ['index.html'],
  currentPage: 'index.html',
  lastInteraction: Date.now()
};

// Get current page name
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Page access rules - define which pages require which previous pages to be completed
const pageAccessRules = {
  'index.html': [],  // No prerequisites
  'journey.html': ['index.html'],
  'memories.html': ['journey.html'],
  'future.html': ['memories.html'],
  'connect.html': ['future.html']
};

// On page load, check if user should have access
function checkAccess() {
  // Always allow index.html
  if (currentPage === 'index.html') return true;

  // Check prerequisites
  const prerequisites = pageAccessRules[currentPage] || [];
  const hasAccess = prerequisites.every(page => progressionState.completedPages.includes(page));

  if (!hasAccess) {
    // Redirect to appropriate page
    const lastCompletedPageIndex = Math.max(
      ...prerequisites.map(page => progressionState.completedPages.includes(page) ?
        progressionState.completedPages.indexOf(page) : -1)
    );

    const nextPage = lastCompletedPageIndex >= 0 && lastCompletedPageIndex < progressionState.completedPages.length - 1 ?
      progressionState.completedPages[lastCompletedPageIndex + 1] : 'index.html';

    window.location.href = nextPage;
    return false;
  }

  return true;
}

// Unlock the next page
function unlockNextPage(nextPage) {
  if (!progressionState.completedPages.includes(currentPage)) {
    progressionState.completedPages.push(currentPage);
  }

  progressionState.currentPage = nextPage;
  progressionState.lastInteraction = Date.now();

  localStorage.setItem('setayeshProgression', JSON.stringify(progressionState));
}

// Set up interaction handlers based on current page
function setupInteractions() {
  // Index page - unlock journey on button click
  if (currentPage === 'index.html') {
    const curiousButton = document.getElementById('curious-button');
    const skepticalButton = document.getElementById('skeptical-button');
    const lockedLinks = document.querySelectorAll('.locked-link');

    // Update the locked links status based on current progression
    lockedLinks.forEach(link => {
      const pageName = link.getAttribute('href');
      if (progressionState.completedPages.includes(pageName)) {
        link.classList.remove('locked-link');
        link.style.cursor = 'pointer';
      } else {
        // Prevent navigation to locked pages
        link.addEventListener('click', (e) => {
          e.preventDefault();
          alert('هی! این صفحه هنوز قفله. اول باید مراحل قبلی رو تموم کنی، باشه؟ 😉');
        });
      }
    });

    if (curiousButton) {
      curiousButton.addEventListener('click', () => {
        unlockNextPage('journey.html');
      });
    }

    if (skepticalButton) {
      skepticalButton.addEventListener('click', (e) => {
        e.preventDefault();
        alert('صبر کن! میدونم کنجکاوی، ولی اول باید سفرمون رو شروع کنیم. روی دکمه «کنجکاوم...» کلیک کن تا بریم ماجراجویی! 🚀');
      });
    }

    // Reset experience button
    const resetButton = document.getElementById('reset-experience');
    if (resetButton) {
      resetButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('مطمئنی می‌خوای همه چی رو از اول شروع کنیم؟ همه پیشرفتت پاک میشه ها! 🤔')) {
          // Reset progression state
          localStorage.removeItem('setayeshProgression');
          // Reload page
          window.location.reload();
        }
      });
    }
  }

  // Journey page - unlock memories after reading
  else if (currentPage === 'journey.html') {
    const revealMoreButton = document.getElementById('reveal-more');
    const continueButton = document.querySelector('.navigation-buttons .btn-primary');

    if (revealMoreButton && continueButton) {
      // Only unlock after they've clicked the reveal button
      revealMoreButton.addEventListener('click', () => {
        continueButton.classList.add('unlocked');
        continueButton.addEventListener('click', (e) => {
          unlockNextPage('memories.html');
        });
      });

      // Initially disable the continue button
      continueButton.classList.add('disabled');
      continueButton.addEventListener('click', (e) => {
        if (!continueButton.classList.contains('unlocked')) {
          e.preventDefault();
          alert('اوه! یه چیز مهم رو جا انداختی! اول روی دکمه «این کیه؟» کلیک کن تا بفهمی داری با کی حرف میزنی! 😊');
        }
      });
    }
  }

  // Memories page - unlock future after memory card interaction
  else if (currentPage === 'memories.html') {
    const memoryCards = document.querySelectorAll('.memory-card');
    const reactionButtons = document.querySelectorAll('.reaction-btn');
    const continueButton = document.querySelector('.navigation-buttons .btn-primary');

    let hasFlippedCard = false;
    let hasSelectedReaction = false;

    if (memoryCards.length && reactionButtons.length && continueButton) {
      // Initially disable the continue button
      continueButton.classList.add('disabled');

      // Enable when user has flipped a card and selected a reaction
      memoryCards.forEach(card => {
        card.addEventListener('click', () => {
          hasFlippedCard = true;
          checkUnlock();
        });
      });

      reactionButtons.forEach(button => {
        button.addEventListener('click', () => {
          hasSelectedReaction = true;
          checkUnlock();
        });
      });

      function checkUnlock() {
        if (hasFlippedCard && hasSelectedReaction) {
          continueButton.classList.remove('disabled');
          continueButton.classList.add('unlocked');
          continueButton.addEventListener('click', () => {
            unlockNextPage('future.html');
          });
        }
      }

      // Prevent navigation if not unlocked
      continueButton.addEventListener('click', (e) => {
        if (!continueButton.classList.contains('unlocked')) {
          e.preventDefault();
          alert('صبر کن! هنوز دو تا کار داری - یه کارت خاطره رو بچرخون و بگو چه حسی داری. بعدش میتونیم بریم مرحله بعد! 🙂');
        }
      });
    }
  }

  // Future page - unlock connect after selecting options
  else if (currentPage === 'future.html') {
    const conversationSelect = document.getElementById('conversation-topics');
    const growthButtons = document.querySelectorAll('.growth-btn');
    const revealButtons = document.querySelector('.reveal-buttons');
    const continueButton = document.querySelector('.navigation-buttons .btn-primary');

    let hasSelectedTopic = false;
    let hasSelectedGrowth = false;

    if (conversationSelect && growthButtons.length && continueButton) {
      // Initially disable the continue button
      continueButton.classList.add('disabled');

      // Enable when user has made selections
      conversationSelect.addEventListener('change', () => {
        if (conversationSelect.value) {
          hasSelectedTopic = true;
          checkUnlock();
        }
      });

      growthButtons.forEach(button => {
        button.addEventListener('click', () => {
          hasSelectedGrowth = true;
          checkUnlock();
        });
      });

      function checkUnlock() {
        if (hasSelectedTopic && hasSelectedGrowth) {
          continueButton.classList.remove('disabled');
          continueButton.classList.add('unlocked');
          continueButton.addEventListener('click', () => {
            unlockNextPage('connect.html');
          });
        }
      }

      // Prevent navigation if not unlocked
      continueButton.addEventListener('click', (e) => {
        if (!continueButton.classList.contains('unlocked')) {
          e.preventDefault();
          alert('هی، دوست من! دوست دارم بدونم چه موضوعی برات جالبه و چی باعث رشدت میشه. لطفاً قبل از ادامه دادن انتخاب کن! ✨');
        }
      });
    }

    // Direct access to connect via "Yes, I'm ready" button
    if (revealButtons) {
      const readyButton = revealButtons.querySelector('.btn-primary');
      if (readyButton) {
        readyButton.addEventListener('click', () => {
          unlockNextPage('connect.html');
        });
      }
    }
  }

  // Connect page - final page
  else if (currentPage === 'connect.html') {
    const yesConnectBtn = document.getElementById('yes-connect');
    const maybeLaterBtn = document.getElementById('maybe-later');
    const finalMessage = document.getElementById('final-message');

    if (yesConnectBtn && maybeLaterBtn && finalMessage) {
      yesConnectBtn.addEventListener('click', () => {
        finalMessage.classList.remove('hidden');
        // Mark experience as complete
        progressionState.isComplete = true;
        localStorage.setItem('setayeshProgression', JSON.stringify(progressionState));
      });

      maybeLaterBtn.addEventListener('click', () => {
        finalMessage.classList.remove('hidden');
      });
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const hasAccess = checkAccess();
  if (hasAccess) {
    // Update current page in state
    progressionState.currentPage = currentPage;
    localStorage.setItem('setayeshProgression', JSON.stringify(progressionState));

    // Setup interactions
    setupInteractions();
  }
});
