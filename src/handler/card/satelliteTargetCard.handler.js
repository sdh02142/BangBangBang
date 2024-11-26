import { Packets } from '../../init/loadProtos.js';

export const satelliteTargetCardHandler = (cardUsingUser, targetUser, currentGame) => {
    targetUser.characterData.debuffs.push(Packets.CardType.SATELLITE_TARGET);
  };
  