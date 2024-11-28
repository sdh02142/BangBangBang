import equipCardNotification from '../../utils/notification/equipCard.notification.js';

export const autoShieldHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  cardUsingUser.addEquip(useCardType);
  equipCardNotification(useCardType, cardUsingUser.id);
};
