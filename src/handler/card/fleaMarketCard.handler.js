import {
  getStatefleaMarketTurnEnd,
  getStatefleaMarketWait,
} from '../../constants/stateType.js';
import { fleaMarketNotification } from '../../utils/notification/fleaMarket.notification.js'

export const fleaMarketCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  const fleaMarketDeck = currentGame.fleaMarketDeck;
  const currentUsers = currentGame.users;
  const fleaMarketUsers = currentGame.fleaMarketUsers;
  for(let i = 0; i < currentUsers.length; i++){
    fleaMarketUsers.push(currentUsers[i]);
    const drawCard = currentGame.deck.shift();
    fleaMarketDeck.push(drawCard);
    if (currentUsers[i] === cardUsingUser) {
      continue;
    } else {
      currentUsers[i].setCharacterState(getStatefleaMarketWait());
    };
  };
  cardUsingUser.setCharacterState(getStatefleaMarketTurnEnd());
  fleaMarketNotification(cardUsingUser, fleaMarketDeck, fleaMarketUsers.length, currentUsers, fleaMarketUsers);
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
