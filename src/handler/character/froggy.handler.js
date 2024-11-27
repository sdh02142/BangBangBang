import { Packets } from '../../init/loadProtos.js';
import { animationNotification } from '../../utils/notification/animation.notification.js';

export const froggyHandler = (user, game) => {
  // 개굴군 로직 추가
  // 25% 확률로 공격 막기 -> 애니메이션 노티 날려야함
  // animationNotification(game.users, user, Packets.AnimationType.SHIELD_ANIMATION);
  game.events.cancelEvent(user.id, 'finishShieldWait');
};
