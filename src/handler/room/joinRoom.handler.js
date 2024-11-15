import { getAllGameSessions, joinGameSession } from "../../sessions/game.session.js";
import { getUserBySocket } from "../../sessions/user.session.js";
import { GlobalFailCode } from '../../init/loadProtos.js';
import { PACKET_TYPE } from "../../constants/header.js";
import { createResponse } from "../../utils/response/createResponse.js";
import { joinRoomNotification } from "../../utils/notification/joinRoom.notification.js";

export const joinRoomHandler = (socket, payload) => {
    const {roomId} = payload.joinRoomRequest;

    const user = getUserBySocket(socket);
    if (!user) {
        const errorMessage = '유저를 찾을 수 없습니다.';
        console.error(errorMessage);
        const errorResponsePayload = {
            joinRoomResponse: {
                success: false,
                room: null,
                failCode: GlobalFailCode.JOIN_ROOM_FAILED
            }
        }

        socket.write(createResponse(PACKET_TYPE.JOIN_ROOM_RESPONSE, 0, errorResponsePayload));
    }

    const room = joinGameSession(roomId, user);
    console.log(room)
    // 방 안의 모든 유저에게 해당 유저 join 알림
    room.users.forEach((user) => {
        joinRoomNotification(user);
    });
    
    const responsePayload = {
        joinRoomResponse: {
            success: true,
            room: room,
            failCode: GlobalFailCode.NONE_FAILCODE,
        }
    }

    socket.write(createResponse(PACKET_TYPE.JOIN_ROOM_RESPONSE, 0, responsePayload));
}

export const joinRandomRoomHandler = (socket, payload) => {
    // const {roomId} = payload.joinRandomRoomRequest;
    // console.log("roomId:",roomId)
    
    const user = getUserBySocket(socket);
    if (!user) {
        const errorMessage = '유저를 찾을 수 없습니다.';
        console.error(errorMessage);
        const errorResponsePayload = {
            joinRandomRoomResponse: {
                success: false,
                room: null,
                failCode: GlobalFailCode.NONE_FAILCODE,
            }
        }

        socket.write(createResponse(PACKET_TYPE.JOIN_RANDOM_ROOM_RESPONSE, 0, errorResponsePayload));
    }

    const rooms = getAllGameSessions();
    const roomId = Math.floor(Math.random() * rooms.length);

    const room = joinGameSession(roomId, user);
    console.log(room)
    // 방 안의 모든 유저에게 해당 유저 join 알림
    room.users.forEach((user) => {
        joinRoomNotification(user);
    });

    const responsePayload = {
        joinRandomRoomResponse: {
            success: true,
            room: room,
            failCode: GlobalFailCode.NONE_FAILCODE,
        }
    }

    socket.write(createResponse(PACKET_TYPE.JOIN_RANDOM_ROOM_RESPONSE, 0, responsePayload));
}

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