import { PACKET_TYPE } from '../constants/header.js';
import CustomError from '../utils/error/customError.js';
import { registerHandler } from './user/register.handler.js';

const handlers = {
  // 회원가입 및 로그인
  [PACKET_TYPE.REGISTER_REQUEST]: { handler: registerHandler },
};

export const getHandlerByPacketType = (packetType) => {
  if (!handlers[packetType]) {
    throw new CustomError(`핸들러를 찾을 수 없음: ${packetType}`);
  }

  return handlers[packetType].handler;
};
