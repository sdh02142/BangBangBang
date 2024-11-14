import { PACKET_TYPE } from "../../constants/header.js"
import { createResponse } from "../response/createResponse.js"

export const joinRoomNotification = (user) => {
    const responsePayload = {
        joinRoomNotification: {
            joinUser: user.id
        }
    };

    // sequence에 user.sequence
    const response = createResponse(PACKET_TYPE.JOIN_ROOM_NOTIFICATION, 0, responsePayload);
    user.socket.write(response)
}

// message S2CJoinRoomNotification {
//     UserData joinUser = 1;
// }