import CharacterData from './characterData.class.js';

// TODO: 완성
class User {
  constructor(id, nickname) {
    this.id = id; // 유저 이메일이나 아이디가 아니라 DB의 기본키를 사용
    this.nickname = nickname;
  
    this.characterData = new CharacterData();
  }
}

export default User;

// message UserData {
//     string id = 1;
//     string nickname = 2;
//     CharacterData character = 3;
// }