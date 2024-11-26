import { getStateNormal } from '../../constants/stateType.js';
import { Packets } from '../../init/loadProtos.js';

export const shieldCardHandler = (cardUsingUser, targetUser, currentGame) => {
  console.log('쉴드 쓴 사람:', cardUsingUser.id);

  if (cardUsingUser.characterData.stateInfo.state === Packets.CharacterStateType.BBANG_TARGET) {
    if (cardUsingUser.characterData.characterType == Packets.CharacterType.SHARK) {
      // 쉴드 카드 사용 request가 두번 날라오는 걸 체크할 수 있나??
      // 스택을 두번 쌓아야 cancelEvent되게끔
    } else {
      currentGame.events.cancelEvent(cardUsingUser.id, 'finishShieldWait');
    }
  }

  if (cardUsingUser.characterData.stateInfo.state === Packets.CharacterStateType.BIG_BBANG_TARGET) {
    currentGame.events.cancelEvent(cardUsingUser.id, 'finishShieldWaitOnBigBbang');
  }

  cardUsingUser.setCharacterState(getStateNormal());
  targetUser.setCharacterState(getStateNormal());
};
