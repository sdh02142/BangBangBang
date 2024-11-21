import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';
import CharacterData from './characterData.class.js';
import Position from './position.class.js';

// TODO: 완성
class User {
  constructor(id, nickname, socket) {
    // proto가 수정되었고, 따로 세션에서 해당 id를 발급해주는 식으로 처리, getUserByNickName 대신 getUserById를 사용 가능
    this.id = id;
    this.nickname = nickname;
    this.socket = socket;

    this.characterData = new CharacterData();

    this.position = new Position();
    this.roomId = null;
    this.maxHp = null;
  }

  updatePosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  getX() {
    return this.position.x;
  }

  getY() {
    return this.position.y;
  }

  setCharacterType(characterType) {
    this.characterData.characterType = characterType;
  }

  setCharacterRoleType(roleType) {
    this.characterData.roleType = roleType;
  }

  setHp(hp) {
    this.characterData.hp = hp;
  }

  increaseHp() {
    this.characterData.hp += 1;
  }

  decreaseHp() {
    this.characterData.hp -= 1;
  }

  setWeapon(weapon) {
    this.characterData.weapon = weapon;
  }

  setCharacterStateType(characterStateType) {
    this.characterData.stateInfo.state = characterStateType;
  }

  setNextCharacterStateType(characterNextStateType) {
    this.characterData.stateInfo.nextState = characterNextStateType;
  }

  setNextStateAt(nextStateAt) {
    this.characterData.stateInfo.nextStateAt = nextStateAt;
  }

  setStateTargetUserId(stateTargetUserId) {
    this.characterData.stateInfo.stateTargetUserId = stateTargetUserId;
  }

  addEquip(equip) {
    this.characterData.equips.push(equip);
  }

  addDebuff(debuff) {
    this.characterData.debuffs.push(debuff);
  }

  addHandCard(card) {
    this.characterData.handCards.push(card);
  }

  removeHandCard(usingCard) {
    this.characterData.handCards = this.characterData.handCards.filter(
      (card) => card !== usingCard,
    );
  }

  hasShieldCard() {
    const shieldCard = this.characterData.handCards.find((card) => {
      return card.type === Packets.CardType.SHIELD;
    });
    console.log('유저의 핸드 카드들:', this.characterData.handCards);

    return shieldCard ? true : false;
  }

  userStateTimeout(state) {
    //nextStateAt
    const { inGameUsers, currentState, nextState, nextStateAt, targetUserId, time } = state;
    setTimeout(() => {
      this.characterData.stateInfo.state = currentState;
      this.characterData.stateInfo.nextState = nextState;
      this.characterData.stateInfo.nextStateAt = Date.now() + nextStateAt;
      this.characterData.stateInfo.stateTargetUserId = targetUserId;
      const userUpdateResponse = userUpdateNotification(inGameUsers); //updateUserData
      this.socket.write(
        createResponse(PACKET_TYPE.USER_UPDATE_NOTIFICATION, 0, userUpdateResponse),
      );
    }, time); // time초 뒤에 callback 실행
  }

  useShieldCard() {
    const shieldCard = this.characterData.handCards.find((card) => {
      return card.type === Packets.CardType.SHIELD;
    });

    console.log('실드 카드 사용');
    shieldCard.count--;
  }

  increaseBbangCount() {
    this.characterData.bbangCount += 1;
  }

  decreaseBbangCount() {
    this.characterData.bbangCount -= 1;
  }

  increaseHandCardsCount() {
    this.characterData.handCardsCount += 1;
  }

  decreaseHandCardsCount() {
    this.characterData.handCardsCount -= 1;
  }

  setCharacterState(state) {
    const { currentState, nextState, nextStateAt, targetUserId } = state;

    this.characterData.stateInfo.state = currentState;
    this.characterData.stateInfo.nextState = nextState;
    this.characterData.stateInfo.nextStateAt = nextStateAt;
    this.characterData.stateInfo.stateTargetUserId = targetUserId;
  }

  makeRawObject() {
    return {
      id: this.id,
      nickname: this.nickname,
      character: {
        characterType: this.characterData.characterType, // 1
        roleType: this.characterData.roleType, // 2
        hp: this.characterData.hp, // 3
        weapon: this.characterData.weapon,
        stateInfo: {
          state: this.characterData.stateInfo.state,
          nextState: this.characterData.stateInfo.nextState,
          nextStateAt: this.characterData.stateInfo.nextStateAt,
          stateTargetUserId: this.characterData.stateInfo.stateTargetUserId,
        },
        equips: this.characterData.equips,
        debuffs: this.characterData.debuffs,
        handCards: this.characterData.handCards, // 4
        bbangCount: this.characterData.bbangCount, // 5
        handCardsCount: this.characterData.handCardsCount, // this.characterData.handCards.length
      },
    };
  }
}

export default User;

// message UserData {
//     string id = 1;
//     string nickname = 2;
//     CharacterData character = 3;
// }

// message UserData {
//   int64 id = 1;
//   string nickname = 2;
//   CharacterData character = 3;
// }
