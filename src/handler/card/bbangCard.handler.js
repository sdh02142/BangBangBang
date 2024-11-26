import {
  getStateBbangShooter,
  getStateBbangTarget,
  getStateNormal,
  getStateDeathInitShooter,
  getStateDeathInitTarget,
} from '../../constants/stateType.js';
import { Packets } from '../../init/loadProtos.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';

export const bbangCardHandler = (cardUsingUser, targetUser, currentGame) => {
  if (
    cardUsingUser.characterData.stateInfo.state === Packets.CharacterStateType.NONE_CHARACTER_STATE
  ) {
    normalBbangHandler(cardUsingUser, targetUser, currentGame);
  } else if (
    cardUsingUser.characterData.stateInfo.state ===
    Packets.CharacterStateType.DEATH_MATCH_TURN_STATE
  ) {
    deathMatchBbangHandler(cardUsingUser, targetUser, currentGame);
  } else if (
    cardUsingUser.characterData.stateInfo.state === Packets.CharacterStateType.GUERRILLA_TARGET
  ) {
    guerrillaBbangHandler(cardUsingUser, targetUser, currentGame);
  }
};

const guerrillaBbangHandler = (cardUsingUser, targetUser, currentGame) => {
  cardUsingUser.setCharacterState(getStateNormal());
  currentGame.events.cancelEvent(cardUsingUser.id, 'finishBbangWaitOnGuerrilla');
  targetUser.setCharacterState(getStateNormal());
};

const deathMatchBbangHandler = (cardUsingUser, targetUser, currentGame) => {
  currentGame.events.cancelEvent(cardUsingUser.id, 'onDeathMatch');
  currentGame.events.scheduleEvent(targetUser.id, 'onDeathMatch', 5000, {
    cardUsingUser,
    targetUser,
    stateNormal: getStateNormal(),
    userUpdateNotification,
    currentGameUsers: currentGame.users,
  });

  // 시전자 state 변경(빵야 카드 사용 시: 현피 기다림)
  cardUsingUser.setCharacterState(getStateDeathInitShooter(targetUser.id));
  // 대상자 state 변경(현피 대상: 빵야 카드 소지 여부 및 사용 여부)
  targetUser.setCharacterState(getStateDeathInitTarget(cardUsingUser.id));
};

const normalBbangHandler = (cardUsingUser, targetUser, currentGame) => {
  const currentGameUsers = currentGame.users;
  // useCardHandler 쪽으로 보내자
  // if (!cardUsingUser.canUseBbang()) {
  //   // 빵야 실패
  //   const errorResponse = {
  //     useCardResponse: {
  //       success: false,
  //       failCode: Packets.GlobalFailCode.ALREADY_USED_BBANG,
  //     },
  //   };
  //   return errorResponse;
  // }

  // 여기서부터 빵야 사용 로직
  // 빵야 카운트 증가
  cardUsingUser.increaseBbangCount();

  // 시전자 state 변경
  cardUsingUser.setCharacterState(getStateBbangShooter(targetUser.id));
  // 대상자 state 변경
  if (targetUser.characterData.characterType === Packets.CharacterType.SHARK) {
    const shieldCount = targetUser.characterData.handCards.filter(
      (card) => Packets.CardType.SHIELD === card,
    ).length;
    if (shieldCount != 2) {
      targetUser.setCharacterState(getStateBbangTarget(cardUsingUser.id));
      targetUser.decreaseHp();
      targetUser.setCharacterState(getStateNormal());
    } else {
      for (let i = 0; i < 2; i++) {
        targetUser.setCharacterState(getStateBbangTarget(cardUsingUser.id));
      }
    }
  } else {
    targetUser.setCharacterState(getStateBbangTarget(cardUsingUser.id));
  }

  // 이벤트 등록
  currentGame.events.scheduleEvent(targetUser.id, 'finishShieldWait', 5000, {
    cardUsingUser,
    targetUser,
    stateNormal: getStateNormal(),
    userUpdateNotification,
    currentGameUsers,
  });

  console.log('빵야 당한 사람:', targetUser.id);
};
