import EventEmitter from 'events';

class EventManager {
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.events = new Map();
  }

  init() {
    this.eventEmitter.on('finishShieldWait', (params) => {
      const { cardUsingUser, targetUser, stateNormal, userUpdateNotification, currentGameUsers } =
        params;
      cardUsingUser.setCharacterState(stateNormal);
      targetUser.setCharacterState(stateNormal);
      targetUser.decreaseHp(cardUsingUser.damage);
      userUpdateNotification(currentGameUsers);
      console.log('5초 지나서 이제 쉴드 못씀');
    });

    this.eventEmitter.on('finishSHieldWaitShark', (params) => {
      const {
        cardUsingUser,
        targetUser,
        targetStateNormal,
        shooterStateNormal,
        userUpdateNotification,
        currentGameUsers,
      } = params;
      cardUsingUser.setCharacterState(targetStateNormal);
      targetUser.setCharacterState(shooterStateNormal);
      targetUser.decreaseHp();
      userUpdateNotification(currentGameUsers);
      console.log('5초 지나서 이제 쉴드 못씀');
    });

    this.eventEmitter.on('finishShieldWaitOnBigBbang', (params) => {
      const { user, cardUsingUser, stateNormal, userUpdateNotification, currentGameUsers } = params;
      user.setCharacterState(stateNormal);
      cardUsingUser.setCharacterState(stateNormal);
      user.decreaseHp(1);
      userUpdateNotification(currentGameUsers);
    });

    this.eventEmitter.on('onDeathMatch', (params) => {
      const { cardUsingUser, targetUser, stateNormal, userUpdateNotification, currentGameUsers } =
        params;
      cardUsingUser.setCharacterState(stateNormal);
      targetUser.setCharacterState(stateNormal);
      targetUser.decreaseHp(1);
      userUpdateNotification(currentGameUsers);
    });

    this.eventEmitter.on('finishBbangWaitOnGuerrilla', (params) => {
      const { user, cardUsingUser, stateNormal, userUpdateNotification, currentGameUsers } = params;
      user.setCharacterState(stateNormal);
      cardUsingUser.setCharacterState(stateNormal);
      user.decreaseHp(1);
      userUpdateNotification(currentGameUsers);
    });
  }

  // 이벤트 예약
  // interval 매니저의 그 형태임
  scheduleEvent(userId, eventName, timeout, params = {}) {
    if (!this.events.has(userId)) {
      this.events.set(userId, new Map());
    }

    const userEvent = this.events.get(userId);
    const eventId = setTimeout(() => {
      // data를 넘겨받을 필요가 있으면 추가하기
      this.eventEmitter.emit(eventName, params);
      userEvent.delete(eventName);
      console.log(`[EVENT EMIT] ${userId}: ${eventName} 발동`);
    }, timeout);

    userEvent.set(eventName, eventId);
    console.log(`[EVENT SET] ${userId}: ${eventName} 등록됨.`);
  }

  cancelEvent(userId, eventName) {
    const userEvent = this.events.get(userId);
    // userId로 등록된 이벤트가 있다면
    if (userEvent && userEvent.has(eventName)) {
      clearTimeout(userEvent.get(eventName)); // 취소
      userEvent.delete(eventName); // 맵에서 제거
      console.log(`[CANCEL EVENT] ${userId}: ${eventName} 취소됨.`);
    } else {
      console.log(`[NOT FOUND] ${userId}: ${eventName}을 찾을 수 없음`);
    }
  }
}

export default EventManager;
