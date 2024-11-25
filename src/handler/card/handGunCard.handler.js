import { Packets } from '../../init/loadProtos.js';

export const handGunCardHandler = (cardUsingUser, targetUser, currentGame) => {
  cardUsingUser.equipWepon(Packets.CardType.HAND_GUN);
};
