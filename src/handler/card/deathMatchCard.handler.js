import { PACKET_TYPE } from '../../constants/header.js';
import {
  getStateBbangShooter,
  getStateBbangTarget,
  getStateNormal,
  getStateDeathInitShooter,
  getStateDeathInitTarget,
  getStateDeathMatchShooter,
  getStateDeathMatchTarget,
  getStateDeathMatchEnd,
} from '../../constants/stateType.js';
import { characterPositions } from '../../init/loadPositions.js';
import { Packets } from '../../init/loadProtos.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import { gameStartNotification } from '../../utils/notification/gameStart.notification.js';
import useCardNotification from '../../utils/notification/useCard.notification.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';

  // ////////////////////////////
  // // 행동카드를 사용한 유저와 대상이 된 유저는 행동카드 사용이 종료 될 때 까지 움직일 수 없고, 다른 유저의 타겟이 될 수 없다.
  // // (유저1이 유저2에게 발포 사용 시 쉴드 카드를 사용하거나 사용하지 않을 때 까지 정지상태. 선택 여부를 결정하는데 주어진 시간은 카드별로 3~5초)
  // if(cardUsingUser.characterData.stateInfo.state === Packets.CharacterStateType.DEATH_MATCH_TURN_STATE){
  //   cardUsingUser.decreaseHandCardsCount(); // 카드 사용자의 손에 들고 있던 카드 수 감소
  //   cardUsingUser.removeHandCard(userCardType); // 카드 사용자의 손에 들고 있던 카드 제거
  //   console.log('카드 사용 후');
  //   cardUsingUser.logUserHandCards();
  //   // TODO: 덱에 복귀하는지 테스트 필요
  //   inGame.deck.append(userCardType); // 카드 덱으로 복귀

  //   deathMatchCardHandler(userCardType, cardUsingUser, targetUser);

  // }


    // // 플레이어 한명을 지정하여 번갈아가며 빵야!카드를 낸다. 빵야!를 못내면 체력 1 소모  타겟 : 목록에서 선택  방어 카드 : 빵야!
    //   // 빵야 카드 없는 경우 <<< 바로 처리하고 return <<< fail 코드 없이, 아래쪽 노티들 다 보내고 끝
    //   // 빵야 카드 있는 경우 <<< 빵야 카드 사용 대기 <<< 이 경우 state만 처리하고 사용 자체는 다음 card 사용 유저(이전 targetUser)한테 전가

    //   // 대상자 보유 카드 확인 
      
    //   if (!targetUser.hasBbangCard()) {
    //     // 빵야 카드 미보유중
    //     // 시전자 state 변경
    //     cardUsingUser.setCharacterState(getStateDeathMatchEnd(targetUser.id));
    //     // 대상자 hp 감소
    //     targetUser.decreaseHp();
    //     // 사용한 사람 경직 time값은 임시
    //     cardUsingUser.userStateTimeout({
    //       inGameUsers: inGame.users,
    //       ...getStateNormal(),
    //       time: 1000,
    //     });

    //     return;
    //   }

    //   // 빵야 카드 있는 경우 > 현피 쓴 사람 DEATH_MATCH_STATE, 맞은 사람 DEATH_MATCH_TURN_STATE
    //   // >
    //   // TODO: 빵야 카드 있고, 사용 시간 기다리기.
    //   // 결정은 다음에 (이전 요청에선 targetUser) 최신 요청에선 cardUseUser

    //   // 피 달면 안되고 targetUser의 빵야 카드 소모 or 사용 선택
    //   // 시전자 state 변경
    //   cardUsingUser.setCharacterState(getStateDeathInitShooter(targetUser.id));
    //   // 대상자 state 변경
    //   targetUser.setCharacterState(getStateDeathInitTarget(cardUsingUser.id));

    //   const deathMatchEventId = setTimeout(() => {
    //     // 실드 사용 대기시간(time)이 지났는데 아무 이벤트도 오지 않은 경우.
    //     // 실드 사용을 하게 되면 아래의 case Packets.CardType.SHIELD 부분에 걸릴테니 거기선 clearTimeout으로 직접 지워주기
    //     const index = inGame.eventQueue.findIndex((e) => {
    //       return e.targetId === targetUser.id;
    //     });

    //     if (index !== -1) {
    //       inGame.eventQueue.splice(index, 1);
    //     }
    //     console.log('timeout 안:', inGame.eventQueue);
    //     // 사용 안함 처리 <<< 피 다는건 reaction 핸들러에 위임, 상태만 원상복귀
    //     // 빵야 사용 유저, 쉴드 사용 유저 state 원상복귀
    //     cardUsingUser.setCharacterState(getStateNormal());
    //     // 대상자 state 변경
    //     targetUser.setCharacterState(getStateNormal());

    //     targetUser.decreaseHp();

    //     userUpdateNotification(inGame.users); //updateUserData
    //   }, 5000);
    //   inGame.eventQueue.push({ id: deathMatchEventId, targetId: targetUser.id });
    //   console.log('현피 당한 사람:', targetUser.id);

    //   // TODO : 시간이 지났을때 피를 깎아줘야 함 가설 : 시간이 지났을 때 === 피해받기 (reaction => not_use_card)

    //   // TODO : 피해받기 (reaction => not_use_card), 사용하기 (useCardRequest, animation -> shield_animation) 각 선택 시 서버 처리


