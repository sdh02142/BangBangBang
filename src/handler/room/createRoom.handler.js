import { PACKET_TYPE } from '../../constants/header.js';
import { addGameSession, joinGameSession } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { Packets } from '../../init/loadProtos.js';
import { roomManager } from '../../classes/manager/room.manager.js'

export const createRoomHandler = async (socket, payload) => {
  const { name, maxUserNum } = payload.createRoomRequest;
  const user = getUserBySocket(socket);
  if (!user) {
      throw new CustomError(`유저를 찾을 수 없음`);
  }

  const ownerId = user.id;
  try {
      // RoomManager를 사용하여 새로운 방 ID 생성
      const roomId = roomManager.createRoom();

      const gameSession = addGameSession(roomId, ownerId, name, maxUserNum);

      if (!gameSession) {
          const errorResponsePayload = {
              createRoomResponse: {
                  success: false,
                  room: {},
                  failCode: Packets.GlobalFailCode.CREATE_ROOM_FAILED,
              },
          };
          socket.write(createResponse(PACKET_TYPE.CREATE_ROOM_RESPONSE, 0, errorResponsePayload));
      }
      user.roomId = roomId;
      const gameJoinSession = joinGameSession(roomId, user);

      const payloadResponse = {
          createRoomResponse: {
              success: true,
              room: {
                  id: gameJoinSession.id,
                  ownerId: gameSession.ownerId,
                  name: gameJoinSession.name,
                  maxUserNum: gameJoinSession.maxUserNum,
                  state: Packets.RoomStateType.WAIT,
                  users: gameJoinSession.users,
              },
              failCode: Packets.GlobalFailCode.NONE_FAILCODE,
          },
      };

      console.log(payloadResponse);
      socket.write(createResponse(PACKET_TYPE.CREATE_ROOM_RESPONSE, 0, payloadResponse));
  } catch (err) {
      console.error(`방 만들기 실패: ${err}`);
  }
};

/**
 * 
 * message C2SCreateRoomRequest {
    string name = 1;
    int32 maxUserNum = 2;
}

message S2CCreateRoomResponse {
    bool success = 1;
    RoomData room = 2;
    GlobalFailCode failCode = 3;
}

message RoomData {
    int32 id = 1;
    int64 ownerId = 2;
    string name = 3;
    int32 maxUserNum = 4;
    RoomStateType state = 5; // WAIT 0, PREPARE 1, INAGAME 2
    repeated UserData users = 6; // 인덱스 기반으로 턴 진행
}
 * 
 * 
 */

// CREATE_ROOM_REQUEST: 5,
// CREATE_ROOM_RESPONSE: 6,
// CREATE_ROOM_FAILED = 4;
