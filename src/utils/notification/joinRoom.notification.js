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

    return responsePayload;
    // user.socket.write(response)
}

// message S2CJoinRoomNotification {
//     UserData joinUser = 1;
// }

// message UserData {
//     int64 id = 1;
//     string nickname = 2;
//     CharacterData character = 3;
// }