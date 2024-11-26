import EventEmitter from 'events';
import { PACKET_TYPE } from '../../constants/header.js';
import phaseTime from '../../constants/phaseTime.js';
import { Packets } from '../../init/loadProtos.js';
import { phaseUpdateNotification } from '../../utils/notification/phaseUpdate.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';
import EventManager from '../manager/event.manager.js';
import IntervalManager from '../manager/interval.manager.js';

// 1. 방 === 게임 <--- 기존 강의나 전 팀플에서 썼던 game세션과 game 클래스 같이 써도 되지않을까?
// IntervalManager 게임 세션별로 하나씩 두고 얘가 낮밤 관리하게
class Game {
  constructor(id, ownerId, name, maxUserNum) {
    this.id = id;
    this.ownerId = ownerId;
    this.name = name; // 방제목
    this.maxUserNum = maxUserNum;

    // gameStartRequest -> gamePrepareNotification -> gameStart
    // 방에 아무도 못들어온다 --> PREPARE --> GamePrepareNotification이 날라올 때
    // WAIT, PREPARE, INAGAME
    this.state = Packets.RoomStateType.WAIT; // 초기값 <-- 생성 기준이니 WAIT (0)
    this.users = []; // UserData가 들어감 <-- User 클래스에서 CharacterData 관리하기
    this.usersNum = 0;
    this.fleaMarketUsers = [];

    this.deck = [];
    this.fleaMarketDeck=[];

    this.currentPhase = Packets.PhaseType.DAY;
    this.nextPhase = Packets.PhaseType.END;

    // this.eventQueue = [];
    this.events = new EventManager();
    this.events.init();
    this.intervalManager = new IntervalManager();
  }

  returnCardToDeck(cardType) {
    this.deck.push(cardType);
  }

  // 1. 3분 낮 -> 2분 45초 낮 -> 갑자기 30초 밤(카드버리기 안뜸)
  changePhase() {
    setTimeout(() => {
      const tmp = this.currentPhase;
      this.currentPhase = this.nextPhase;
      this.nextPhase = tmp;
      const responseNotification = phaseUpdateNotification(this);
      this.users.forEach((user) => {
        user.socket.write(
          createResponse(PACKET_TYPE.PHASE_UPDATE_NOTIFICATION, 0, responseNotification),
        );
      });
      this.changePhase();
    }, phaseTime[this.currentPhase]);
  }

  // removeEvent(cardUsingUserId) {
  //   const index = this.eventQueue.findIndex((e) => {
  //     console.log(cardUsingUserId);
  //     return e.targetId === cardUsingUserId;
  //   });

  //   if (index !== -1) {
  //     clearTimeout(this.eventQueue[index].id);
  //     this.eventQueue.splice(index, 1);
  //   }
  // }

  isFullRoom() {
    return parseInt(this.users.length) >= parseInt(this.maxUserNum) ? true : false;
  }

  isGamingRoom() {
    return this.state !== Packets.RoomStateType.WAIT;
  }

  addUser(user) {
    if (this.users.length >= this.maxUserNum) {
      console.error('방이 꽉 찼습니다.');
      return;
    }

    this.users.push(user);
  }

  findInGameUserById(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(user) {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }

  removeUserFromFleaMarket(user) {
    const index = this.fleaMarketUsers.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.fleaMarketUsers.splice(index, 1);
    }
  }

  gameStart() {
    this.state = Packets.RoomStateType.PREPARE;
    this.intervalManager.addGameEndNotification(this)
  }
}

export default Game;
