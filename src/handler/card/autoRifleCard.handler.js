import { Packets } from '../../init/loadProtos.js';

export const autoRifleCardHandler = (cardUsingUser, targetUser, currentGame) => {
  cardUsingUser.equipWepon(Packets.CardType.AUTO_RIFLE);
};
