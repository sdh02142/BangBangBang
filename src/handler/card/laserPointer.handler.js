import { Packets } from '../../init/loadProtos.js';
import equipCardNotification from '../../utils/notification/equipCard.notification.js';

export const laserPointerHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  // cardUsingUser: 조준경 착용자, targetUser: 빵야 맞는 사람
  // 조준경 로직 추가
  // 빵야를 쐇을 때 대상자는 막으려면 쉴드 2개 필요
  const isLaserPointer = cardUsingUser.characterData.equips.includes(
    Packets.CardType.LASER_POINTER,
  );
  if (!isLaserPointer) {
    cardUsingUser.addEquip(useCardType);
    equipCardNotification(useCardType, cardUsingUser.id);
  }
};
