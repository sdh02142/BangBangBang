import { Packets } from '../../init/loadProtos.js';
import { animationNotification } from '../../utils/notification/animation.notification.js';
import { cardEffectNotification } from '../../utils/notification/cardEffect.notification.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';
import warningNotification from '../../utils/notification/warning.notification.js';

export const bombCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  const currentGameUsers = currentGame.users;
  targetUser.characterData.debuffs.push(Packets.CardType.BOMB);
  const bombAni = () =>
    animationNotification(currentGameUsers, targetUser, Packets.AnimationType.BOMB_ANIMATION);

  // 이게 잘 안보내지는 것 같음..
  warningNotification(targetUser, Packets.WarningType.BOMB_WANING, Date.now() + 30000);
  cardEffectNotification(currentGame, Packets.CardType.BOMB, cardUsingUser);
  currentGame.events.scheduleEvent(targetUser.id, 'bombTimer', 30000, {
    targetUser,
    bombAni,
    userUpdateNotification,
    currentGameUsers,
    cardType: Packets.CardType.BOMB,
  });
};

// 30초 후 폭발하여 데미지, 다른유저에게 이전 가능
// S2CWarningNotification warningNotification = 44;
// C2SPassDebuffRequest passDebuffRequest = 42;
// S2CPassDebuffResponse passDebuffResponse = 43;

/*
enum WarningType {
    NO_WARNING = 0;
    BOMB_WANING = 1;
}

enum AnimationType {
    NO_ANIMATION = 0;
    SATELLITE_TARGET_ANIMATION = 1;
    BOMB_ANIMATION = 2;
    SHIELD_ANIMATION = 3;
}

*/
