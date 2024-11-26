import { PACKET_TYPE } from "../../constants/header.js"
import { findGameById, getAllGameSessions, removeGameSession } from "../../sessions/game.session.js"
import { getUserBySocket } from "../../sessions/user.session.js"
import leaveRoomNotification from "../../utils/notification/leaveRoom.nofitication.js"
import { createResponse } from "../../utils/response/createResponse.js"
import { Packets } from '../../init/loadProtos.js';
import { roomManager } from "../../classes/manager/room.manager.js"

export const leaveRoomHandler = async (socket, payload) => {
    try {
        const leaveUser = getUserBySocket(socket);
        console.log(`${leaveUser.id} 유저 나감`)

        const currentGameId = leaveUser.roomId;
        const currentGame = findGameById(leaveUser.roomId);

        //방장이 나갔을 경우
        if (leaveUser.id === currentGame.ownerId) {
            const responsePayload = {
                leaveRoomResponse: {
                    success: true,
                    failCode: Packets.GlobalFailCode.NONE_FAILCODE,
                }
            }
            currentGame.users.forEach((user) => {
                user.roomId = null;
                user.socket.write(createResponse(PACKET_TYPE.LEAVE_ROOM_RESPONSE, 0, responsePayload));
            });
            
            removeGameSession(currentGameId);
            roomManager.deleteRoom(currentGameId);
            return;
        }

        leaveUser.roomId = null;
        currentGame.removeUser(leaveUser);
        const users = currentGame.users;
        const payload = leaveRoomNotification(leaveUser);
        users.forEach((user) => {
            user.socket.write(createResponse(PACKET_TYPE.LEAVE_ROOM_NOTIFICATION, 0, payload));
        });

        console.log(getAllGameSessions());

        const responsePayload = {
            leaveRoomResponse: {
                success: true,
                failCode: Packets.GlobalFailCode.NONE_FAILCODE,
            }
        }

        socket.write(createResponse(PACKET_TYPE.LEAVE_ROOM_RESPONSE, 0, responsePayload))
    } catch (err) {
        console.error(err);
    }
}

// message S2CLeaveRoomResponse {
//     bool success = 1;
//     GlobalFailCode failCode = 2;
// }

// message S2CLeaveRoomNotification {
//     string userId = 1;
// }