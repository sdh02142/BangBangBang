import { Packets } from '../../init/loadProtos.js';

export const handGunCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  if (cardUsingUser.characterData.weapon !== 0) cardUsingUser.unequipWepon();
  cardUsingUser.equipWepon(Packets.CardType.HAND_GUN);
};
