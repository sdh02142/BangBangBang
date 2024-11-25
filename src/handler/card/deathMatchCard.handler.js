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

// 순서: useCardHandler -> deathMatchCardHandler -> BbangCardHandler
export const deathMatchCardHandler = (cardUsingUser, targetUser, currentGame) => {
  // 플레이어 한명을 지정하여 번갈아가며 빵야!카드를 낸다. 빵야!를 못내면 체력 1 소모  타겟 : 목록에서 선택  방어 카드 : 빵야!
  // 빵야 카드 없는 경우 <<< 바로 처리하고 return <<< fail 코드 없이, 아래쪽 노티들 다 보내고 끝
  // 빵야 카드 있는 경우 <<< 빵야 카드 사용 대기 <<< 이 경우 state만 처리하고 사용 자체는 다음 card 사용 유저(이전 targetUser)한테 전가

  // 빵야 카드 있는 경우 > 현피 쓴 사람 DEATH_MATCH_STATE, 맞은 사람 DEATH_MATCH_TURN_STATE
  // >
  // TODO: 빵야 카드 있고, 사용 시간 기다리기.
  // 결정은 다음에 (이전 요청에선 targetUser) 최신 요청에선 cardUseUser

  // 피 달면 안되고 targetUser의 빵야 카드 소모 or 사용 선택
  // 시전자 state 변경
  cardUsingUser.setCharacterState(getStateDeathInitShooter(targetUser.id));
  // 대상자 state 변경
  targetUser.setCharacterState(getStateDeathInitTarget(cardUsingUser.id));

  // 현피 대상자 5초 대기
  currentGame.events.scheduleEvent(targetUser.id, 'onDeathMatch', 5000, {cardUsingUser, targetUser, stateNormal: getStateNormal(), userUpdateNotification, currentGameUsers: currentGame.users})
  console.log('현피 당한 사람:', targetUser.id);


  // 시간이 지났을때 피를 깎아줘야 함 가설 : 시간이 지났을 때 === 피해받기 (reaction => not_use_card)
  // TODO : 피해받기 (reaction => not_use_card), 사용하기 (useCardRequest, animation -> shield_animation) 각 선택 시 서버 처리
}