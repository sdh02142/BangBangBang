import path from 'path';
import protobuf from 'protobufjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const protoPath = path.resolve(__dirname, '../protobuf/game.proto');

export let GamePacket = null;
export let GlobalFailCode = null;
export let WarningType = null;
export let WinType = null;
export let CharacterType = null;
export let CharacterStateType = null;
export let CardType = null;
export let RoleType = null;
export let RoomStateType = null;
export let PhaseType = null;
export let ReactionType = null;
export let SelectCardType = null;
export let AnimationType = null;

export const loadProto = async () => {
  try {
    const root = await protobuf.load(protoPath);
    GamePacket = root.lookupType('GamePacket');

    if (GamePacket) {
      console.log('GamePacket 로드 성공');
    }

    // TODO: enum 값들 로드하는 부분 리펙토링
    GlobalFailCode = root.lookupEnum('GlobalFailCode');
    WarningType = root.lookupEnum('WarningType');
    WinType = root.lookupEnum('WinType');
    CharacterType = root.lookupEnum('CharacterType');
    CharacterStateType = root.lookupEnum('CharacterStateType');
    CardType = root.lookupEnum('CardType');
    RoleType = root.lookupEnum('RoleType');
    RoomStateType = root.lookupEnum('RoomStateType');
    PhaseType = root.lookupEnum('PhaseType');
    ReactionType = root.lookupEnum('ReactionType');
    SelectCardType = root.lookupEnum('SelectCardType');
    AnimationType = root.lookupEnum('AnimationType');
    // TODO: 로드 된 enum 값들 null 체크
  } catch (err) {
    console.error(`proto 파일 로드 중 오류 발생: ${err}`);
    process.exit(1);
  }
};
