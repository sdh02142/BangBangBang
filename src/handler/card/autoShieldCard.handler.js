export const autoShieldHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  cardUsingUser.addEquip(useCardType);
};
