import { PACKET_TYPE } from "../../constants/header.js"
import { getAllGameSessions } from "../../sessions/game.session.js"
import { getUserBySocket } from "../../sessions/user.session.js"
import leaveRoomNotification from "../../utils/notification/leaveRoom.nofitication.js"
import { createResponse } from "../../utils/response/createResponse.js"

export const leaveRoomHandler = (socket, payload) => {
    try {
        const leaveUser = getUserBySocket(socket);

        const currentGameId = leaveUser.roomId;
        const games = getAllGameSessions();
        const currentGame = games[currentGameId - 1]
        const users = currentGame.users;
        leaveUser.roomId = null;
        currentGame.removeUser(leaveUser);

        
        users.forEach((user) => {
            const payload = leaveRoomNotification(leaveUser);
            
            console.log(`${user.id} 유저에게 notification 전송, payload: ${payload}`)
            user.socket.write(createResponse(PACKET_TYPE.LEAVE_ROOM_NOTIFICATION, 0, payload));
        });

        
        console.log(getAllGameSessions())
        

        const responsePayload = {
            leaveRoomResponse: {
                success: true,
                failCode: 0,
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