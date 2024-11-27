import { Packets } from '../../init/loadProtos.js';

export const sniperGunCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  if (cardUsingUser.characterData.weapon !== 0) cardUsingUser.unequipWepon();
  cardUsingUser.equipWepon(Packets.CardType.SNIPER_GUN);
};
