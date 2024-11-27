import {
    getStateNormal,
    getStateAbsorbing,
    getStateAbsorbTarget,
  } from '../../constants/stateType.js';
  import { PACKET_TYPE } from '../../constants/header.js';
  import { createResponse } from '../../utils/response/createResponse.js';

export const absorbCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
    cardUsingUser.setCharacterState(getStateAbsorbing(targetUser.id));
    targetUser.setCharacterState(getStateAbsorbTarget(cardUsingUser.id));
};