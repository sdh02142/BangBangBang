import { Packets } from '../../init/loadProtos.js';
import { animationNotification } from '../../utils/notification/animation.notification.js';

export const froggyHandler = (user, game) => {
  // 개굴군 로직 추가
  // 25% 확률로 공격 막기 -> 애니메이션 노티 날려야함
  // animationNotification(game.users, user, Packets.AnimationType.SHIELD_ANIMATION); // 튜터님 질문 : 쉴드 애니메이션이 자동쉴드 때만 발동인데, 개굴군의 25% 확률도 자동쉴드의 범주안에 들어가는지
  game.events.cancelEvent(user.id, 'finishShieldWait');
};
