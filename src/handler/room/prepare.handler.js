import DoubleLinkedList from '../../classes/datastructure/doubleLinkedList.js';
import { cardDeck } from '../../constants/cardDeck.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import { gamePrepareNotification } from '../../utils/notification/gamePrepare.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';
import shuffle from '../../utils/shuffle.js';

export const gamePrepareHandler = (socket, payload) => {
  try {
    const ownerUser = getUserBySocket(socket);
    // 방장 존재 여부
    if (!ownerUser) {
      console.error('방장을 찾을 수 없습니다.');
      const errorResponse = {
        gamePrepareResponse: {
          success: false,
          failCode: Packets.GlobalFailCode.NOT_ROOM_OWNER,
        },
      };
      socket.write(createResponse(PACKET_TYPE.GAME_PREPARE_RESPONSE, 0, errorResponse));
      return;
    }

    // 게임 존재 여부
    const currentGame = findGameById(ownerUser.roomId);
    if (!currentGame) {
      console.error('게임을 찾을 수 없습니다.');
      const errorResponse = {
        gamePrepareResponse: {
          success: false,
          failCode: Packets.GlobalFailCode.INVALID_ROOM_STATE,
        },
      };
      socket.write(createResponse(PACKET_TYPE.GAME_PREPARE_RESPONSE, 0, errorResponse));
      return;
    }

    // roomStateType --> PREPARE
    currentGame.gameStart();
    console.log('현재 게임 정보:', currentGame);

    /* TODO:
        *  1. 캐릭터 셔플(CharacterType) - 완료
        *  2. 덱 셔플 후 카드 배분 - 캐릭터 HP만큼(user.hp) user.addHandCards(card)
                - Packets.CardType
        *  3. 역할 배분(RoleType) - 완료
        *  4. CharacterType에 맞게 hp 설정 - 완료
        */

    const inGameUsers = currentGame.users;

    // 캐릭터 셔플
    const characterList = [
      { type: Packets.CharacterType.RED, hp: 4 },
      { type: Packets.CharacterType.SHARK, hp: 4 },
      { type: Packets.CharacterType.MALANG, hp: 4 },
      { type: Packets.CharacterType.FROGGY, hp: 4 },
      { type: Packets.CharacterType.PINK, hp: 4 },
      { type: Packets.CharacterType.SWIM_GLASSES, hp: 4 },
      { type: Packets.CharacterType.MASK, hp: 4 },
      { type: Packets.CharacterType.DINOSAUR, hp: 3 },
      { type: Packets.CharacterType.PINK_SLIME, hp: 3 },
    ];

    const shuffledCharacter = shuffle(characterList).splice(0, inGameUsers.length);
    inGameUsers.forEach((user, i) => {
      user.setCharacterType(shuffledCharacter[i].type);
      user.setHp(shuffledCharacter[i].hp);
      // user.increaseBbangCount();
      // if (user.characterData.characterType === Packets.characterType.RED) {
      // }
    });

    // 1.RoleTypes[inGameUsers.length]
    // 2.셔플(RoleType)
    // 3.플레이어한테 부여 array.pop
    const roleTypes = {
      //타겟 - 보안관, 보디가드 - 부관, 히트맨 - 무법자, 싸이코패스 - 배신자
      2: [Packets.RoleType.TARGET, Packets.RoleType.HITMAN],
      3: [Packets.RoleType.TARGET, Packets.RoleType.HITMAN, Packets.RoleType.PSYCHOPATH],
      4: [
        Packets.RoleType.TARGET,
        Packets.RoleType.HITMAN,
        Packets.RoleType.HITMAN,
        Packets.RoleType.PSYCHOPATH,
      ],
      5: [
        Packets.RoleType.TARGET,
        Packets.RoleType.BODYGUARD,
        Packets.RoleType.HITMAN,
        Packets.RoleType.HITMAN,
        Packets.RoleType.PSYCHOPATH,
      ],
      6: [
        Packets.RoleType.TARGET,
        Packets.RoleType.BODYGUARD,
        Packets.RoleType.HITMAN,
        Packets.RoleType.HITMAN,
        Packets.RoleType.HITMAN,
        Packets.RoleType.PSYCHOPATH,
      ],
      7: [
        Packets.RoleType.TARGET,
        Packets.RoleType.BODYGUARD,
        Packets.RoleType.BODYGUARD,
        Packets.RoleType.HITMAN,
        Packets.RoleType.HITMAN,
        Packets.RoleType.HITMAN,
        Packets.RoleType.PSYCHOPATH,
      ],
    };

    // roleType 배분
    const roleTypeClone = roleTypes[inGameUsers.length];
    const shuffledRoleType = shuffle(roleTypeClone);
    inGameUsers.forEach((user, i) => {
      user.setCharacterRoleType(shuffledRoleType[i]);
      if (user.characterData.roleType === Packets.RoleType.TARGET) {
        user.increaseHp();
      }
    });

    // 카드 (총 77장) 분배 / 몇장씩 분배할거냐 : 1장씩?
    // 카드덱에서는 pop -> 플레이어 손 push
    // head랑 tail Double Linked List
    const shuffledCardsArr = shuffle(cardDeck);
    const deck = new DoubleLinkedList();
    shuffledCardsArr.forEach((element) => {
      deck.append(element);
    });
    console.log(deck);

    // 카드 배분
    inGameUsers.forEach((user) => {
      // 1. 임시로 사람별 덱 구성
      const tmp = [];

      for (let i = 0; i < user.characterData.hp; i++) {
        const card = deck.removeFront();
        tmp.push(card);
        // user.addHandCard(card); // card === type
        // { type: card, count: 1}
        user.increaseHandCardsCount();
      }
      // 2. 한 번에 추가
      const result = transformData(tmp);
      // user.characterData.handCards = result;
      // WARN: Test code
      user.characterData.handCards = [
        { type: Packets.CardType.CALL_119, count: 2 },
        { type: Packets.CardType.BBANG, count: 2 },
      ];
    });

    // 유저들한테 손패 나눠주고 게임 객체에 덱 저장
    currentGame.deck = deck;

    // Notification에서 보내면 안되는 것: 본인이 아닌 handCards, target을 제외한 roleType
    // 카드 배분은 정상적으로 하고, 보내지만 않기
    // 방 유저에게 알림(gamePrepareNotification)
    inGameUsers.forEach((user) => {
      user.maxHp = user.characterData.hp;
      const notificationPayload = gamePrepareNotification(currentGame, user);
      user.socket.write(
        createResponse(PACKET_TYPE.GAME_PREPARE_NOTIFICATION, 0, notificationPayload),
      );
    });

    const preparePayload = {
      gamePrepareResponse: {
        success: true,
        failCode: Packets.GlobalFailCode.NONE_FAILCODE,
      },
    };

    socket.write(createResponse(PACKET_TYPE.GAME_PREPARE_RESPONSE, 0, preparePayload));
    console.log('게임 시작 response 전송 완료');
  } catch (err) {
    console.error(err);
  }
};

