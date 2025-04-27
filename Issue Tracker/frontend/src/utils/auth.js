"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.logout = logout;
exports.isAuthenticated = isAuthenticated;
exports.getCurrentUser = getCurrentUser;
const constants_1 = require("../constants");
const dummyUsers = [
    { username: 'admin', password: 'admin' },
    { username: 'user', password: 'user' },
];
function login(username, password) {
    //TODO: Replace with real API call
    const user = dummyUsers.find(user => user.username === username && user.password === password);
    if (!user) {
        return false;
    }
    const token = {
        username: user.username,
        id: user.username, //TODO: Replace with ID
        expiresAt: Date.now() + constants_1.TOKEN_EXPIRATION_TIME,
    };
    localStorage.setItem('token', JSON.stringify(token));
    return true;
}
function logout() {
    localStorage.removeItem('token');
}
function isAuthenticated() {
    const token = localStorage.getItem('token');
    if (token !== null) {
        const parsedToken = JSON.parse(token);
        const currentTime = Date.now();
        if (currentTime > parsedToken.expiresAt) {
            localStorage.removeItem('token');
            return false;
        }
        return true;
    }
    return false;
}
function getCurrentUser() {
    const tokenStr = localStorage.getItem('token');
    if (!tokenStr) {
        return null;
    }
    const token = JSON.parse(tokenStr);
    if (Date.now() > token.expiresAt) {
        localStorage.removeItem('token');
        return null;
    }
    return {
        id: token.id,
        username: token.username,
    };
}
