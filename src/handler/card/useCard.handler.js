import { PACKET_TYPE } from '../../constants/header.js';
import { characterPositions } from '../../init/loadPositions.js';
import { Packets } from '../../init/loadProtos.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import { gameStartNotification } from '../../utils/notification/gameStart.notification.js';
import useCardNotification from '../../utils/notification/useCard.notification.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';

//캐릭터 정보
// 빨강이 (CHA00001) 하루에 원하는만큼 빵야!를 사용할 수 있다. // 캐릭터 데이터 설정할 때 BBangCount 추가 설정
// 상어군 (CHA00003) 빵야!를 막기 위해 쉴드 2개가 필요함. //
// 말랑이 (CHA00005) 생명력을 1 잃을 때마다 카드 한장을 획득한다. //
// 개굴군 (CHA00007) 표적이 될 때 25% 확률로 공격을 막는다. //
// 핑크군 (CHA00008) 남은 카드가 없으면 새로 카드를 한장 받는다. //
// 물안경군 (CHA00009) 추가로 두명의 위치가 미니맵에 표시 됨 (최대 4명) - 클라
// 가면군 (CHA00010) 다른 사람이 사망 시 장비중인 카드 포함 모든 카드를 손에 가져온다. //
// 공룡이 (CHA00012) 다른 유저에게서 미니맵 상 위치를 감춤 - 클라
// 핑크슬라임 (CHA00013) 피격 시 가해자의 카드를 한장 가져옴. //

//불꽃 버튼을 누르면 호출
export const useCardHandler = (socket, payload) => {
  const cardUsingUser = getUserBySocket(socket); //카드 사용자
  const userCardType = payload.useCardRequest.cardType; //사용 카드
  const userTargetUserId = payload.useCardRequest.targetUserId.low; //대상자 ID
  const inGame = findGameById(cardUsingUser.roomId);
  const inGameUsers = inGame.users // 게임 내 전체유저
  ////////////////////////////
  // 빵야 타겟이 되면 -> 유저 상태 업데이트 -> 쉴드 쓸래 말래? -> 사용하면 방어, 안하면 -1 -> 상태 업데이트
  // 빵야 타겟이 되면 움직이지 못하고 제자리에 고정 (5초)
  // 행동카드를 사용한 유저와 대상이 된 유저는 행동카드 사용이 종료 될 때 까지 움직일 수 없고, 다른 유저의 타겟이 될 수 없다.
  // (유저1이 유저2에게 발포 사용 시 쉴드 카드를 사용하거나 사용하지 않을 때 까지 정지상태. 선택 여부를 결정하는데 주어진 시간은 카드별로 3~5초)


  cardUsingUser.decreaseHandCardsCount() // 카드 사용자의 손에 들고 있던 카드 수 감소
  cardUsingUser.removeHandCard(userCardType) // 카드 사용자의 손에 들고 있던 카드 제거

  inGame.deck.append(userCardType) // 카드 덱으로 복귀
  
  // 5. 캐릭터 특성
  switch (userCardType) {
    case Packets.CardType.BBANG:
        // 빵야 카운트 확인 (TODO : prepare 핸들러나 Notification 단계에서 bbangCount를 기본값 1로 수정해야할 듯?)
        console.log("cardUsingUser.characterData.bbangCount:",cardUsingUser.characterData.bbangCount)
        //캐릭터 특성 체크 - 빨강군
        //장착카드 체크 - 핸드건, 자동소총
        if (cardUsingUser.characterData.bbangCount !== 0) { //쏠 수 있는 기회 x 쏜 횟수 
            // 빵야 카운트 없으면 return       
            const responsePayload = {
                useCardResponse: {
                  success: false,
                  failCode: Packets.GlobalFailCode.ALREADY_USED_BBANG,
                },
              };
            
              socket.write(createResponse(PACKET_TYPE.USE_CARD_RESPONSE, 0, responsePayload));
            return;
        }


        // 3. 빵야 카운트 변경 bbangCount + 1
        cardUsingUser.increaseBbangCount();
        // 4. 시전자 state 변경
        cardUsingUser.characterData.stateInfo.state = Packets.CharacterStateType.BBANG_SHOOTER;
        cardUsingUser.characterData.stateInfo.nextState = Packets.CharacterStateType.NONE_CHARACTER_STATE;
        cardUsingUser.characterData.stateInfo.nextStateAt = 5000;
        cardUsingUser.characterData.stateInfo.stateTargetUserId = userTargetUserId;
        // 대상자 state 변경 
        const index = inGameUsers.findIndex((user) => user.id === userTargetUserId)
        inGameUsers[index].characterData.stateInfo.state = Packets.CharacterStateType.BBANG_TARGET;
        inGameUsers[index].characterData.stateInfo.nextState = Packets.CharacterStateType.NONE_CHARACTER_STATE;
        inGameUsers[index].characterData.stateInfo.nextStateAt = 5000;
        inGameUsers[index].characterData.stateInfo.stateTargetUserId = 0;  // 빵야 맞는 대상자라 타겟 없음
        
    case Packets.CardType.BIG_BBANG:

    case Packets.CardType.SHIELD:

    case Packets.CardType.VACCINE: 
  }

  //여기서 유저 전체 데이터 중에 카드 사용자와 대상자의 state, nextState, nextStateAt, 카드,빵야카운트 등 변경 정보 담아서 ex) updateUserData
  inGame.users.forEach((user) => {
    //게임 방 안에 모든 유저들에게 카드 사용알림
    const useCardResponse = useCardNotification(userCardType, cardUsingUser, userTargetUserId);
    user.socket.write(createResponse(PACKET_TYPE.USE_CARD_NOTIFICATION, 0, useCardResponse));

    // 방에 있는 모두에게 UserUpdateNotification
    // message S2CUserUpdateNotification {
    // repeated UserData user = 1;
    // }
    const userUpdateResponse = userUpdateNotification(inGame.users) //updateUserData
    user.socket.write(createResponse(PACKET_TYPE.USER_UPDATE_NOTIFICATION, 0, userUpdateResponse));

  });

  const responsePayload = {
    useCardResponse: {
      success: true,
      failCode: Packets.GlobalFailCode.NONE_FAILCODE,
    },
  };

  socket.write(createResponse(PACKET_TYPE.USE_CARD_RESPONSE, 0, responsePayload));
};

