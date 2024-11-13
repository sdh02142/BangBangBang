import { PACKET_TYPE } from '../constants/header.js';
import { registerHandler } from './user/register.handler.js';

const hendlers = {
  // 회원가입 및 로그인
  [PACKET_TYPE.REGISTER_REQUEST]: { handler: registerHandler },
};
