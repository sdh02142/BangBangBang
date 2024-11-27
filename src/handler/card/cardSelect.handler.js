import { PACKET_TYPE } from "../../constants/header.js"
import { characterPositions } from "../../init/loadPositions.js"
import { Packets } from "../../init/loadProtos.js"
import { findGameById } from "../../sessions/game.session.js"
import { getUserBySocket } from "../../sessions/user.session.js"
import { gameStartNotification } from "../../utils/notification/gameStart.notification.js"
import { createResponse } from "../../utils/response/createResponse.js"
import useCardNotification from "../../utils/notification/useCard.notification.js"

export const cardSelectHandler = (socket, payload) => {
    console.log('카드 선택 핸들러 로그: ' + payload.cardSelectRequest.C2SCardSelectRequest)
    // useCardNotification
};


/**
 * 마지막 순서
 * 플리마켓과 흡수, 신기루, 
 * message C2SCardSelectRequest {
    SelectCardType selectType = 1; // 0: 핸드, 1: 장비, 2: 무기, 3: 디버프
    CardType selectCardType = 2; // selectType이  0일 경우 0, / 1, 2, 3일 경우 원하는 장비의 cardType
} => selectType 0 (핸드)

 * PACKET_TYPE.CARD_SELECT_REQUEST

 * message S2CCardSelectResponse {
    bool success = 1;
    GlobalFailCode failCode = 2;
}
 *   C2SCardSelectRequest cardSelectRequest = 40;
        S2CCardSelectResponse cardSelectResponse = 41;
 * 
 * enum SelectCardType {
    HAND = 0;
    EQUIP = 1;
    WEAPON = 2;
    DEBUFF = 3;
}
 */