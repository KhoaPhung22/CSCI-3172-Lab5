export const validateEmail = (email) => {
    if (!email) return false;
    // Regex explanation:
    // ^[\w-\.]+  -> Starts with one or more word chars, dots, or hyphens
    // @         -> Literal @
    // ([\w-]+\.)+ -> One or more domain segments
    // [\w-]{2,8}$ -> TLD between 2 and 8 characters
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,8}$/;
    return emailRegex.test(email);
};

/**
 * Validates username format.
 * No leading numbers, no spaces, no special characters.
 */
export const validateUsername = (username) => {
    if (!username) return false;
    // Regex explanation:
    // ^[A-Za-z] -> Must start with a letter
    // [A-Za-z0-9]*$ -> Followed by zero or more letters or numbers only
    const usernameRegex = /^[A-Za-z][A-Za-z0-9]*$/;
    return usernameRegex.test(username);
};

/**
 * Validates password strength.
 * 12+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special character.
 */
export const validatePassword = (password) => {
    if (!password || password.length < 12) return false;

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasUpper && hasLower && hasNumber && hasSpecial;
};

/**
 * Validates if passwords match.
 */
export const doPasswordsMatch = (password, confirmPassword) => password === confirmPassword;

/**
 * Helper to validate the entire registration form data.
 * Use Destructuring Assignment to extract form input values efficiently.
 */
export const validateRegistrationForm = (formData) => {
    // Destructuring form data
    const { email, username, password, confirmPassword } = formData;

    const errors = [];

    if (!validateEmail(email)) {
        errors.push("email");
    }

    if (!validateUsername(username)) {
        errors.push("username");
    }

    if (!validatePassword(password)) {
        errors.push("password");
    }

    if (!doPasswordsMatch(password, confirmPassword)) {
        errors.push("confirmPassword");
    }

    return errors; // Returns list of field names that failed validation
};
