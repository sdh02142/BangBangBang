import { Packets } from '../../init/loadProtos.js';

export const desertEagleCardHandler = (cardUsingUser, targetUser, currentGame) => {
  cardUsingUser.equipWepon(Packets.CardType.DESERT_EAGLE);
};
