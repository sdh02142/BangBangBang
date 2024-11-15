import { GlobalFailCode } from "../../init/loadProtos.js"
import { getAllGameSessions } from "../../sessions/game.session.js"
import { getUserBySocket } from "../../sessions/user.session.js"
import { createResponse } from "../../utils/response/createResponse.js"

export const leaveRoomHandler = (socket, payload) => {
    const responsePayload = {
        leaveRoomResponse: {
            success: true,
            failCode: GlobalFailCode.NONE_FAILCODE,
        }
    }

    // ISSUE: 게임 나가는 유저가 있던 게임 세션을 알아야 함.(S2CLeaveRoomNotification를 쏴주기 위함)
    const game = getAllGameSessions();
    const user = getUserBySocket(socket);
    const users = game[user.gameId].users;
    users.forEach((user) => {
        const response = {
            leaveRoomNotification: { userId: user.id },
        }
        user.socket.write(response)
    })

    user.roomId = null;

    socket.write(createResponse(responsePayload))
}

// message S2CLeaveRoomResponse {
//     bool success = 1;
//     GlobalFailCode failCode = 2;
// }

// message S2CLeaveRoomNotification {
//     string userId = 1;
// }