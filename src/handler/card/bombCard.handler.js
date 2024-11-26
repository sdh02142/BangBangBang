import { Packets } from '../../init/loadProtos.js';

export const bombCardHandler = (cardUsingUser, targetUser, currentGame) => {
    targetUser.characterData.debuffs.push(Packets.CardType.BOMB);
  };
  