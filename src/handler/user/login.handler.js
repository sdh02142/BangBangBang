import jwt from 'jsonwebtoken';
import { GlobalFailCode } from '../../init/loadProtos.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const loginHandler = (socket, payload) => {
  const { id, password } = payload.loginRequest;
  console.log({ id, password });

  const token = jwt.sign({ id, password }, 'temparary_secret_key', { expiresIn: '1h' });

  const responsePayload = {
    loginResponse: {
      success: true,
      message: '로그인 성공',
      token: token,
      myInfo: { id: id, nickname: id, character: {} },
      failCode: GlobalFailCode.NONE_FAILECODE,
    },
  };

  socket.write(createResponse(PACKET_TYPE.LOGIN_RESPONSE, 0, responsePayload));
};
