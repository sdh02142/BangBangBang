import { PACKET_TYPE } from "../../constants/header.js"
import { Packets } from "../../init/loadProtos.js"
import { findGameById } from "../../sessions/game.session.js"
import { getUserBySocket } from "../../sessions/user.session.js"
import { gamePrepareNotification } from "../../utils/notification/gamePrepare.notification.js"
import { createResponse } from "../../utils/response/createResponse.js"

export const gamePrepareHandler = (socket, payload) => {
    try {
        const ownerUser = getUserBySocket(socket);
        // 방장 존재 여부
        if (!ownerUser) {
            console.error('방장을 찾을 수 없습니다.');
            const errorResponse = {
                gamePrepareResponse: {
                    success: false,
                    failCode: Packets.GlobalFailCode.NOT_ROOM_OWNER,
                }
            };
            socket.write(createResponse(PACKET_TYPE.GAME_PREPARE_RESPONSE, 0, errorResponse));
            return;
        }

        // 게임 존재 여부
        const currentGame = findGameById(ownerUser.roomId);
        if (!currentGame) {
            console.error('게임을 찾을 수 없습니다.');
            const errorResponse = {
                gamePrepareResponse: {
                    success: false,
                    failCode: Packets.GlobalFailCode.INVALID_ROOM_STATE,
                }
            };
            socket.write(createResponse(PACKET_TYPE.GAME_PREPARE_RESPONSE, 0, errorResponse));
            return;
        }

        // roomStateType --> PREPARE
        currentGame.gameStart();
        console.log('현재 게임 정보:', currentGame)

        // 방 유저에게 알림(gamePrepareNotification)
        const notificationPayload = gamePrepareNotification(currentGame);
        currentGame.users.forEach((user) => {
            console.log(`${user.id} 유저에게 게임 시작 알림 전송`)
            user.socket.write(createResponse(PACKET_TYPE.GAME_PREPARE_NOTIFICATION, 0, notificationPayload));
        });

        const preparePayload = {
            gamePrepareResponse: {
                success: true,
                failCode: Packets.GlobalFailCode.NONE_FAILCODE,
            }
        };

        socket.write(createResponse(PACKET_TYPE.GAME_PREPARE_RESPONSE, 0, preparePayload));
        console.log('게임 시작 response 전송 완료')
    } catch (err) {
        console.error(err);
    }
}

/* 게임 시작 전 역할 및 캐릭터 셔플 요청
message C2SGamePrepareRequest {

}

message S2CGamePrepareResponse {
    bool success = 1;
    GlobalFailCode failCode = 2;
}
    
enum RoleType {
    NONE_ROLE = 0;
    TARGET = 1;
    BODYGUARD = 2;
    HITMAN = 3;
    PSYCHOPATH = 4;
}
    
enum CharacterType {
    NONE_CHARACTER = 0;
    RED = 1; // 빨강이
    SHARK = 3; // 상어군
    MALANG = 5; // 말랑이
    FROGGY = 7; // 개굴군
    PINK = 8; // 핑크군
    SWIM_GLASSES = 9; // 물안경군
    MASK = 10; // 가면군
    DINOSAUR = 12; // 공룡이
    PINK_SLIME = 13; // 핑크슬라임
}

*/

