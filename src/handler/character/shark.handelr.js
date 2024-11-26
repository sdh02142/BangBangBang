import { getStateBbangShooter, getStateBbangTarget } from '../../constants/stateType.js';
import { Packets } from '../../init/loadProtos.js';

export const sharkHandler = (cardUsingUser, targetUser, game) => {
  // cardUsingUser: 빵야 사용자, targetUser: 상어군
  // 상어군 로직 추가
  // 빵야를 막으려면 쉴드 2개 필요
  if (targetUser.characterData.characterType === Packets.CharacterType.SHARK) {
    const shieldCount = targetUser.characterData.handCards.find((card) => {
      if (card.type === Packets.CardType.SHIELD) return card.count;
    });
    if (shieldCount < 2) {
      targetUser.decreaseHp();
    } else {
      targetUser.setCharacterState(getStateBbangTarget(cardUsingUser.id));
      // 이제 2개만 사용하게 하면 된다....
      // 이벤트 등록
      game.events.scheduleEvent(targetUser.id, 'finishShieldWaitShark', 5000, {
        cardUsingUser,
        targetUser,
        targetStateNormal: getStateBbangTarget(cardUsingUser.id),
        shooterStateNormal: getStateBbangShooter(targetUser.id),
        userUpdateNotification,
        currentGameUsers,
      });
    }
  }
};
