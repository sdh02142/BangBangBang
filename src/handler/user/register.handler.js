import { PACKET_TYPE } from '../../constants/header.js';
import { GlobalFailCode } from '../../init/loadProtos.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const registerHandler = (socket, payload) => {
  const { id, password, email } = payload.registerRequest;
  console.log(`id: ${id}, password: ${password}, email: ${email}`);

  // 회원가입 처리

  // 응답 생성
  const responsePayload = {
    registerResponse: {
      success: true,
      message: '회원가입 성공',
      failCode: GlobalFailCode.NONE_FAILCODE,
    },
  };

  // payloadOneofCase, sequence, payload
  socket.write(createResponse(PACKET_TYPE.REGISTER_RESPONSE, 0, responsePayload));
};
