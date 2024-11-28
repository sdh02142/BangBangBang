import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../response/createResponse.js';
export const cardEffectNotification = (currentGame, useCardType, cardUsingUser) => {
  const hasEquip = cardUsingUser.characterData.equips.includes(useCardType);

  const responsePayload = {
    cardEffectNotification: {
      cardType: useCardType,
      userId: cardUsingUser.id,
      success: hasEquip,
    },
  };

  currentGame.users.forEach((user) => {
    user.socket.write(createResponse(PACKET_TYPE.CARD_EFFECT_NOTIFICATION, 0, responsePayload));
  });
};

// setTimeout(() => {
//   console.log('장비삭제!');
//   cardUsingUser.removeEquip(useCardType);
//   const test = {
//     cardEffectNotification: {
//       cardType: useCardType,
//       userId: cardUsingUser.id,
//       success: true,
//     },
//   };
//   currentGame.users.forEach((user) => {
//     user.socket.write(createResponse(PACKET_TYPE.CARD_EFFECT_NOTIFICATION, 0, test));
//   });
// }, 5000);

/**
 * 
 * message S2CCardEffectNotification {
    CardType cardType = 1;
    int64 userId = 2;
    bool success = 3;
}
 */
