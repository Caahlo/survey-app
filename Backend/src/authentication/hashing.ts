import bcrypt from 'bcrypt';
import ApiError from '../ApiError';

function generateSalt() {
  return bcrypt.genSaltSync(10);
}

function hashPassword(password: string, salt: string) {
  if (password && salt) {
    return bcrypt.hashSync(password, salt);
  }
  throw new ApiError('Cannot hash password when password or salt is undefined!', 400);
}

function checkPlainAndHash(plaintext: string, hash: string) {
  return bcrypt.compareSync(plaintext, hash);
}

export default {
  generateSalt,
  hashPassword,
  checkPlainAndHash,
};
