import { PACKET_TYPE } from '../../constants/header.js';
import {
  getStateBbangShooter,
  getStateBbangTarget,
  getStateBigBbangShooter,
  getStateBigBbangTarget,
  getStateNormal,
} from '../../constants/stateType.js';
import { Packets } from '../../init/loadProtos.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
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
  const inGameUsers = inGame.users; // 게임 내 전체유저
  const targetUser = inGame.findInGameUserById(userTargetUserId); // 타겟 유저
  const targetUsers = inGameUsers.filter((user) => user !== cardUsingUser); // 타겟이 될 유저들

  ////////////////////////////
  // 빵야 타겟이 되면 -> 유저 상태 업데이트 -> 쉴드 쓸래 말래? -> 사용하면 방어, 안하면 -1 -> 상태 업데이트
  // 빵야 타겟이 되면 움직이지 못하고 제자리에 고정 (5초)
  // 행동카드를 사용한 유저와 대상이 된 유저는 행동카드 사용이 종료 될 때 까지 움직일 수 없고, 다른 유저의 타겟이 될 수 없다.
  // (유저1이 유저2에게 발포 사용 시 쉴드 카드를 사용하거나 사용하지 않을 때 까지 정지상태. 선택 여부를 결정하는데 주어진 시간은 카드별로 3~5초)

  // 공통 로직
  cardUsingUser.decreaseHandCardsCount(); // 카드 사용자의 손에 들고 있던 카드 수 감소
  // TODO: 아마 형태가 {type: CardType.blah, count: n }일텐데, removeHandCard 테스트 필요
  cardUsingUser.removeHandCard(userCardType); // 카드 사용자의 손에 들고 있던 카드 제거
  // TODO: 덱에 복귀하는지 테스트 필요
  inGame.deck.append(userCardType); // 카드 덱으로 복귀

  const isFailed = handleCards(userCardType, cardUsingUser, targetUser, inGame);
  if (isFailed) {
    socket.write(createResponse(PACKET_TYPE.USE_CARD_RESPONSE, 0, isFailed));
    return;
  }
  //여기서 유저 전체 데이터 중에 카드 사용자와 대상자의 state, nextState, nextStateAt, 카드,빵야카운트 등 변경 정보 담아서 ex) updateUserData

  inGameUsers.forEach((user) => {
    //게임 방 안에 모든 유저들에게 카드 사용알림
    const useCardResponse = useCardNotification(userCardType, cardUsingUser, userTargetUserId);
    user.socket.write(createResponse(PACKET_TYPE.USE_CARD_NOTIFICATION, 0, useCardResponse));

    // 방에 있는 모두에게 UserUpdateNotification
    // message S2CUserUpdateNotification {
    // repeaed UserData user = 1;
    // }
  });
  userUpdateNotification(inGameUsers); //updateUserData

  const responsePayload = {
    useCardResponse: {
      success: true,
      failCode: Packets.GlobalFailCode.NONE_FAILCODE,
    },
  };

  socket.write(createResponse(PACKET_TYPE.USE_CARD_RESPONSE, 0, responsePayload));
};

