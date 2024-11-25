import {
  getStateBbangShooter,
  getStateBbangTarget,
  getStateNormal,
  getStateDeathInitShooter,
  getStateDeathInitTarget,
} from '../../constants/stateType.js';
import { Packets } from '../../init/loadProtos.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';

// bbang 카드랑 실드 카드가 좀 특수한 경우가 있어서 어떻게 나눠야 할지 고민중
export const bbangCardHandler = (cardUsingUser, targetUser, currentGame) => {
  // TODO: user.prevState가 NONE이면 일반 빵야 핸들러, 현피면 현피 핸들러 호출하기
  if (cardUsingUser.characterData.stateInfo.state === Packets.CharacterStateType.NONE_CHARACTER_STATE) {
    normalBbangHandler(cardUsingUser, targetUser, currentGame);
  } else if (cardUsingUser.characterData.stateInfo.state === Packets.CharacterStateType.DEATH_MATCH_TURN_STATE) {
    deathMatchBbangHandler(cardUsingUser, targetUser, currentGame);
  }
};

const deathMatchBbangHandler = (cardUsingUser, targetUser, currentGame) => {
  currentGame.events.cancelEvent(cardUsingUser.id, 'onDeathMatch');
  currentGame.events.scheduleEvent(targetUser.id, 'onDeathMatch', 5000, { cardUsingUser, targetUser, stateNormal: getStateNormal(), userUpdateNotification, currentGameUsers: currentGame.users})

  // 시전자 state 변경(빵야 카드 사용 시: 현피 기다림)
  cardUsingUser.setCharacterState(getStateDeathInitShooter(targetUser.id));
  // 대상자 state 변경(현피 대상: 빵야 카드 소지 여부 및 사용 여부)
  targetUser.setCharacterState(getStateDeathInitTarget(cardUsingUser.id));
}

const normalBbangHandler = (cardUsingUser, targetUser, currentGame) => {
  const currentGameUsers = currentGame.users;
  // TODO: 이것도 나중에 cardUsingUser.canUseBbang() 이런식으로 구현
  //    이유: user에 this.maxBbangCount를 추가 해두고 내부적으로 처리하는 게 좋을 것 같기 때문
  if (cardUsingUser.canUseBbang()) {
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

  // 실드가 있는 경우 로직
  // 사용 시간 기다려야 함.
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
  // TODO: event emitter로 리팩토링
  // const eventId = setTimeout(() => {
  //   // 실드 사용 대기시간(time)이 지났는데 아무 이벤트도 오지 않은 경우.
  //   // 실드 사용을 하게 되면 아래의 case Packets.CardType.SHIELD 부분에 걸릴테니 거기선 clearTimeout으로 직접 지워주기
  //   const index = currentGame.eventQueue.findIndex((e) => {
  //     return e.targetId === targetUser.id;
  //   });

  //   if (index !== -1) {
  //     currentGame.eventQueue.splice(index, 1);
  //   }

  //   // 빵야 사용 유저, 쉴드 사용 유저 state 원상복귀
  //   cardUsingUser.setCharacterState(getStateNormal());
  //   // 대상자 state 변경
  //   targetUser.setCharacterState(getStateNormal());

  //   targetUser.decreaseHp();

  //   // 유저 정보 동기화
  //   userUpdateNotification(currentGame.users);
  // }, 5000);
  // currentGame.eventQueue.push({ id: eventId, targetId: targetUser.id });

  console.log('빵야 당한 사람:', targetUser.id);
};
