import equipCardNotification from '../../utils/notification/equipCard.notification.js';

export const stealthSuitHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  cardUsingUser.addEquip(useCardType);
  equipCardNotification(useCardType, cardUsingUser.id);
  // cardEffectNotification(currentGame, useCardType, cardUsingUser);
};
