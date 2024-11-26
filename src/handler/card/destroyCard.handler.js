import { PACKET_TYPE } from '../../constants/header.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';

// 카드 선택하고 버튼 눌러야 옴.
// NOTE: 근데 버튼이 없음
// UI가 안뜨는 이유는 카드가 너무 많았어서였음

// 페이로드: {"destroyCardRequest":{"destroyCards":}}
// phaseUpdate에서 한번더 삭제 로직을 넣으면? <-- 어차피 이 리퀘가 날라오면 피보다 카드수가 적을 것이기 때문에, 노티에서 hp에 따라 랜덤으로 카드를 삭제해주면 로직 겹칠일은 없음
export const destroyCardHandler = (socket, payload) => {
  console.log('카드 삭제 request 날라옴');
  const destroyCards = payload.destroyCardRequest.destroyCards.flatMap(({ type, count }) =>
    new Array(count).fill(type),
  );
  console.log('flat화 된 카드 뭉치', destroyCards);
  const cardDestroyUser = getUserBySocket(socket);

  console.log('삭제 전 손패', cardDestroyUser.characterData.handCards);

  destroyCards.forEach((card) => {
    cardDestroyUser.removeHandCard(card);
  });

  // 동기화 해줘야하나?
  const currentGame = findGameById(cardDestroyUser.roomId);
  userUpdateNotification(currentGame.users);

  // response
  const responsePayload = {
    destroyCardResponse: {
      handCards: cardDestroyUser.characterData.handCards.map((card) => {
        return { type: card.type, count: card.count };
      }),
    },
  };

  socket.write(createResponse(PACKET_TYPE.DESTROY_CARD_RESPONSE, 0, responsePayload));

  console.log('삭제 후 손패', cardDestroyUser.characterData.handCards);
};

// message CardData {
//     CardType type = 1;
//     int32 count = 2;
// }

// message C2SDestroyCardRequest {
//     repeated CardData destroyCards = 1;
// }

// message S2CDestroyCardResponse {
//     repeated CardData handCards = 1;
// }
