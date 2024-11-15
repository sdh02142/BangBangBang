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

  getId () {
    return this.id;
  }

  setId (id) {
    this.id = id;
  }

  getNickname () {
    return this.nickname;
  }

  setNickname (nickname) {
    this.nickname = nickname;
  }

  getCharacterData () {
    return this.characterData;
  }

  setCharacterData (characterData) {
    this.characterData = characterData;
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