const handleCards = (userCardType, cardUsingUser, targetUser, inGame, targetUsers) => {
  // 5. 캐릭터 특성
  switch (userCardType) {
    case Packets.CardType.BBANG:
      // 빵야 카운트 확인

      //캐릭터 특성 체크 - 빨강군
      //장착카드 체크 - 핸드건, 자동소총

      // 나중에 캐릭터 특성이나 장비 체크해서 설정
      const maxBbangCount = 0;
      if (cardUsingUser.characterData.bbangCount > maxBbangCount) {
        //쏠 수 있는 기회 x 쏜 횟수
        // 빵야 카운트 없으면 return
        return {
          useCardResponse: {
            success: false,
            failCode: Packets.GlobalFailCode.ALREADY_USED_BBANG,
          },
        };
      }

      // 3. 빵야 카운트 변경 bbangCount + 1
      cardUsingUser.increaseBbangCount();

      // 실드 없는 경우 <<< 바로 처리하고 return <<< fail 코드 없이, 아래쪽 노티들 다 보내고 끝
      // 실드가 있는 경우 <<< 실드 사용 대기 <<< 이 경우 state만 처리하고 사용 자체는 다음 card 사용 유저(이전 targetUser)한테 전가

      // 대상자 보유 카드 확인
      if (!targetUser.hasShieldCard()) {
        // 쉴드 미보유중
        // 시전자 state 변경
        cardUsingUser.setCharacterState(getStateBbangShooter(targetUser.id));
        // 대상자 hp 감소
        targetUser.decreaseHp();
        // 사용한 사람 경직 time값은 임시
        cardUsingUser.userStateTimeout({
          inGameUsers: inGame.users,
          ...getStateNormal(),
          time: 1000,
        });

        return;
      }

      // 실드가 있는 경우 > 빵야 쓴 사람 BBANG_SHOOTER, 맞은 사람 BBANG_TARGET
      // >
      // TODO: 쉴드 있고, 사용 시간 기다리기.
      // 결정은 다음에 (이전 요청에선 targetUser) 최신 요청에선 cardUseUser

      // 피 달면 안되고 targetUser의 쉴드 카드 소모 or 사용 선택
      // 시전자 state 변경
      cardUsingUser.setCharacterState(getStateBbangShooter(targetUser.id));
      // 대상자 state 변경
      targetUser.setCharacterState(getStateBbangTarget(cardUsingUser.id));

      const eventId = setTimeout(() => {
        // 실드 사용 대기시간(time)이 지났는데 아무 이벤트도 오지 않은 경우.
        // 실드 사용을 하게 되면 아래의 case Packets.CardType.SHIELD 부분에 걸릴테니 거기선 clearTimeout으로 직접 지워주기
        const index = inGame.eventQueue.findIndex((e) => {
          return e.targetId === targetUser.id;
        });

        if (index !== -1) {
          inGame.eventQueue.splice(index, 1);
        }
        console.log('timeout 안:', inGame.eventQueue);
        // 사용 안함 처리 <<< 피 다는건 reaction 핸들러에 위임, 상태만 원상복귀
        // 빵야 사용 유저, 쉴드 사용 유저 state 원상복귀
        cardUsingUser.setCharacterState(getStateNormal());
        // 대상자 state 변경
        targetUser.setCharacterState(getStateNormal());

        targetUser.decreaseHp();

        userUpdateNotification(inGame.users); //updateUserData
      }, 5000);
      inGame.eventQueue.push({ id: eventId, targetId: targetUser.id });
      console.log('빵야 당한 사람:', targetUser.id);

      // // 클라 수정 시 아래 코드는 바뀔 수도 있음
      // cardUsingUser.userStateTimeout({
      //   inGameUsers: inGameUsers,
      //   currentState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
      //   nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
      //   nextStateAt: Date.now(),
      //   targetUserId: 0,
      //   time: 5000,
      // });
      // targetUser.userStateTimeout({
      //   inGameUsers: inGameUsers,
      //   currentState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
      //   nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
      //   nextStateAt: Date.now(),
      //   targetUserId: 0,
      //   time: 5000,
      // });

      // TODO : 시간이 지났을때 피를 깎아줘야 함 가설 : 시간이 지났을 때 === 피해받기 (reaction => not_use_card)

      // TODO : 피해받기 (reaction => not_use_card), 사용하기 (useCardRequest, animation -> shield_animation) 각 선택 시 서버 처리
      /**
         * message S2CAnimationNotification {
    string userId = 1;
    AnimationType animationType = 2;
}
    enum AnimationType {
    NO_ANIMATION = 0;
    SATELLITE_TARGET_ANIMATION = 1;
    BOMB_ANIMATION = 2;
    SHIELD_ANIMATION = 3;
}
         */
      break;
    case Packets.CardType.BIG_BBANG: // 자신을 제외한 모든 플레이어 난사 1데미지
      const nonShieldUsers = [];
      // BIG_BBANG 일땐 방어카드 쉴드

      // 시전자 상태변경
      cardUsingUser.setCharacterState(getStateBigBbangShooter()); // targetUserId가 다수 일땐?
      // 시전자를 제외한 유저들의 상태변경
      targetUsers.forEach((user) => {
        user.setCharacterState(getStateBigBbangTarget(cardUsingUser.id));

        // 쉴드 미보유시
        if (!user.hasShieldCard()) {
          user.decreaseHp();

          user.setCharacterState(getStateNormal());

          nonShieldUsers.push(user);
          return;
        }
      });
      const hasShieldUsers = targetUsers.filter((user) => !nonShieldUsers.includes(user));

      const bigBbangEventId = setTimeout(() => {
        const index = inGame.eventQueue.findIndex((e) => {
          return e.targetId === cardUsingUser.id;
        });

        if (index !== -1) {
          inGame.eventQueue.splice(index, 1);
        }
        // 대상자 state 변경
        hasShieldUsers.forEach((user) => {
          user.setCharacterState(getStateNormal());
          user.decreaseHp();
          return;
        });
        userUpdateNotification(inGame.users); //updateUserData
      }, 5000);
      // BIGBBANG은 그냥 위 로직들을 다 수행하면 바로 상태를 변경?
      cardUsingUser.setCharacterState(getStateNormal());

      inGame.eventQueue.push({ id: bigBbangEventId, targetId: cardUsingUser.id });
      break;
    case Packets.CardType.SHIELD: // 빵야의 타겟이 되었을 때 막음
      // 빵야 맞은 target이 실드 사용을 하면 리퀘 날라옴
      console.log('쉴드 쓴 사람:', cardUsingUser.id);
      cardUsingUser.useShieldCard();
      // 이벤트 큐에서 삭제
      inGame.removeEvent(cardUsingUser.id);

      cardUsingUser.setCharacterState(getStateNormal());
      targetUser.setCharacterState(getStateNormal());
      break;
    case Packets.CardType.VACCINE: //체력 1 회복
      // 풀피일 때
      // 실패코드 반환
      if (cardUsingUser.hp === cardUsingUser.maxHp) {
        return {
          useCardResponse: {
            success: false,
            failCode: Packets.GlobalFailCode.CHARACTER_STATE_ERROR,
          },
        };
      }
      // 풀피가 아닐 때
      // hp + 1
      cardUsingUser.increaseHp();
      break;

    case Packets.CardType.CALL_119: //자신의 체력을 1 회복하거나, 나머지의 체력을 1 회복.
    // 타겟이 나 일때 (사용자: cardUsingUser, 타겟: targetUser)
    if(targetUser === cardUsingUser){
      cardUsingUser.increaseHp();
    }
    else{
      // 타겟이 내가 아닐 때 (사용자: cardUsingUser, 타겟: oterUsers)
      inGame.users.forEach((user) => {
        if (cardUsingUser.id !== user.id && 0 < user.characterData.hp && user.characterData.hp < user.maxHp){ //자신을 제외한 모두에게 체력 1 증가
          user.increaseHp();
        }
      })
    }

    
    case Packets.CardType.DEATH_MATCH: // 플레이어 한명을 지정하여 번갈아가며 빵야!카드를 낸다. 빵야!를 못내면 체력 1 소모  타겟 : 목록에서 선택  방어 카드 : 빵야!

    case Packets.CardType.GUERRILLA: // 자신을 제외한 모든 플레이어가 1의 데미지를 입는다, 방어 카드 : 빵야!

    case Packets.CardType.MATURED_SAVINGS: // 은행에서 사용 시 핸드카드 두장을 획득한다  타겟 : 은행 npc
      // 사용자 : cardUsingUser, 타겟 : npc
      // 패킷 타입: USE_CARD_REQUEST
      // 버전: 1.0.0
      // 시퀸스: 367
      // 패킷길이: 21
      // 페이로드: {"useCardRequest":{"cardType":"MATURED_SAVINGS"}}
      // targetUserId: 0
      // targetUserId: 0
      // addHandCard, inGame.deck 에서 shift 두번
      for (let i = 0; i < 2; i++) {
        const gainCard = inGame.deck.removeFront(); // return값 없
        cardUsingUser.addHandCard(gainCard);
        cardUsingUser.increaseHandCardsCount();
      }
      break;
    case Packets.CardType.WIN_LOTTERY: // 복권방에서 사용 시 새로운 카드 세장을 획득한다. 타겟 : 복권방 npc
      // 추가하는 카드 타입 -> enum값 user의 핸드카드 검색 -> type, count를 추가
      // user.characterData.handCards = [
      //   { type: Packets.CardType.MATURED_SAVINGS, count: 1 },
      //   { type: Packets.CardType.WIN_LOTTERY, count: 1 },
      // ];  여기서 없애는 방식 + 추가하는 방식
      // 패킷 타입: USE_CARD_REQUEST
      // 버전: 1.0.0
      // 시퀸스: 226
      // 패킷길이: 21
      // 페이로드: {"useCardRequest":{"cardType":"WIN_LOTTERY"}}
      // targetUserId: 0
      // targetUserId: 0
      for (let i = 0; i < 3; i++) {
        const gainCard = inGame.deck.removeFront();
        cardUsingUser.addHandCard(gainCard);
        cardUsingUser.increaseHandCardsCount();
      }
      break;
  }
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

// enum AnimationType {
//   NO_ANIMATION = 0;
//   SATELLITE_TARGET_ANIMATION = 1;
//   BOMB_ANIMATION = 2;
//   SHIELD_ANIMATION = 3;
// }

// enum CardType {
//     NONE = 0;
//     BBANG = 1; // 20장 ==============  적에게 총을 쏜다, 타겟 : 근처에 있는 유저
//     BIG_BBANG = 2; // 1장 ============ 자신을 제외한 모든 플레이어 난사 1데미지
//     SHIELD = 3; // 10장 ============== 빵야의 타겟이 되었을 때 막음
//     VACCINE = 4; // 6장 ================ 체력 1 회복
//     CALL_119 = 5; // 2장 =============== 자신의 체력을 1 회복하거나, 나머지의 체력을 1 회복.
//     DEATH_MATCH = 6; // 4장 ============= 플레이어 한명을 지정하여 번갈아가며 빵야!카드를 낸다. 빵야!를 못내면 체력 1 소모  타겟 : 목록에서 선택  방어 카드 : 빵야!
//     GUERRILLA = 7; // 1장 ============== 자신을 제외한 모든 플레이어가 1의 데미지를 입는다, 방어 카드 : 빵야!
//     MATURED_SAVINGS = 11; // 2장 ========= 은행에서 사용 시 핸드카드 두장을 획득한다  타겟 : 은행 npc
//     WIN_LOTTERY = 12; // 1장 ============ 복권방에서 사용 시 새로운 카드 세장을 획득한다.

//     ABSORB = 8; // 4장
//     HALLUCINATION = 9; // 4장
//     FLEA_MARKET = 10; // 3장
//     SNIPER_GUN = 13; // 1장
//     HAND_GUN = 14; // 2장
//     DESERT_EAGLE = 15; // 3장
//     AUTO_RIFLE = 16; // 2장
//     LASER_POINTER = 17; // 1장
//     RADAR = 18; // 1장
//     AUTO_SHIELD = 19; // 2장
//     STEALTH_SUIT = 20; // 2장
//     CONTAINMENT_UNIT = 21; // 3장    ===== 감옥
//     SATELLITE_TARGET = 22; // 1장
//     BOMB = 23; // 1장
// }

// enum CharacterStateType {
//   NONE_CHARACTER_STATE = 0;
//   BBANG_SHOOTER = 1; // 빵야 시전자
//   BBANG_TARGET = 2; // 빵야 대상 (쉴드 사용가능 상태)
//   DEATH_MATCH_STATE = 3; // 현피 중 자신의 턴이 아닐 때
//   DEATH_MATCH_TURN_STATE = 4; // 현피 중 자신의 턴
//   FLEA_MARKET_TURN = 5; // 플리마켓 자신의 턴
//   FLEA_MARKET_WAIT = 6; // 플리마켓 턴 대기 상태
//   GUERRILLA_SHOOTER = 7; // 게릴라 시전자
//   GUERRILLA_TARGET = 8; // 게릴라 대상
//   BIG_BBANG_SHOOTER = 9; // 난사 시전자
//   BIG_BBANG_TARGET = 10; // 난사 대상
//   ABSORBING = 11; // 흡수 중
//   ABSORB_TARGET = 12; // 흡수 대상
//   HALLUCINATING = 13; // 신기루 중
//   HALLUCINATION_TARGET = 14; // 신기루 대상
//   CONTAINED = 15; // 감금 중
// }
