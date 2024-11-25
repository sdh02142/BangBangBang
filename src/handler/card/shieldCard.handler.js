import { getStateNormal } from '../../constants/stateType.js';

export const shieldCardHandler = (cardUsingUser, targetUser, currentGame) => {
  console.log('쉴드 쓴 사람:', cardUsingUser.id);
  // 예약된 이벤트 삭제가 제대로 되지 않음
  // currentGame.removeEvent(cardUsingUser.id);
  console.log(currentGame.events.cancelEvent);
  currentGame.events.cancelEvent(cardUsingUser.id, 'finishShieldWait');
  currentGame.events.cancelEvent(cardUsingUser.id, 'finishShieldWaitOnBigBbang');

  cardUsingUser.setCharacterState(getStateNormal());
  targetUser.setCharacterState(getStateNormal());
  // TODO: animationNotification
};
