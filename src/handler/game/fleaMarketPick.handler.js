import { fleaMarketNotification } from '../../utils/notification/fleaMarket.notification.js'
import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import {
    getStateNormal,
    getStatefleaMarketTurnEnd,
  } from '../../constants/stateType.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const fleaMarketPickHandler = (socket, payload) => {
  const gainCardUser = getUserBySocket(socket);
  const currentGame = findGameById(gainCardUser.roomId);
  const fleaMarketDeck = currentGame.fleaMarketDeck;
  const fleaMarketUsers = currentGame.fleaMarketUsers;
  const pickIndex = payload.fleaMarketPickRequest.pickIndex;
  console.log(fleaMarketDeck);
  console.log(fleaMarketUsers);
  console.log('페이로드: ' + pickIndex);
  // 왼쪽 카드의 순서는 0부터 시작
  gainCardUser.addHandCard({ type: fleaMarketDeck[pickIndex], count: 1 });
  gainCardUser.increaseHandCardsCount();

fleaMarketDeck.splice(pickIndex, 1); // 플리마켓 덱에서 선택한 카드 삭제
gainCardUser.setCharacterState(getStateNormal()); // 플리마켓 카드 선택한 유저 상태 정상화
console.log('카드 선택 후 플리마켓 덱: ' + fleaMarketDeck);
currentGame.removeUserFromFleaMarket(gainCardUser); // 플리마켓 대기 배열에서 카드 선택한 유저 삭제
console.log('남은 플리마켓 대기 유저: ' + fleaMarketUsers.length);
fleaMarketUsers[0].setCharacterState(getStatefleaMarketTurnEnd()); // 플리마켓 대기 배열에 남아있는 첫번째 유저 상태 변경
console.log(fleaMarketUsers[0].id);
fleaMarketNotification(gainCardUser, fleaMarketDeck, fleaMarketUsers.length, currentGame.users, fleaMarketUsers);
const responsePayload = {
    FleaMarketPickResponse: {
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