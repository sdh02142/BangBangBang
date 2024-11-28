import {
  getStateBbangShooter,
  getStateBbangTarget,
  getStateNormal,
  getStateDeathInitShooter,
  getStateDeathInitTarget,
} from '../../constants/stateType.js';
import { Packets } from '../../init/loadProtos.js';
import { animationNotification } from '../../utils/notification/animation.notification.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';

export const bbangCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
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
  if (!cardUsingUser.canUseBbang()) {
    // 빵야 실패
    const errorResponse = {
      useCardResponse: {
        success: false,
        failCode: Packets.GlobalFailCode.ALREADY_USED_BBANG,
      },
    };
    return errorResponse;
  }

  // 여기서부터 빵야 사용 로직
  // 빵야 카운트 증가
  cardUsingUser.increaseBbangCount();
  const autoSheildSuccess = autoShieldCheck(targetUser, currentGame);

  console.log('오토 쉴드 체크', autoSheildSuccess);
  if (autoSheildSuccess) {
    //자동 방어 성공 시
  } else {
    //자동 방어 실패 시

    // 시전자 state 변경
    cardUsingUser.setCharacterState(getStateBbangShooter(targetUser.id));
    // 대상자 state 변경
    targetUser.setCharacterState(getStateBbangTarget(cardUsingUser.id));
    // 이벤트 등록
    currentGame.events.scheduleEvent(targetUser.id, 'finishShieldWait', 5000, {
      cardUsingUser,
      targetUser,
      stateNormal: getStateNormal(),
      userUpdateNotification,
      currentGameUsers,
    });

    const isLaserUser = cardUsingUser.characterData.equips.find((card) => {
      if (card === Packets.CardType.LASER_POINTER) return true;
    });

    if (cardUsingUser.characterData.characterType === Packets.CharacterType.SHARK && isLaserUser) {
      const needShield = 3;
      needShieldCheck(cardUsingUser, targetUser, currentGame, needShield); // 3
    } else if (
      cardUsingUser.characterData.characterType === Packets.CharacterType.SHARK ||
      isLaserUser
    ) {
      const needShield = 2;
      needShieldCheck(cardUsingUser, targetUser, currentGame, needShield); // 2
    }
  }

  console.log('빵야 당한 사람:', targetUser.id);
};

//캐릭터 특성 - 개굴군, 장비 특성 - 자동 방어
const autoShieldCheck = (targetUser, currentGame) => {
  const isAutoSheildUser = targetUser.characterData.equips.find((equipment) => {
    if (equipment === Packets.CardType.AUTO_SHIELD) return true;
  });

  if (isAutoSheildUser || targetUser.characterData.characterType === Packets.CharacterType.FROGGY) {
    //오토 쉴드 장비
    const autoSheild = Math.random();
    if (autoSheild < 0.99) {
      animationNotification(currentGame.users, targetUser, Packets.AnimationType.SHIELD_ANIMATION);
      return true;
    }
  }
  return false;
};

//캐릭터 특성 - 상어군, 장비 특성 - 레이저
const needShieldCheck = (cardUsingUser, targetUser, currentGame, needShield) => {
  const shieldCount = targetUser.characterData.handCards.find((card) => {
    if (card.type === Packets.CardType.SHIELD) {
      return card.count;
    } else {
      return 0;
    }
  });
  console.log(`쉴드 개수 ${shieldCount}`);

  if (shieldCount < needShield) {
    targetUser.decreaseHp(cardUsingUser.damage);
    //이벤트 캔슬
    currentGame.events.cancelEvent(cardUsingUser.id, 'finishShieldWait');
  }
};
