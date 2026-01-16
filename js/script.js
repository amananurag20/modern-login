// DOM Elements
const loginForm = document.getElementById('loginForm');
const userIdInput = document.getElementById('userId');
const passwordInput = document.getElementById('password');
const userIdError = document.getElementById('userIdError');
const passwordError = document.getElementById('passwordError');
const signInBtn = document.getElementById('signInBtn');
const passwordToggle = document.getElementById('passwordToggle');
const messageContainer = document.getElementById('messageContainer');
const saveUserIdCheckbox = document.getElementById('saveUserId');

// Valid credentials for login
const VALID_CREDENTIALS = {
    userId: 'admin',
    password: '123456'
};

// Show error message below input field
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

// Clear error state from input field
function clearError(inputWrapper, errorElement) {
    inputWrapper.classList.remove('error');
    errorElement.textContent = '';
}

// Display success or error message
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

// Hide the message container
function hideMessage() {
    messageContainer.classList.add('hidden');
    messageContainer.classList.remove('success', 'error');
}

// Toggle loading state on button
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

// Validate individual input field
function validateField(input) {
    const inputWrapper = input.closest('.input-wrapper');
    const errorElement = input.closest('.input-group').querySelector('.error-message');
    const value = input.value.trim();

    // Check if field is empty
    if (!value) {
        const fieldName = input.id === 'userId' ? 'User ID' : 'Password';
        showError(inputWrapper, errorElement, `${fieldName} is required`);
        return false;
    }

    // Check minimum length for User ID
    if (input.id === 'userId' && value.length < 3) {
        showError(inputWrapper, errorElement, 'User ID must be at least 3 characters');
        return false;
    }

    // Check minimum length for Password
    if (input.id === 'password' && value.length < 6) {
        showError(inputWrapper, errorElement, 'Password must be at least 6 characters');
        return false;
    }

    clearError(inputWrapper, errorElement);
    return true;
}

// Validate entire form
function validateForm() {
    const isUserIdValid = validateField(userIdInput);
    const isPasswordValid = validateField(passwordInput);
    return isUserIdValid && isPasswordValid;
}

// Simulate authentication with delay
function simulateAuthentication(userId, password) {
    return new Promise((resolve) => {
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

// Toggle password visibility
passwordToggle.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;

    const eyeIcon = passwordToggle.querySelector('.eye-icon');
    const eyeOffIcon = passwordToggle.querySelector('.eye-off-icon');

    eyeIcon.classList.toggle('hidden');
    eyeOffIcon.classList.toggle('hidden');
});

// Validate on blur (when user leaves the field)
userIdInput.addEventListener('blur', () => validateField(userIdInput));
passwordInput.addEventListener('blur', () => validateField(passwordInput));

// Clear errors when user starts typing
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

// Handle form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage();

    // Validate form before submitting
    if (!validateForm()) {
        return;
    }

    setLoadingState(true);

    const userId = userIdInput.value.trim();
    const password = passwordInput.value;

    try {
        const result = await simulateAuthentication(userId, password);

        if (result.success) {
            showMessage(result.message, 'success');

            // Save login state
            localStorage.setItem('isLoggedIn', 'true');

            // Save User ID if checkbox is checked
            if (saveUserIdCheckbox.checked) {
                localStorage.setItem('savedUserId', userId);
            } else {
                localStorage.removeItem('savedUserId');
            }

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showMessage(result.message, 'error');

            // Shake animation on error
            loginForm.style.animation = 'none';
            loginForm.offsetHeight;
            loginForm.style.animation = 'shake 0.5s ease';
        }
    } catch (error) {
        showMessage('An unexpected error occurred. Please try again.', 'error');
        console.error('Login error:', error);
    } finally {
        setLoadingState(false);
    }
});

// Initialize page on load
function init() {
    // Load saved User ID if exists
    const savedUserId = localStorage.getItem('savedUserId');
    if (savedUserId) {
        userIdInput.value = savedUserId;
        saveUserIdCheckbox.checked = true;
    }

    // Add shake animation keyframes
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

document.addEventListener('DOMContentLoaded', init);
