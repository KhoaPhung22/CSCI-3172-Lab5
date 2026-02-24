/**
 * db.js
 * 
 * Simulates a database in memory using ES6 Maps and Sets for efficiency.
 * Requirement: Use Maps and Sets to improve data structures.
 * Requirement: Use Arrow Functions throughout.
 */

// Initial pre-existing users that meet all validation requirements:
// Username: no number first, no spaces, no special characters.
// Password: 12+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special character.
const rawUsers = {
    "AdminAlice": "AliceSecure!2026",
    "BobDeveloper": "BobBuilds#999",
    "CharlieCoder": "CharlieCode?12"
};

// (c) Using Map for O(1) lookup of user credentials
const userMap = new Map(Object.entries(rawUsers));

// (c) Using Set for efficient checking of username existence
const usernameSet = new Set(Object.keys(rawUsers));

/**
 * (a) Arrow function to handle user registration.
 * Adds user to both the raw object (for simulation) and the efficient data structures.
 */
export const addUser = (username, password) => {
    // Add to raw JSON-like object
    rawUsers[username] = password;

    // Add to Map and Set for efficiency
    userMap.set(username, password);
    usernameSet.add(username);

    console.log(`[Database] User "${username}" registered successfully.`);
    return true;
};

/**
 * (a) Arrow function to verify login.
 */
export const verifyUser = (username, password) => {
    if (userMap.has(username)) {
        return userMap.get(username) === password;
    }
    return false;
};

/**
 * (a) Arrow function to check if username is taken.
 */
export const isUsernameTaken = (username) => usernameSet.has(username);

// Exporting the raw object if needed as per lab instructions
export const users = rawUsers;
