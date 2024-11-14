import Game from '../classes/model/game.class.js';
import { gameSession } from './session.js';

// 방 생성 핸들러에서 gameId는 UUIDv4로 넘겨주기
export const addGameSession = (gameId, ownerId, name, maxUserNum) => {
  // id, ownerId, name, maxUserNum
  const session = new Game(gameId, ownerId, name, maxUserNum);
  gameSession.push(session);
  return session;
};

export const removeGameSession = (gameId) => {
  const index = gameSession.findIndex((game) => game.id === gameId);
  // 못 찾은 경우
  if (index === -1) {
    console.error('유저를 찾지 못했습니다.');
    return null;
  }

  return gameSession.splice(index, 1)[0];
};

// 방 리스트 가져오는 핸들러에서 사용
export const getAllGameSessions = () => {
  return gameSession;
};
