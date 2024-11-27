import {
    getStateNormal,
    getStateContained,
  } from '../../constants/stateType.js';

export const containmentUnitCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
    targetUser.characterData.debuffs.push(Packets.CardType.CONTAINMENT_UNIT);
    targetUser.setCharacterState(getStateContained(cardUsingUser.id));
};