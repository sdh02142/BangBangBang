import {
    getStateNormal,
    getStateHallucinating,
    getStateHallucinationTarget,    
  } from '../../constants/stateType.js';

export const hallucinationCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
    cardUsingUser.setCharacterState(getStateHallucinating(targetUser.id));
    targetUser.setCharacterState(getStateHallucinationTarget(cardUsingUser.id));
};
