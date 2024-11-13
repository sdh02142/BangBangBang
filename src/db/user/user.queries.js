export const SQL_QUERIES = {
  CREATE_USER: 'INSERT INTO user (email, password, nickname) VALUES (?, ?, ?)',
  FIND_USER_BY_EMAIL: 'SELECT * FROM user WHERE email = ?',
};
