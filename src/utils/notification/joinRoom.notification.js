import { PACKET_TYPE } from "../../constants/header.js"
import { createResponse } from "../response/createResponse.js"

export const joinRoomNotification = (user) => {
    const responsePayload = {
        joinRoomNotification: {
            joinUser: {
                Id: user.id,
                nickname: user.nickname,
                character: user.characterData
            },
        }
    };

    // sequence에 user.sequence
    const response = createResponse(PACKET_TYPE.JOIN_ROOM_NOTIFICATION, 0, responsePayload);
    user.socket.write(response)
}

// message S2CJoinRoomNotification {
//     UserData joinUser = 1;
// }

// message UserData {
//     string id = 1;
//     string nickname = 2;
//     CharacterData character = 3;
// }