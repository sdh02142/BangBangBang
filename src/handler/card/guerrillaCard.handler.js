import {
  getStateGuerrillaShooter,
  getStateGuerrillaTarget,
  getStateNormal,
} from '../../constants/stateType.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';

export const guerrillaCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  currentGame.users.forEach((user) => {
    if (cardUsingUser.id !== user.id && 0 < user.characterData.hp) {
      //나를 제외한 살아있는 모두에게 피해 1
      //대상자 상태 변경
      cardUsingUser.setCharacterState(getStateGuerrillaShooter(user.id));
      user.setCharacterState(getStateGuerrillaTarget(cardUsingUser.id));
      currentGame.events.scheduleEvent(user.id, 'finishBbangWaitOnGuerrilla', 5000, {
        user,
        cardUsingUser,
        stateNormal: getStateNormal(),
        userUpdateNotification,
        currentGameUsers: currentGame.users,
      });
      console.log('게릴라 당한 사람:', user.id);
    }
  });
};
