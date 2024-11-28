import { fleaMarketNotification } from '../../utils/notification/fleaMarket.notification.js'
import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import {
    getStateNormal,
    getStatefleaMarketWait,
    getStatefleaMarketTurnEnd,
    getStatefleaMarketTurnOver,
  } from '../../constants/stateType.js';
import { createResponse } from '../../utils/response/createResponse.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js'

export const fleaMarketPickHandler = (socket, payload) => {
  const gainCardUser = getUserBySocket(socket);
  const currentGame = findGameById(gainCardUser.roomId);
  const fleaMarketDeck = currentGame.fleaMarketDeck;
  const fleaMarketUsers = currentGame.fleaMarketUsers;
  const pickIndex = payload.fleaMarketPickRequest.pickIndex;

  const alreadyPicked = currentGame.fleaMarketPickIndex.findIndex((pick) => pick === pickIndex);
  if (alreadyPicked !== -1) {
    console.error('이미 선택된 카드')
    const errorResponse = {
      fleaMarketPickResponse: {
        success: false,
        failCode: Packets.GlobalFailCode.INVALID_REQUEST
      }
    }

    socket.write(createResponse(PACKET_TYPE.FLEA_MARKET_PICK_RESPONSE, 0, errorResponse))
    return;
  }

  currentGame.fleaMarketPickIndex.push(pickIndex); // push된 이후에 해당 배열의 length를 반환
  currentGame.fleaMarketTurn++;
    // 왼쪽 카드의 순서는 0부터 시작
  gainCardUser.addHandCard(fleaMarketDeck[pickIndex]);
  
  gainCardUser.setCharacterState(getStatefleaMarketTurnOver()); // 플리마켓 카드 선택한 유저 상태 정상화
  console.log('카드 선택한 유저: ' + gainCardUser.nickname);

  if (currentGame.fleaMarketTurn === fleaMarketUsers.length) {
    console.log('마지막 유저 선택')
    // 마지막 선택 이전에 normal --> 마지막 선택 이후에
    currentGame.users.forEach((user) => {
      user.setCharacterState(getStateNormal());
    });

    fleaMarketNotification(fleaMarketDeck, currentGame.fleaMarketPickIndex, fleaMarketUsers);
    userUpdateNotification(fleaMarketUsers);
    // userUpdateNotification(currentGame.users)
    // 플리마켓 노티피케이션보다 위에 있으면 캐릭터 상태 동기화 순서가 먼저 이루어져서 플리마켓 창이 안 닫힘
    // 인게임 유저 풀에서 각 유저 간의 상태 정상화, 위치 동기화를 다시 해줘야 할 거 같다고 추측 중..
    console.log('플리마켓 종료');
    
    console.log('플리마켓 뽑힌 카드 수: ' + currentGame.fleaMarketPickIndex.length);
    console.log('플리마켓 카드 덱 수: ' + fleaMarketDeck);
  } else {
    fleaMarketUsers[currentGame.fleaMarketTurn].setCharacterState(getStatefleaMarketTurnEnd()); // 플리마켓 대기 배열에 남아있는 첫번째 유저 상태 변경
    console.log('다음 플리마켓 턴 유저: ' + fleaMarketUsers[currentGame.fleaMarketTurn].nickname);
    
    // userUpdateNotification(fleaMarketUsers)
    fleaMarketNotification(fleaMarketDeck, currentGame.fleaMarketPickIndex, fleaMarketUsers);
    userUpdateNotification(fleaMarketUsers)
  };

  const responsePayload = {
    fleaMarketPickResponse: {
      success: true,
      failCode: Packets.GlobalFailCode.NONE_FAILCODE,
    },
  };
  socket.write(createResponse(PACKET_TYPE.FLEA_MARKET_PICK_RESPONSE, 0, responsePayload));
};
// 노티피케이션을 먼저 보내주고(게임 인원수 만큼 
// 카드 뽑아서 배열에 넣고 카드 타입으로 보내주고
// 인덱스 숫자 만큼 배열을 새로 만들어서 픽인덱스에 넣어서 보내보기)
// 핸들러 리퀘스트가 오면 해당 핸들러에서 픽인덱스 숫자 뽑아서 카드와 인덱스
// 배열에서 제거하고 다시 노티피케이션 바로 보내고 리스폰로 
// 
// Packet [Id : 30]
// message S2CFleaMarketNotification {
//     repeated CardType cardTypes = 1;
//     repeated int32 pickIndex = 2;
// }

// Packet [Id : 31]
// message C2SFleaMarketPickRequest {
//     int32 pickIndex = 1;
// }

// 응답 정보
// 모두에게 : [Id : 30] S2CFleaMarketNotification 

// 나에게 : [Id : 32] S2CFleaMarketPickResponse 
// message S2CFleaMarketPickResponse {
//   bool success = 1;
//   GlobalFailCode failCode = 2;
// }