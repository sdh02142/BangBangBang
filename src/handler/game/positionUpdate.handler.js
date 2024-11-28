import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import positionUpdateNotification from '../../utils/notification/positionUpdate.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';

// 위치 동기화는 Response가 없었음
export const positionUpdateHandler = (socket, payload) => {
  const { x, y } = payload.positionUpdateRequest;

  const user = getUserBySocket(socket);
  const prevX = user.position.x;
  const prevY = user.position.y;

  const distance = Math.sqrt(Math.pow(x - prevX + Math.pow(y - prevY)));
  // 한번에 10 이상 이동했다
  if (distance > 10) {
    console.error('한 번에 10 이동함. 핵 아님?');
    // const errorResponsePayload = {
    //   positionUpdateResponse: {
    //     success: false,
    //     failCode: Packets.GlobalFailCode.CHARACTER_STATE_ERROR,
    //   },
    // };

    // socket.write(createResponse(PACKET_TYPE.POSITION_UPDATE_RESPONSE, 0, errorResponsePayload));
    return;
  }

  // 성공한 경우
  user.updatePosition(x, y);

  // Noti 전송
  const currentGame = findGameById(user.roomId);
  const inGameUsers = currentGame.users;
  const notificationPayload = positionUpdateNotification(inGameUsers);
  inGameUsers.forEach((user) => {
    user.socket.write(
      createResponse(PACKET_TYPE.POSITION_UPDATE_NOTIFICATION, 0, notificationPayload),
    );
  });
};

/*
message C2SPositionUpdateRequest {
    double x = 1;
    double y = 2;
}

message S2CPositionUpdateResponse {
    bool success = 1;
    GlobalFailCode failCode = 2;
}

message S2CPositionUpdateNotification {
    repeated CharacterPositionData characterPositions = 1;
}

message CharacterPositionData {
    int64 id = 1; // 유저의 아이디
    double x = 2;
    double y = 3;
}
    
*/
