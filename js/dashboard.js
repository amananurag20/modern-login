/**
 * SecureBank Dashboard - JavaScript
 * Handles dashboard functionality and logout
 */

// ============================================
// DOM Elements
// ============================================
const logoutBtn = document.getElementById('logoutBtn');
const currentDateEl = document.getElementById('currentDate');

// ============================================
// Utility Functions
// ============================================

/**
 * Formats the current date
 * @returns {string} Formatted date string
 */
function formatDate() {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Date().toLocaleDateString('en-US', options);
}

/**
 * Handles logout functionality
 */
function handleLogout() {
    // Clear any stored session data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('savedUserId');

    // Redirect to login page
    window.location.href = 'index.html';
}

/**
 * Checks if user is logged in
 */
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        // Redirect to login if not authenticated
        window.location.href = 'index.html';
    }
}

// ============================================
// Event Listeners
// ============================================

// Logout button click
logoutBtn.addEventListener('click', handleLogout);

// ============================================
// Initialization
// ============================================

/**
 * Initialize the dashboard
 */
function init() {
    // Check authentication
    checkAuth();

    // Set current date
    if (currentDateEl) {
        currentDateEl.textContent = formatDate();
    }

    // Add animation to cards on load
    const cards = document.querySelectorAll('.stat-card, .card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', init);
