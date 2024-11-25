import { getStateNormal } from '../../constants/stateType.js';
import { Packets } from '../../init/loadProtos.js';

export const shieldCardHandler = (cardUsingUser, targetUser, currentGame) => {
  console.log('쉴드 쓴 사람:', cardUsingUser.id);
  
  if (cardUsingUser.characterData.stateInfo.state === Packets.CharacterStateType.BBANG_TARGET)
  {
    currentGame.events.cancelEvent(cardUsingUser.id, 'finishShieldWait');
  }

  if (cardUsingUser.characterData.stateInfo.state === Packets.CharacterStateType.BIG_BBANG_TARGET)
  {
    currentGame.events.cancelEvent(cardUsingUser.id, 'finishShieldWaitOnBigBbang');
  }
    
  cardUsingUser.setCharacterState(getStateNormal());
  targetUser.setCharacterState(getStateNormal());
};

