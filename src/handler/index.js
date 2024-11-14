import { PACKET_TYPE } from '../constants/header.js';
import CustomError from '../utils/error/customError.js';
import getRoomListHandler from './room/getList.handler.js';
import { loginHandler } from './user/login.handler.js';
import { registerHandler } from './user/register.handler.js';

const handlers = {
  // 회원가입 및 로그인
  [PACKET_TYPE.REGISTER_REQUEST]: { handler: registerHandler },
  [PACKET_TYPE.LOGIN_REQUEST]: { handler: loginHandler },
  [PACKET_TYPE.GET_ROOM_LIST_REQUEST]: { handler: getRoomListHandler },
};

export const getHandlerByPacketType = (packetType) => {
  if (!handlers[packetType]) {
    throw new CustomError(`핸들러를 찾을 수 없음: ${packetType}`);
  }

  return handlers[packetType].handler;
};
