import RedisManager from '../classes/manager/redis.manager.js';
import Game from '../classes/model/game.class.js';
import { gameSession } from './session.js';

export const addGameSession = async (gameId, ownerId, name, maxUserNum) => {
  // id, ownerId, name, maxUserNum
  const session = new Game(`game:${gameId}`, ownerId, name, maxUserNum);
  await RedisManager.getInstance().setCache(gameId, session);
  // gameSession.push(session);
  return session;
};

export const removeGameSession = (gameId) => {
  const index = gameSession.findIndex((game) => game.id === gameId);
  // 못 찾은 경우
  if (index === -1) {
    console.error('게임을 찾지 못했습니다.');
    return null;
  }

  return gameSession.splice(index, 1)[0];
};

export const findGameById = (gameId) => {
  const index = gameSession.findIndex((game) => game.id === gameId);
  if (index !== -1) {
    return gameSession[index];
  }
};

export const joinGameSession = (gameId, user) => {
  // TODO
  // 1. redis에 getCache로 `game:gameId` 얻어오기'
  // 2. class-transformer로 Game 클래스로 복원해서 반환
  // 3. redis에서 users 부분 배열에 owner가 제대로 추가 됐는지
  const index = gameSession.findIndex((game) => game.id === gameId);
  // 못 찾은 경우
  if (index === -1) {
    console.error('게임을 찾지 못했습니다.');
    return null;
  }
  // console.log(`gameId: ${gameId}`)
  // console.log(gameSession[index])
  gameSession[index].users.push(user);

  return gameSession[index];
};

export const getAllGameSessions = () => {
  return gameSession;
};
