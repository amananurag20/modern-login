/**
 * SecureBank Login Page - JavaScript
 * Handles form validation, authentication simulation, and UI interactions
 */

// ============================================
// DOM Elements
// ============================================
const loginForm = document.getElementById('loginForm');
const userIdInput = document.getElementById('userId');
const passwordInput = document.getElementById('password');
const userIdError = document.getElementById('userIdError');
const passwordError = document.getElementById('passwordError');
const signInBtn = document.getElementById('signInBtn');
const passwordToggle = document.getElementById('passwordToggle');
const messageContainer = document.getElementById('messageContainer');
const saveUserIdCheckbox = document.getElementById('saveUserId');

// ============================================
// Hardcoded Credentials (for simulation)
// ============================================
const VALID_CREDENTIALS = {
    userId: 'admin',
    password: '123456'
};

// ============================================
// Utility Functions
// ============================================

/**
 * Shows an error message for an input field
 * @param {HTMLElement} inputWrapper - The input wrapper element
 * @param {HTMLElement} errorElement - The error message element
 * @param {string} message - The error message to display
 */
function showError(inputWrapper, errorElement, message) {
    inputWrapper.classList.add('error');
    errorElement.textContent = message;
    errorElement.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        ${message}
    `;
}

/**
 * Clears the error state for an input field
 * @param {HTMLElement} inputWrapper - The input wrapper element
 * @param {HTMLElement} errorElement - The error message element
 */
function clearError(inputWrapper, errorElement) {
    inputWrapper.classList.remove('error');
    errorElement.textContent = '';
}

/**
 * Displays a message (success or error) in the message container
 * @param {string} message - The message to display
 * @param {string} type - The type of message ('success' or 'error')
 */
function showMessage(message, type) {
    messageContainer.classList.remove('hidden', 'success', 'error');
    messageContainer.classList.add(type);

    const icon = type === 'success'
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
               <polyline points="22,4 12,14.01 9,11.01"/>
           </svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <circle cx="12" cy="12" r="10"/>
               <line x1="15" y1="9" x2="9" y2="15"/>
               <line x1="9" y1="9" x2="15" y2="15"/>
           </svg>`;

    messageContainer.innerHTML = `${icon}<span>${message}</span>`;
}

/**
 * Hides the message container
 */
function hideMessage() {
    messageContainer.classList.add('hidden');
    messageContainer.classList.remove('success', 'error');
}

/**
 * Sets the loading state of the sign-in button
 * @param {boolean} isLoading - Whether the button should show loading state
 */
function setLoadingState(isLoading) {
    const btnText = signInBtn.querySelector('.btn-text');
    const btnLoader = signInBtn.querySelector('.btn-loader');

    if (isLoading) {
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
        signInBtn.disabled = true;
    } else {
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        signInBtn.disabled = false;
    }
}

/**
 * Validates a single field
 * @param {HTMLInputElement} input - The input element to validate
 * @returns {boolean} - Whether the field is valid
 */
function validateField(input) {
    const inputWrapper = input.closest('.input-wrapper');
    const errorElement = input.closest('.input-group').querySelector('.error-message');
    const value = input.value.trim();

    if (!value) {
        const fieldName = input.id === 'userId' ? 'User ID' : 'Password';
        showError(inputWrapper, errorElement, `${fieldName} is required`);
        return false;
    }

    if (input.id === 'userId' && value.length < 3) {
        showError(inputWrapper, errorElement, 'User ID must be at least 3 characters');
        return false;
    }

    if (input.id === 'password' && value.length < 6) {
        showError(inputWrapper, errorElement, 'Password must be at least 6 characters');
        return false;
    }

    clearError(inputWrapper, errorElement);
    return true;
}

/**
 * Validates the entire form
 * @returns {boolean} - Whether the form is valid
 */
function validateForm() {
    const isUserIdValid = validateField(userIdInput);
    const isPasswordValid = validateField(passwordInput);
    return isUserIdValid && isPasswordValid;
}

/**
 * Simulates authentication
 * @param {string} userId - The user ID
 * @param {string} password - The password
 * @returns {Promise<object>} - The authentication result
 */
function simulateAuthentication(userId, password) {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            if (userId === VALID_CREDENTIALS.userId && password === VALID_CREDENTIALS.password) {
                resolve({
                    success: true,
                    message: 'Login successful! Redirecting to your dashboard...'
                });
            } else {
                resolve({
                    success: false,
                    message: 'Invalid User ID or Password. Please try again.'
                });
            }
        }, 1500);
    });
}

// ============================================
// Event Listeners
// ============================================

// Password visibility toggle
passwordToggle.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;

    const eyeIcon = passwordToggle.querySelector('.eye-icon');
    const eyeOffIcon = passwordToggle.querySelector('.eye-off-icon');

    eyeIcon.classList.toggle('hidden');
    eyeOffIcon.classList.toggle('hidden');
});

// Real-time validation on blur
userIdInput.addEventListener('blur', () => validateField(userIdInput));
passwordInput.addEventListener('blur', () => validateField(passwordInput));

// Clear errors on input
userIdInput.addEventListener('input', () => {
    const inputWrapper = userIdInput.closest('.input-wrapper');
    const errorElement = document.getElementById('userIdError');
    clearError(inputWrapper, errorElement);
    hideMessage();
});

passwordInput.addEventListener('input', () => {
    const inputWrapper = passwordInput.closest('.input-wrapper');
    const errorElement = document.getElementById('passwordError');
    clearError(inputWrapper, errorElement);
    hideMessage();
});

// Form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage();

    // Validate form
    if (!validateForm()) {
        return;
    }

    // Set loading state
    setLoadingState(true);

    // Get form values
    const userId = userIdInput.value.trim();
    const password = passwordInput.value;

    try {
        // Simulate authentication
        const result = await simulateAuthentication(userId, password);

        if (result.success) {
            showMessage(result.message, 'success');

            // Save User ID if checkbox is checked
            if (saveUserIdCheckbox.checked) {
                localStorage.setItem('savedUserId', userId);
            } else {
                localStorage.removeItem('savedUserId');
            }

            // Simulate redirect after success
            setTimeout(() => {
                // In a real app, you would redirect to the dashboard
                // window.location.href = '/dashboard';
                console.log('Redirect to dashboard...');
            }, 2000);
        } else {
            showMessage(result.message, 'error');
            // Shake the form on error
            loginForm.style.animation = 'none';
            loginForm.offsetHeight; // Trigger reflow
            loginForm.style.animation = 'shake 0.5s ease';
        }
    } catch (error) {
        showMessage('An unexpected error occurred. Please try again.', 'error');
        console.error('Login error:', error);
    } finally {
        setLoadingState(false);
    }
});

// ============================================
// Initialization
// ============================================

/**
 * Initialize the login page
 */
function init() {
    // Load saved User ID if exists
    const savedUserId = localStorage.getItem('savedUserId');
    if (savedUserId) {
        userIdInput.value = savedUserId;
        saveUserIdCheckbox.checked = true;
    }

    // Add shake animation keyframes dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(styleSheet);

    // Focus on User ID input if empty
    if (!userIdInput.value) {
        userIdInput.focus();
    }
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', init);
