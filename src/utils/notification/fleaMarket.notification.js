import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../response/createResponse.js';

export const fleaMarketNotification = (cardTypes, pickIndex, currentGameUsers) => {
  console.log('fleaMarketNotification 호출됨')
  console.log(pickIndex)
  const responsePayload = {
    fleaMarketNotification: {
      cardTypes: cardTypes,
      pickIndex: pickIndex,
    },
  };

  currentGameUsers.forEach((user) => {
    console.log(`[${user.nickname}]: 플리마켓 노티 보내는 중`)
    user.socket.write(createResponse(PACKET_TYPE.FLEA_MARKET_NOTIFICATION, 0, responsePayload))
  });
  // 일단 노티 -> 선택 리퀘 날라오면 해당 유저 빼고 다음유저 상태 변경(getFleaMarketTurnEnd) -> 반복
  // cardTypes <- 카드 종류
  // pickIndex <- 뽑힌 순서 or 카드 수 userId int64
  // [ BBANG, HEAL, 119 ]
  // [ 0, 1, 2 ] <- 빈 배열로 처음에 보내고 선택될 때마다 해당 카드 인덱스를 채워서 보내야함
  // [ BBANG, 119]
  // [2, 1]
};

// message S2CFleaMarketNotification {
//     repeated CardType cardTypes = 1;
//     repeated int32 pickIndex = 2;
// }