const transformData = (data) => {
  const typeCountMap = new Map();

  // 각 타입의 개수를 Map에 집계
  data.forEach((type) => {
    if (typeCountMap.has(type)) {
      typeCountMap.set(type, typeCountMap.get(type) + 1);
    } else {
      typeCountMap.set(type, 1);
    }
  });

  // Map 데이터를 { type, count } 형태의 객체 배열로 변환
  const result = Array.from(typeCountMap, ([type, count]) => ({ type, count }));

  return result;
};

/* 게임 시작 전 역할 및 캐릭터 셔플하여 결정 후 클라로 전송
message C2SGamePrepareRequest {

}

message S2CGamePrepareResponse {
    bool success = 1;
    GlobalFailCode failCode = 2;
}
    
enum RoleType {           (2인: 타겟1, 히트맨1)
    NONE_ROLE = 0;        (3인: 타겟1, 히트맨1, 싸이코패스1)
    TARGET = 1;           (4인: 타겟1, 히트맨2, 싸이코패스1)
    BODYGUARD = 2;        (5인: 타겟1, 보디가드1, 히트맨2, 싸이코패스1)
    HITMAN = 3;           (6인: 타겟1, 보디가드1, 히트맨3, 싸이코패스1)
    PSYCHOPATH = 4;       (7인: 타겟1, 보디가드2, 히트맨3, 싸이코패스1)
}
1.RoleType[inGameUsers.length]
2.셔플(RoleType)
3.플레이어한테 부여 array.pop

const RoleType = {
    2: [Packets.RoleType.TARGET, Packets.RoleType.HITMAN], 
    3: [Packets.RoleType.TARGET, Packets.RoleType.HITMAN, Packets.RoleType.PSYCHOPATH], 
    4: [Packets.RoleType.TARGET, Packets.RoleType.HITMAN, Packets.RoleType.HITMAN, Packets.RoleType.PSYCHOPATH],
    5: [Packets.RoleType.TARGET, Packets.RoleType.BODYGUARD, Packets.RoleType.HITMAN, Packets.RoleType.HITMAN, PSYCHOPATH],
    6: [Packets.RoleType.TARGET, Packets.RoleType.BODYGUARD, Packets.RoleType.HITMAN, Packets.RoleType.HITMAN, HITMAN, PSYCHOPATH],
    7: [Packets.RoleType.TARGET, Packets.RoleType.BODYGUARD, Packets.RoleType.BODYGUARD, Packets.RoleType.HITMAN, Packets.RoleType.HITMAN, Packets.RoleType.HITMAN, Packets.RoleType.PSYCHOPATH],
}
    
enum CharacterType {
    NONE_CHARACTER = 0;
    RED = 1; // 빨강이              (id: 1, hp: 4, phase 빵야 제한 없음)
    SHARK = 3; // 상어군            (id: 3, hp: 4, 상대 유저는 쉴드 2개 필요)
    MALANG = 5; // 말랑이           (id: 5, hp: 4, 생명력 1 감소마다 카드 1장 획득)
    FROGGY = 7; // 개굴군           (id: 7, hp: 4, 표적이 될 때, 25%로 공격 방어)
    PINK = 8; // 핑크군             (id: 8, hp: 4, 남은 카드가 없을 시 카드 1장 획득)
    SWIM_GLASSES = 9; // 물안경군   (id: 9, hp: 4, 미니맵에 2명의 위치가 표시됨[최대 4명까지])
    MASK = 10; // 가면군            (id: 10, hp: 4, 다른 사람이 사망 시 장비중인 카드 포함 모든 카드 획득)
    DINOSAUR = 12; // 공룡이        (id: 12, hp: 3, 다른 유저들에게서 미니맵 상 위치 숨김)
    PINK_SLIME = 13; // 핑크슬라임  (id: 13, hp: 3, 피격 시 가해자의 카드 1장 획득)
}
*/
/*
const characterType = [
{type: Packets.CharacterType.RED, hp: 4},
{type: Packets.CharacterType.SHARK, hp: 4},
{type: Packets.CharacterType.MALANG, hp: 4},
{type: Packets.CharacterType.FROGGY, hp: 4},
{type: Packets.CharacterType.PINK, hp: 4},
{type: Packets.CharacterType.SWIM_GLASSES, hp: 4},
{type: Packets.CharacterType.MASK, hp: 4},
{type: Packets.CharacterType.DINOSAUR, hp: 3},
{type: Packets.CharacterType.PINK_SLIME, hp: 3},
]
*/
