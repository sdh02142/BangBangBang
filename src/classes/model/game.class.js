import { PACKET_TYPE } from '../../constants/header.js';
import phaseTime from '../../constants/phaseTime.js';
import { Packets } from '../../init/loadProtos.js';
import { phaseUpdateNotification } from '../../utils/notification/phaseUpdate.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';

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

    this.deck = null;

    this.currentPhaseTime = 0; // 게임 시작시 Date.now()
    this.nextPhaseAt = 0; // 게임 시작시 Date.now() + 180000
    // enum PhaseType {
    //     NONE_PHASE = 0;
    //     DAY = 1;
    //     EVENING = 2;
    //     END = 3;
    // }
    this.currentPhase = Packets.PhaseType.DAY;
    this.nextPhase = Packets.PhaseType.END;
  }

  changePhase(timeout) {
    console.log('다음 페이즈:', this.nextPhase);
    setTimeout(() => {
      const tmp = this.currentPhase;
      this.currentPhase = this.nextPhase;
      this.nextPhase = tmp;
      const responseNotification = phaseUpdateNotification(this);
      this.users.forEach((user) => {
        // 바뀐 현재 phase를 payload로 notification 생성 후 socket.write
        user.socket.write(
          createResponse(PACKET_TYPE.PHASE_UPDATE_NOTIFICATION, 0, responseNotification),
        );
      });
      this.changePhase(phaseTime[this.nextPhase]);
    }, timeout);
  }

  isFullRoom() {
    return parseInt(this.users.length) >= parseInt(this.maxUserNum) ? true : false;
  }

  addUser(user) {
    if (this.users.length >= this.maxUserNum) {
      console.error('방이 꽉 찼습니다.');
      return;
    }

    this.users.push(user);
  }

  removeUser(user) {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }

  gameStart() {
    this.state = Packets.RoomStateType.PREPARE;
  }
}

export default Game;
