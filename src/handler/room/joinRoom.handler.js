import { findGameById, getAllGameSessions, joinGameSession } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { joinRoomNotification } from '../../utils/notification/joinRoom.notification.js';
import { Packets } from '../../init/loadProtos.js';

export const joinRoomHandler = (socket, payload) => {
  const { roomId } = payload.joinRoomRequest;

  const joinUser = getUserBySocket(socket);
  if (!joinUser) {
    const errorMessage = '유저를 찾을 수 없습니다.';
    console.error(errorMessage);
    const errorResponsePayload = {
      joinRoomResponse: {
        success: false,
        room: null,
        failCode: Packets.GlobalFailCode.JOIN_ROOM_FAILED,
      },
    };

    socket.write(createResponse(PACKET_TYPE.JOIN_ROOM_RESPONSE, 0, errorResponsePayload));
    return;
  }

  const game = findGameById(roomId);
  if (game.isFullRoom()) {
    const errorMessage = '방이 꽉 찼습니다.';
    console.error(errorMessage);
    const errorResponsePayload = {
      joinRoomResponse: {
        success: false,
        room: null,
        failCode: Packets.GlobalFailCode.JOIN_ROOM_FAILED,
      },
    };

    socket.write(createResponse(PACKET_TYPE.JOIN_ROOM_RESPONSE, 0, errorResponsePayload));
    return;
  }

  if (game.isGamingRoom()) {
    const errorMessage = '현재 게임중 입니다.';
    console.error(errorMessage);
    const errorResponsePayload = {
      joinRoomResponse: {
        success: false,
        room: null,
        failCode: Packets.GlobalFailCode.JOIN_ROOM_FAILED,
      },
    };

    socket.write(createResponse(PACKET_TYPE.JOIN_ROOM_RESPONSE, 0, errorResponsePayload));
    return;
  }

  joinUser.roomId = roomId;

  const room = joinGameSession(roomId, joinUser);
  console.log(room);

  // 방 안의 모든 유저에게 해당 유저 join 알림
  room.users.forEach((user) => {
    const response = joinRoomNotification(joinUser);
    user.socket.write(createResponse(PACKET_TYPE.JOIN_ROOM_NOTIFICATION, 0, response));
  });

  const responsePayload = {
    joinRoomResponse: {
      success: true,
      room: room,
      failCode: Packets.GlobalFailCode.NONE_FAILCODE,
    },
  };

  socket.write(createResponse(PACKET_TYPE.JOIN_ROOM_RESPONSE, 0, responsePayload));
};

export const joinRandomRoomHandler = (socket, payload) => {
  // const {roomId} = payload.joinRandomRoomRequest;
  // console.log("roomId:",roomId)

  const joinUser = getUserBySocket(socket);
  if (!joinUser) {
    const errorMessage = '유저를 찾을 수 없습니다.';
    console.error(errorMessage);
    const errorResponsePayload = {
      joinRandomRoomResponse: {
        success: false,
        room: null,
        failCode: Packets.GlobalFailCode.JOIN_ROOM_FAILED,
      },
    };

    socket.write(createResponse(PACKET_TYPE.JOIN_RANDOM_ROOM_RESPONSE, 0, errorResponsePayload));
    return;
  }

  const rooms = getAllGameSessions();
  //풀방 빼고 다시 랜덤
  const filteredRoom = rooms.filter((room) => !room.isFullRoom());
  if (filteredRoom.length === 0) {
    // 방 없음
    const errorMessage = '방을 찾을 수 없습니다.';
    console.error(errorMessage);
    const errorResponsePayload = {
      joinRandomRoomResponse: {
        success: false,
        room: null,
        failCode: Packets.GlobalFailCode.ROOM_NOT_FOUND,
      },
    };

    socket.write(createResponse(PACKET_TYPE.JOIN_RANDOM_ROOM_RESPONSE, 0, errorResponsePayload));
    return;
  }

  const roomId = Math.floor(Math.random() * filteredRoom.length) + 1;

  joinUser.roomId = roomId;
  const room = joinGameSession(roomId, joinUser);
  console.log(room);
  // 방 안의 모든 유저에게 해당 유저 join 알림
  const notificationResponse = joinRoomNotification(joinUser);
  room.users.forEach((user) => {
    user.socket.write(createResponse(PACKET_TYPE.JOIN_ROOM_NOTIFICATION, 0, notificationResponse));
  });

  const responsePayload = {
    joinRandomRoomResponse: {
      success: true,
      room: room,
      failCode: Packets.GlobalFailCode.NONE_FAILCODE,
    },
  };

  socket.write(createResponse(PACKET_TYPE.JOIN_RANDOM_ROOM_RESPONSE, 0, responsePayload));
};

// message C2SJoinRoomRequest {
//     int32 roomId = 1;
// }

// message S2CJoinRoomResponse {
//     bool success = 1;
//     RoomData room = 2;
//     GlobalFailCode failCode = 3;
// }

// message S2CJoinRoomNotification {
//     UserData joinUser = 1;
// }

// message RoomData {
//     int32 id = 1;
//     string ownerId = 2;
//     string name = 3;
//     int32 maxUserNum = 4;
//     RoomStateType state = 5; // WAIT 0, PREPARE 1, INAGAME 2
//     repeated UserData users = 6; // 인덱스 기반으로 턴 진행
// }
