// DOM Elements
const logoutBtn = document.getElementById('logoutBtn');
const currentDateEl = document.getElementById('currentDate');

// Format current date to readable string
function formatDate() {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Date().toLocaleDateString('en-US', options);
}

// Handle logout - clear session and redirect
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('savedUserId');
    window.location.href = 'index.html';
}

// Check if user is authenticated
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'index.html';
    }
}

// Logout button click handler
logoutBtn.addEventListener('click', handleLogout);

// Initialize dashboard on page load
function init() {
    // Check if user is logged in
    checkAuth();

    // Display current date
    if (currentDateEl) {
        currentDateEl.textContent = formatDate();
    }

    // Animate cards on load
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

document.addEventListener('DOMContentLoaded', init);
