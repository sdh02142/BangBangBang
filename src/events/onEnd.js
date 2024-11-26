import { findGameById, getAllGameSessions } from '../sessions/game.session.js';
import { getUserBySocket, removeUser } from '../sessions/user.session.js';

export const onEnd = (socket) => () => {
  console.log('클라이언트 연결이 종료되었습니다.');
  const user = getUserBySocket(socket);
  if (user.roomId){ //유저가 게임을 진행중인 상황
    user.setHp(0)
  }
  
  removeUser(socket);
};
