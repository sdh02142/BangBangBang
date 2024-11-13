export const registerHandler = (socket, payload) => {
  const { id, password, email } = payload.registerRequest;
  console.log(`id: ${id}, password: ${password}, email: ${email}`);

  // 회원가입 처리
};
