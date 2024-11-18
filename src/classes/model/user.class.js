import CharacterData from './characterData.class.js';

// TODO: 완성
class User {
  constructor(id, nickname, socket) {
    // proto가 수정되었고, 따로 세션에서 해당 id를 발급해주는 식으로 처리, getUserByNickName 대신 getUserById를 사용 가능
    this.id = id;
    this.nickname = nickname;
    this.socket = socket;

    this.characterData = new CharacterData();

    this.roomId = null;
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
      }
    }
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