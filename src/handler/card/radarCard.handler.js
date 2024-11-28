// import { cardEffectNotification } from '../../utils/notification/cardEffect.notification.js';
import equipCardNotification from '../../utils/notification/equipCard.notification.js';

export const radarHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  cardUsingUser.addEquip(useCardType);
  equipCardNotification(useCardType, cardUsingUser.id);
  // cardEffectNotification(currentGame, useCardType, cardUsingUser);
};
