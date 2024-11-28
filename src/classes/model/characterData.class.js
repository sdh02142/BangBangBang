import { Packets } from '../../init/loadProtos.js';
import CharacterStateInfoData from './characterStateInfoData.class.js';
// import User from './user.class.js';

class CharacterData {
  constructor() {
    this.characterType = Packets.CharacterType.NONE_CHARACTER;
    this.roleType = Packets.RoleType.NONE_ROLE;
    this.hp = 0;
    this.weapon = 0;
    this.stateInfo = new CharacterStateInfoData(); // CharacterStateInfoData Object
    this.equips = []; // int32
    this.debuffs = []; // int32
    this.handCards = []; // CardData Object
    this.bbangCount = 0;
    this.handCardsCount = 0;
    this.alive = true;
  }
  // CardData를 이용하여 handCards 관련 매서드 고려
}

export default CharacterData;
// message CharacterData {
//     CharacterType characterType = 1;
//     RoleType roleType = 2;
//     int32 hp = 3;
//     int32 weapon = 4;
//     CharacterStateInfoData stateInfo = 5;
//     repeated int32 equips = 6;
//     repeated int32 debuffs = 7;
//     repeated CardData handCards = 8;
//     int32 bbangCount = 9;
//     int32 handCardsCount = 10;
// }
