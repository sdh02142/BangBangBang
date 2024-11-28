import {
  getStatefleaMarketTurnEnd,
  getStatefleaMarketWait,
} from '../../constants/stateType.js';
import { fleaMarketNotification } from '../../utils/notification/fleaMarket.notification.js'
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js'

export const fleaMarketCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  const currentUsers = currentGame.users;
  const cardUsingUserIndex = currentUsers.findIndex((user) => user.id === cardUsingUser.id);
  const fleaMarketUsers = currentUsers.splice(cardUsingUserIndex).concat(currentUsers.splice(0, cardUsingUserIndex))
  currentGame.fleaMarketUsers = fleaMarketUsers;
  currentGame.fleaMarketDeck = [];
  currentGame.fleaMarketPickIndex = [];
  currentGame.fleaMarketTurn = 0;

  // [3, 4, 0, 1, 2]
  // 카드 사용 유저는 첫 번째 유저니까
  const drawCard = currentGame.deck.shift();
  currentGame.fleaMarketDeck.push(drawCard);
  for (let i = 1; i < fleaMarketUsers.length; i++) {
    const drawCard = currentGame.deck.shift();
    currentGame.fleaMarketDeck.push(drawCard);
    fleaMarketUsers[i].setCharacterState(getStatefleaMarketWait());
    console.log(fleaMarketUsers[i].nickname)
  }
  console.log(`현재 플리마켓 덱: ${JSON.stringify(currentGame.fleaMarketDeck)}`)

  cardUsingUser.setCharacterState(getStatefleaMarketTurnEnd());
  fleaMarketNotification(currentGame.fleaMarketDeck, currentGame.fleaMarketPickIndex, fleaMarketUsers);
  userUpdateNotification(fleaMarketUsers);
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
