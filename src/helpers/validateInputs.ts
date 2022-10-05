import emailRegex from "./emailRegex.js";
import tzList from "./tzList.js";

export function isEmailValid(email: string) {
    if (email == "") { return false; }
    if (!emailRegex.test(email)) { return false; }
    return true;
}

export function isStringLongEnough(string: string, length: number = 1) {
    if (string.length >= length) { return true; }
    return false;
}

export function isPasswordSecure(password: string) {
    if (password.length < 6) { return false; }
    if (!/[A-Z]/.test(password)) { return false; }
    if (!/[a-z]/.test(password)) { return false; }
    if (!/[0-9]/.test(password)) { return false; }
    return true;
}

export function isValidTimezone(timezone: string) {
    if (timezone == "") { return false; }
    if (tzList.includes(timezone)) { return true; }
    else { return false; }
}