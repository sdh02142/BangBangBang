import jwt from 'jsonwebtoken';
import { GlobalFailCode } from '../../init/loadProtos.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { findUserByEmail } from '../../db/user/user.db.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { config } from '../../config/config.js';
import bcrypt from 'bcrypt';
import { addUser } from '../../sessions/user.session.js';
import User from '../../classes/model/user.class.js';
import { addGameSession } from '../../sessions/game.session.js';

export const loginHandler = async (socket, payload) => {
  const { id, password } = payload.loginRequest;
  console.log({ id, password });

  try {
    const user = await findUserByEmail(id)
    if (!user) {
      const errorMessage = `${id}: 없는 id입니다.`;
      console.error(errorMessage);
      const errorResponse = {
        loginResponse: {
          success: false,
          message: errorMessage,
          token: '',
          myInfo: {},
          failCode: GlobalFailCode.AUTHENTICATION_FAILED
        }
      }

      socket.write(createResponse(PACKET_TYPE.LOGIN_RESPONSE, 0, errorResponse));
      return;
    }
    
    //패스워드 확인
    if (!(await bcrypt.compare(password, user.password))) {
      const errorMessage = '비밀번호가 틀렸습니다.';
      console.error(errorMessage);
      const errorResponse = {
        loginResponse: {
          success: false,
          message: errorMessage,
          token: '',
          myInfo: {},
          failCode: GlobalFailCode.AUTHENTICATION_FAILED
        }
      }

      socket.write(createResponse(PACKET_TYPE.LOGIN_RESPONSE, 0, errorResponse));
      return;
    }

    // TODO: 세션에 유저 추가
    const newUser = new User(id, id, socket);
    addUser(newUser);
    // TODO: 중복로그인 체크

    const token = jwt.sign({ id, password }, config.jwt.SCRET_KEY, { expiresIn: '1h' });
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

  } catch (err) {
    console.error(`로그인 에러: ${err}`);
  }

};
