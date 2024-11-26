import { Packets } from '../../init/loadProtos.js';

export const autoRifleCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  if (cardUsingUser.characterData.weapon !== 0) cardUsingUser.unequipWepon();
  cardUsingUser.equipWepon(Packets.CardType.AUTO_RIFLE);
};
