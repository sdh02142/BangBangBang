import { Packets } from '../../init/loadProtos.js';

export const desertEagleCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  if (cardUsingUser.characterData.weapon !== 0) cardUsingUser.unequipWepon();
  cardUsingUser.equipWepon(Packets.CardType.DESERT_EAGLE);
};
