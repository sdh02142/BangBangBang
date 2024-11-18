import { PACKET_TYPE } from "../../constants/header.js"
import { getAllGameSessions } from "../../sessions/game.session.js"
import { getUserBySocket } from "../../sessions/user.session.js"
import leaveRoomNotification from "../../utils/notification/leaveRoom.nofitication.js"
import { createResponse } from "../../utils/response/createResponse.js"
import { Packets } from '../../init/loadProtos.js';

export const leaveRoomHandler = async (socket, payload) => {
    try {
        const leaveUser = getUserBySocket(socket);
        console.log(`${leaveUser.id} 유저 나감`)

        const currentGameId = leaveUser.roomId;
        const games = getAllGameSessions();
        const currentGame = games[currentGameId - 1]

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