// message C2SUseCardRequest {
//     CardType cardType = 1;
//     int64 targetUserId = 2; // 타겟 없으면 0
// }
// message S2CUseCardResponse { // 성공 여부만 반환하고 대상 유저 효과는 S2CUserUpdateNotification로 통지
//     bool success = 1;
//     GlobalFailCode failCode = 2;
// }
// message S2CUserUpdateNotification {
//     repeated UserData user = 1;
// }
// message S2CUseCardNotification {
//     CardType cardType = 1;
//     int64 userId = 2;
//     int64 targetUserId = 3; // 타겟 없으면 빈 값
// }

// enum CardType {
//     NONE = 0;
//     BBANG = 1; // 20장 ==============  적에게 총을 쏜다, 타겟 : 근처에 있는 유저
//     BIG_BBANG = 2; // 1장 ============ 자신을 제외한 모든 플레이어 난사 1데미지
//     SHIELD = 3; // 10장 ============== 빵야의 타겟이 되었을 때 막음
//     VACCINE = 4; // 6장 ================ 체력 1 회복
//     CALL_119 = 5; // 2장
//     DEATH_MATCH = 6; // 4장
//     GUERRILLA = 7; // 1장
//     ABSORB = 8; // 4장
//     HALLUCINATION = 9; // 4장
//     MATURED_SAVINGS = 11; // 2장
//     WIN_LOTTERY = 12; // 1장

//     FLEA_MARKET = 10; // 3장
//     SNIPER_GUN = 13; // 1장
//     HAND_GUN = 14; // 2장
//     DESERT_EAGLE = 15; // 3장
//     AUTO_RIFLE = 16; // 2장
//     LASER_POINTER = 17; // 1장
//     RADAR = 18; // 1장
//     AUTO_SHIELD = 19; // 2장
//     STEALTH_SUIT = 20; // 2장
//     CONTAINMENT_UNIT = 21; // 3장
//     SATELLITE_TARGET = 22; // 1장
//     BOMB = 23; // 1장
// }

//   Game {
//     id: 1,
//     ownerId: 6,
//     name: '개념있는 사람만',
//     maxUserNum: 7,
//     state: 1,
//     users: [
//       User {
//         id: 6,
//         nickname: 'test4',
//         socket: [Socket],
//         characterData: [CharacterData],
//         position: [Position],
//         roomId: 1
//       },
//       User {
//         id: 5,
//         nickname: 'test3',
//         socket: [Socket],
//         characterData: [CharacterData],
//         position: [Position],
//         roomId: 1
//       }
//     ],
//     deck: DoubleLinkedList {
//       head: Node { item: 1, prev: [Node], next: [Node] },
//       tail: Node { item: 15, prev: [Node], next: null },
//       size: 68
//     }
//   }
