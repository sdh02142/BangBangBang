import { Packets } from '../../init/loadProtos.js';

export const gamePrepareNotification = (room) => {
    const responsePayload = {
        gamePrepareNotification: {
            room: {
                id: room.id,
                ownerId: room.ownerId,
                name: room.name,
                maxUserNum: room.maxUserNum,
                state: Packets.RoomStateType.PREPARE,
                users: room.users.map((user) => {
                    return user.makeRawObject();
                }),
            },
        }
    };

    return responsePayload;
}


// message UserData {
//     int64 id = 1;
//     string nickname = 2;
//     CharacterData character = 3;
// }

// S2CGamePrepareNotification gamePrepareNotification = 19;
// message S2CGamePrepareNotification {
//     RoomData room = 1;
// }