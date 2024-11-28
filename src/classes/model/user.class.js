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

    this.maxBbangCount = 0; // 나중에 prepare에서 캐릭터 특성에 따라 처리, 게임 진행 도중 장비에 따라 증감/ 원래 상태를 저장해두는 형태는 어떤지?
    this.damage = 1;
  }

  equipWepon(weapon) {
    switch (weapon) {
      case Packets.CardType.HAND_GUN:
        this.characterData.bbangCount -= 1;
        this.maxBbangCount -= 1;
        break;
      case Packets.CardType.DESERT_EAGLE:
        this.damage = 2;
        break;
      case Packets.CardType.AUTO_RIFLE:
        this.characterData.bbangCount -= 10;
        this.maxBbangCount -= 10;
        break;
      case Packets.CardType.SNIPER_GUN:
        break;
    }
    this.setWeapon(weapon);
  }

  unequipWepon() {
    switch (this.characterData.weapon) {
      case Packets.CardType.HAND_GUN:
        this.characterData.bbangCount += 1;
        this.maxBbangCount += 1;
        break;
      case Packets.CardType.DESERT_EAGLE:
        this.damage = 1;
        break;
      case Packets.CardType.AUTO_RIFLE:
        this.characterData.bbangCount += 10;
        this.maxBbangCount += 10;
        break;
      case Packets.CardType.SNIPER_GUN:
        break;
    }
    this.setWeapon(0);
  }

  overHandedCount() {
    console.log(`현재 카드 수: ${this.characterData.handCardsCount}`);
    console.log(`현재 HP: ${this.characterData.hp}`);
    return this.characterData.handCardsCount - this.characterData.hp;
  }

  resetBbangCount() {
    this.characterData.bbangCount = this.maxBbangCount;
  }

  // 빵 카운트가 음수로 클라에서 처리되고 있음
  // 맥스가 음수로 더 내려갈 수록 빵야 쏠 수 있는 횟수가 늘어남
  canUseBbang() {
    // true를 반환했을때 빵 가능
    return (
      0 >= this.characterData.bbangCount && this.characterData.bbangCount >= this.maxBbangCount
    );
  }

  setMaxBbangCount(count) {
    this.maxBbangCount = count;
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
  // 캐릭터 설정
  setCharacter(characterType) {
    switch (characterType) {
      case Packets.CharacterType.RED:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = -40;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-40); // max치 빵야 횟수 설정
        break;
      case Packets.CharacterType.SHARK:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-1);
        break;
      case Packets.CharacterType.MALANG:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-1);
        break;
      case Packets.CharacterType.FROGGY:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-1);
        break;
      case Packets.CharacterType.PINK:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-1);
        break;
      // 물안경군 캐릭터 특성은 클라에서 처리
      case Packets.CharacterType.SWIM_GLASSES:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-1);
        break;
      case Packets.CharacterType.MASK:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-1);
        break;
      // 공룡이 캐릭터 특성은 클라에서 처리
      case Packets.CharacterType.DINOSAUR:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 3;
        this.setMaxBbangCount(-1);
        break;
      case Packets.CharacterType.PINK_SLIME:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 3;
        this.setMaxBbangCount(-1);
        break;
    }
  }

  setHp(hp) {
    this.characterData.hp = hp;
  }

  increaseHp() {
    if (this.characterData.hp >= this.maxHp) {
      return false;
    }

    this.characterData.hp += 1;
    return true;
  }

  decreaseHp(damage = 1) {
    this.characterData.hp -= damage;
  }

  setWeapon(weapon) {
    this.characterData.weapon = weapon;
  }

  setCharacterPrevState(characterStateType) {
    this.characterData.stateInfo.prevState = characterStateType;
  }

  getCharacterPrevState() {
    return this.characterData.stateInfo.prevState;
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
    if (this.characterData.equips.includes(equip) || this.characterData.equips.length >= 4) {
      return;
    }
    this.characterData.equips.push(equip);
  }

  removeEquip(equip) {
    const index = this.characterData.equips.findIndex((element) => element === equip);
    if (index !== -1) {
      this.characterData.equips.splice(index, 1);
    }
  }

  addDebuff(debuff) {
    this.characterData.debuffs.push(debuff);
  }

  addHandCard(addCard) {
    const index = this.characterData.handCards.findIndex((card) => card.type === addCard);

    // { type: enum, count: 1} enum값이 handCards에 존재하면 count++
    // 존재하지 않으면 addHandCard({ type: newType, count: 1})
    if (index !== -1) {
      const cnt = this.characterData.handCards[index].count++;
    } else {
      const tmp = {
        type: addCard,
        count: 1,
      };
      this.characterData.handCards.push(tmp);
    }
    this.increaseHandCardsCount();
  }

  selectRandomHandCard() {
    const randomIndex = Math.floor(Math.random() * this.characterData.handCards.length);
    return this.characterData.handCards[randomIndex].type;
  }

  removeHandCard(usingCard) {
    console.log(`${usingCard} 삭제`);
    const index = this.characterData.handCards.findIndex((card) => card.type === usingCard);

    // { type: enum, count: 1} enum값이 handCards에 존재하면 count++
    // 존재하지 않으면 addHandCard({ type: newType, count: 1})
    // count-- => count === 0 객체를 아예 삭제
    if (index !== -1) {
      const cnt = this.characterData.handCards[index].count--;
      this.decreaseHandCardsCount(); // removeHandCard에서 카드 카운트를 한 번 더해버려 손패 개수가 카드 한 장 사용할 때마다 2장씩 빠짐
      if (cnt === 0) {
        // 남은 카드 없음
        this.characterData.handCards.splice(index, 1);
      }
    }
  }

  removeEquipCard(usingCard) {
    console.log(`${usingCard} 삭제`)
    const index = this.characterData.equips.findIndex((card) => card.type === usingCard);

    // { type: enum, count: 1} enum값이 handCards에 존재하면 count++
    // 존재하지 않으면 addHandCard({ type: newType, count: 1})
    // count-- => count === 0 객체를 아예 삭제
    if (index !== -1) {
      const cnt = this.characterData.equips[index].count--;
      if (cnt === 0) {
        // 남은 카드 없음
        this.characterData.equips.splice(index, 1);
      }
    }
  }

  removeDebuffCard(usingCard) {
    console.log(`${usingCard} 삭제`)
    const index = this.characterData.debuffs.findIndex((card) => card.type === usingCard);

    // { type: enum, count: 1} enum값이 handCards에 존재하면 count++
    // 존재하지 않으면 addHandCard({ type: newType, count: 1})
    // count-- => count === 0 객체를 아예 삭제
    if (index !== -1) {
      const cnt = this.characterData.debuffs[index].count--;
      if (cnt === 0) {
        // 남은 카드 없음
        this.characterData.debuffs.splice(index, 1);
      }
    }
  }

  // TEST: 테스트용임
  logUserHandCards() {
    console.log(`[${this.id}] ${this.nickname}의 핸드 카드`);
    console.dir(this.characterData.handCards, { depth: null });
  }

  hasShieldCard() {
    const shieldCard = this.characterData.handCards.find((card) => {
      return card.type === Packets.CardType.SHIELD;
    });
    console.log('유저의 핸드 카드들:', this.characterData.handCards);

    return shieldCard ? true : false;
  }

  hasBbangCard() {
    const shieldCard = this.characterData.handCards.find((card) => {
      return card.type === Packets.CardType.BBANG;
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
        alive: this.characterData.alive,
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
