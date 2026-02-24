/**
 * login.js
 * 
 * Handles login form logic and credential verification.
 * Requirement (a): Use Arrow Functions.
 * Requirement (b): Use Destructuring.
 * Requirement (d): Use Error Handling (try-catch).
 */

import { verifyUser } from './db.js';

/**
 * Display notification feedback
 */
const showNotification = (message, type = 'success') => {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `bg-${type} show`;
    setTimeout(() => notification.className = '', 3000);
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    // Select elements
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    /**
     * Handle Login Submission
     */
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // (d) Try-catch for robust error handling
        try {
            // (b) Extracting input values using Destructuring from an object
            const credentials = {
                username: usernameInput.value,
                password: passwordInput.value
            };

            const { username, password } = credentials;

            // Basic validation check
            if (!username || !password) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }

            // (c) Credential lookup using the logic in db.js (which uses Map)
            const success = verifyUser(username, password);

            if (success) {
                showNotification(`Successfully logged in! Welcome, ${username}.`);
                console.log(`[Auth] User "${username}" logged in successfully.`);

                // Clear inputs on success
                loginForm.reset();
            } else {
                showNotification('Invalid username or password.', 'error');
                console.warn(`[Auth] Failed login attempt for user: "${username}"`);

                // Visual feedback: red borders
                usernameInput.classList.add('invalid');
                passwordInput.classList.add('invalid');
            }

        } catch (error) {
            console.error('An error occurred during authentication:', error);
            showNotification('Authentication service unavailable. Please try again.', 'error');
        }
    });

    // Clear error states on input
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('invalid');
        });
    });
});
