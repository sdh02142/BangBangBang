import { Packets } from '../../init/loadProtos.js';

export const bombCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
    targetUser.characterData.debuffs.push(Packets.CardType.BOMB);
  };
  