export const deathMatchCardHandler = (userCardType, deathMatchTurnUser, deathMatchWaitUser) => {
    const inGame = findGameById(deathMatchTurnUser.roomId);
    const inGameUsers = inGame.users;
    inGame.removeEvent(deathMatchTurnUser.id);

    if (!deathMatchWaitUser.hasBbangCard()) {
        // 빵야 카드 미보유중
        // 시전자 state 변경
        deathMatchTurnUser.setCharacterState(getStateDeathMatchEnd(deathMatchWaitUser.id));
        // 대상자 hp 감소
        deathMatchWaitUser.decreaseHp();
        // 사용한 사람 경직 time값은 임시
        deathMatchTurnUser.userStateTimeout({
          inGameUsers: inGame.users,
          ...getStateNormal(),
          time: 1000,
        });
        const responsePayload = {
            useCardResponse: {
              success: true,
              failCode: Packets.GlobalFailCode.NONE_FAILCODE,
            },
          };
        
          socket.write(createResponse(PACKET_TYPE.USE_CARD_RESPONSE, 0, responsePayload));
        return;
      }

    // 시전자 state 변경(빵야 카드 사용 시: 현피 기다림)
    deathMatchTurnUser.setCharacterState(getStateDeathInitShooter(deathMatchWaitUser));
    // 대상자 state 변경(현피 대상: 빵야 카드 소지 여부 및 사용 여부)
    deathMatchWaitUser.setCharacterState(getStateDeathInitTarget(deathMatchTurnUser));
    inGameUsers.forEach((user) => {
      // 게임 방 안에 모든 유저들에게 카드 사용알림
      const useCardResponse = useCardNotification(userCardType, deathMatchTurnUser, deathMatchWaitUser);
      user.socket.write(createResponse(PACKET_TYPE.USE_CARD_NOTIFICATION, 0, useCardResponse));
  
      // 방에 있는 모두에게 UserUpdateNotification
      // message S2CUserUpdateNotification {
      // repeaed UserData user = 1;
      // }
    });
    userUpdateNotification(inGameUsers); //updateUserData

    const deathMatchEventId = setTimeout(() => {
      // 빵야 카드 사용 대기시간(time)이 지났는데 아무 이벤트도 오지 않은 경우.
      const index = inGame.eventQueue.findIndex((e) => {
        return e.targetId === deathMatchWaitUser.id;
      });

      if (index !== -1) {
        inGame.eventQueue.splice(index, 1);
      }
      console.log('timeout 안:', inGame.eventQueue);
      // 사용 안함 처리 <<< 피 다는건 reaction 핸들러에 위임, 상태만 원상복귀
      // 빵야 사용 유저, 쉴드 사용 유저 state 원상복귀
      deathMatchTurnUser.setCharacterState(getStateNormal());
      // 대상자 state 변경
      deathMatchWaitUser.setCharacterState(getStateNormal());

      deathMatchWaitUser.decreaseHp();

      userUpdateNotification(inGame.users); //updateUserData
    }, 5000);
    inGame.eventQueue.push({ id: deathMatchEventId, targetId: deathMatchWaitUser.id });
    console.log('다음 현피 대상:', deathMatchWaitUser.id);
}