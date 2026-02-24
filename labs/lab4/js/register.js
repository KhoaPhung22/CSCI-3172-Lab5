/**
 * register.js
 * 
 * Handles registration form logic, event listeners, and feedback.
 * Requirement (a): Use Arrow Functions.
 * Requirement (b): Use Event Listeners for visual feedback and error messages.
 * Requirement (d): Use Error Handling (try-catch).
 */

import { validateRegistrationForm, validateEmail, validateUsername, validatePassword, doPasswordsMatch } from './validation.js';
import { addUser, isUsernameTaken } from './db.js';

/**
 * Display top-level notification
 * Requirement (b): Provide visual feedback
 */
const showNotification = (message, type = 'success') => {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `bg-${type} show`;
    setTimeout(() => notification.className = '', 3000);
};

/**
 * Toggle input validation styles and messages
 * Requirement (b): Changing border colours of input fields
 */
const toggleValidation = (element, isValid, errorElement, errorMessage = '') => {
    if (isValid) {
        element.classList.remove('invalid');
        element.classList.add('valid');
        errorElement.textContent = '';
    } else {
        element.classList.remove('valid');
        element.classList.add('invalid');
        errorElement.textContent = errorMessage;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');

    // Group elements for efficient access
    const fields = {
        email: {
            input: document.getElementById('email'),
            error: document.getElementById('emailError')
        },
        username: {
            input: document.getElementById('username'),
            error: document.getElementById('usernameError')
        },
        password: {
            input: document.getElementById('password'),
            error: document.getElementById('passwordError')
        },
        confirmPassword: {
            input: document.getElementById('confirmPassword'),
            error: document.getElementById('confirmPasswordError')
        }
    };

    // (b) Real-time validation using Event Listeners
    fields.email.input.addEventListener('blur', () => {
        const isValid = validateEmail(fields.email.input.value);
        toggleValidation(fields.email.input, isValid, fields.email.error, 'Invalid email (TLD 2-8 chars).');
    });

    fields.username.input.addEventListener('blur', () => {
        const val = fields.username.input.value;
        let msg = '';
        let ok = validateUsername(val);

        if (!ok) {
            msg = 'Must start with a letter, no spaces/special characters.';
        } else if (isUsernameTaken(val)) {
            ok = false;
            msg = 'Username already exists.';
        }

        toggleValidation(fields.username.input, ok, fields.username.error, msg);
    });

    fields.password.input.addEventListener('input', () => {
        const ok = validatePassword(fields.password.input.value);
        toggleValidation(fields.password.input, ok, fields.password.error, 'Min 12 chars: 1 Upper, 1 Lower, 1 Num, 1 Special.');
    });

    fields.confirmPassword.input.addEventListener('input', () => {
        const ok = doPasswordsMatch(fields.password.input.value, fields.confirmPassword.input.value);
        toggleValidation(fields.confirmPassword.input, ok, fields.confirmPassword.error, 'Passwords do not match.');
    });

    // Handle Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // (d) Try-catch for robust error handling
        try {
            // (b) Destructuring form values efficiently
            const formData = {
                email: fields.email.input.value,
                username: fields.username.input.value,
                password: fields.password.input.value,
                confirmPassword: fields.confirmPassword.input.value
            };

            // Destructure the values for validation
            const { email, username, password, confirmPassword } = formData;

            const validationErrors = validateRegistrationForm(formData);

            if (validationErrors.length > 0) {
                showNotification('Form contains invalid entries.', 'error');
                // Force error state for highlighting
                validationErrors.forEach(field => fields[field].input.classList.add('invalid'));
                return;
            }

            // Final DB check
            if (isUsernameTaken(username)) {
                showNotification('Username already exists.', 'error');
                fields.username.input.classList.add('invalid');
                return;
            }

            // (c) Successful Registration
            addUser(username, password);

            showNotification('You\'ve been successfully registered!');
            console.log(`Success: Registered "${username}".`);

            // Reset UI
            form.reset();
            Object.values(fields).forEach(f => f.input.classList.remove('valid', 'invalid'));

        } catch (err) {
            console.error('Registration error occurred:', err);
            showNotification('Something went wrong. Please try again.', 'error');
        }
    });
});
