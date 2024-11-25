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