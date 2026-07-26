const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function isValidEmail(email) {
  return typeof email === "string" && EMAIL_REGEX.test(email);
}

function isStrongPassword(password) {
  return typeof password === "string" && password.length >= MIN_PASSWORD_LENGTH;
}

module.exports = { isValidEmail, isStrongPassword, MIN_PASSWORD_LENGTH };
