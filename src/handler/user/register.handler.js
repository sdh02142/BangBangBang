import { PACKET_TYPE } from '../../constants/header.js';
import { GlobalFailCode } from '../../init/loadProtos.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { createUser, findUserByEmail } from '../../db/user/user.db.js';
import { v4 as uuidv4 } from 'uuid'; 
import bcrypt from 'bcrypt'
import Joi from 'joi';

export const registerHandler = async (socket, payload) => {
  const { id, password, email } = payload.registerRequest;
  console.log(`id: ${id}, password: ${password}, email: ${email}`);

  try {
    const schema = Joi.object({
      id: Joi.string().email().required(),
      password: Joi.string().min(4).max(20).required()
    });

    const validation = schema.validate({id, password});
    const validationError = validation.error;
    if (validationError) {
      const errorMessage = '검증오류'
      const errorResponse = {
        registerResponse: {
          success: false,
          message: errorMessage,
          failCode: GlobalFailCode.AUTHENTICATION_FAILED
        }
      }
      socket.write(createResponse(PACKET_TYPE.REGISTER_RESPONSE, 0, errorResponse));
      return;
    }

    const existedUser = await findUserByEmail(email);
    // 중복된 유저가 있다면
    if (existedUser) {
      // 에러 응답 처리
      const errorMessage = '이미 있는 유저입니다.'
      const errorResponse = {
        registerResponse: {
          success: false,
          message: errorMessage,
          failCode: GlobalFailCode.AUTHENTICATION_FAILED
        }
      }
      socket.write(createResponse(PACKET_TYPE.REGISTER_RESPONSE, 0, errorResponse));
      return;
    }

    // 회원가입 처리
    const hashedPW = await bcrypt.hash(password, 10);
    const uniqueId = uuidv4();
    const shortId = uniqueId.replace(/-/g, '').substring(0, 8);
    //uuid 생성된 값을 8자리로 변환
    await createUser(id, hashedPW, shortId)
    
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
  } catch (err) {
    console.error(`검증오류: ${err}`);
  }
};
