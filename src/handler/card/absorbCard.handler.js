import {
    getStateNormal,
    getStateAbsorbing,
    getStateAbsorbTarget,
  } from '../../constants/stateType.js';

export const absorbCardHandler = (cardUsingUser, targetUser, currentGame) => {
    cardUsingUser.setCharacterState(getStateAbsorbing(targetUser.id));
    targetUser.setCharacterState(getStateAbsorbTarget(cardUsingUser.id));
};