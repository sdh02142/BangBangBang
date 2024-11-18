export const joinRoomNotification = (user) => {
    const responsePayload = {
        joinRoomNotification: {
            joinUser: {
                id: user.id, // 대소문자 구별로 인해 leaveroom 인원수 갱신이 안 됐음
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