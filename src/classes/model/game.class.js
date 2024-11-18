import { RoomStateType } from '../../init/loadProtos.js';

// 1. 방 === 게임 <--- 기존 강의나 전 팀플에서 썼던 game세션과 game 클래스 같이 써도 되지않을까?
class Game {
  constructor(id, ownerId, name, maxUserNum) {
    this.id = id;
    this.ownerId = ownerId;
    this.name = name; // 방제목
    this.maxUserNum = maxUserNum;

    // gameStartRequest -> gamePrepareNotification -> gameStart
    // 방에 아무도 못들어온다 --> PREPARE --> GamePrepareNotification이 날라올 때
    // WAIT, PREPARE, INAGAME
    this.state = 0; // 초기값 <-- 생성 기준이니 WAIT (0)
    this.users = []; // UserData가 들어감 <-- User 클래스에서 CharacterData 관리하기
  }
  getId () {
    return this.id;
  }

  setId (id) {
    this.id = id;
  }

  getOwnerId () {
    return this.ownerId;
  }

  setOwnerId (ownerId) {
    this.ownerId = ownerId;
  }

  getName () {
    return this.name;
  }

  setName (name) {
    this.name = name;
  }

  getMaxUserNum () {
    return this.getMaxUserNum;
  }

  setMaxUserNum (maxUserNum) {
    this.maxUserNum = maxUserNum;
  }

  getState () {
    return this.state;
  }

  setState (state) {
    this.state = state;
  }

  getUsers () {
    return this.users;
  }

  setUsers (users) {
    this.users = users;
  }

  isFullRoom() {
    return (parseInt(this.users.length) >= parseInt(this.maxUserNum)) ? true : false;    
  }
  
  addUser(user) {
    if (this.users.length >= this.maxUserNum) {
      console.error('방이 꽉 찼습니다.');
      // TODO: JOIN_ROOM_FAILED 관련해서 에러 응답 보내기
      // user.socket.write()
      return;
    }

    this.users.push(user);
  }

  removeUser(user) {
    const index = this.users.findIndex((u) => u.id === user.id )
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }

  // 게임 준비 관련해서 튜터님께 <--- GameStartRequest, GameStartResponse가 방 참여해서 준비하는게 맞는지
  gameStart() {
    this.roomStateType = 2;
    // 게임 시작 시 모든 유저한테 게임 시작 알림
    this.users.forEach((user) => {
      // 게임 시작 notification
      // user.socket.write()
    });
  }
}

export default Game;
