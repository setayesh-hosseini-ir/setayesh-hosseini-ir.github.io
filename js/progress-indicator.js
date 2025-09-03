/**
 * Progress Indicator
 * Visualizes the user's progress through the experience
 */

// Pages in order
const pageOrder = [
  { id: 'index.html', title: 'شروع' },
  { id: 'journey.html', title: 'سفر تو' },
  { id: 'memories.html', title: 'خاطرات' },
  { id: 'future.html', title: 'آینده ما' },
  { id: 'connect.html', title: 'ارتباط' }
];

// Create progress indicator
function createProgressIndicator() {
  // Get progression state
  const progressionState = JSON.parse(localStorage.getItem('setayeshProgression')) || {
    completedPages: ['index.html'],
    currentPage: 'index.html'
  };

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const currentPageIndex = pageOrder.findIndex(p => p.id === currentPage);

  // Create indicator container
  const progressIndicator = document.createElement('div');
  progressIndicator.className = 'progress-indicator';

  // Add steps
  pageOrder.forEach((page, index) => {
    const step = document.createElement('div');
    step.className = 'progress-step';

    if (page.id === currentPage) {
      step.classList.add('active');
    }

    if (progressionState.completedPages.includes(page.id)) {
      step.classList.add('completed');
    }

    // Check if page is accessible based on the prerequisites
    const prerequisites = pageAccessRules[page.id] || [];
    const isAccessible = prerequisites.every(prerequisite =>
      progressionState.completedPages.includes(prerequisite));

    if (!isAccessible && page.id !== 'index.html' && page.id !== currentPage) {
      step.classList.add('locked');
    }

    const indicator = document.createElement('span');
    indicator.className = 'step-indicator';
    if (step.classList.contains('locked')) {
      indicator.textContent = '🔒';
    } else {
      indicator.textContent = index + 1;
    }

    const title = document.createElement('span');
    title.className = 'step-title';
    title.textContent = page.title;

    step.appendChild(indicator);
    step.appendChild(title);
    progressIndicator.appendChild(step);
  });

  document.body.appendChild(progressIndicator);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', createProgressIndicator);
