import { getStateBbangTarget } from '../../constants/stateType.js';
import { Packets } from '../../init/loadProtos.js';

export const laserPointerHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  // cardUsingUser: 조준경 착용자, targetUser: 빵야 맞는 사람
  // 조준경 로직 추가
  // 빵야를 쐇을 때 대상자는 막으려면 쉴드 2개 필요
  const isLaserPointerUser = cardUsingUser.characterData.equips.find((equipment) => {
    if (equipment === Packets.CardType.LASER_POINTER) return true;
  });
  if (isLaserPointerUser) {
    const shieldCount = targetUser.characterData.handCards.find(
      (card) => card.type === Packets.CardType.SHIELD,
    ).count;
    console.log('shieldCOunt:', shieldCount);
    if (shieldCount < 2) {
      targetUser.decreaseHp(cardUsingUser.damage);
    } else {
      targetUser.setCharacterState(getStateBbangTarget(cardUsingUser.id));
    }
  } else {
    cardUsingUser.addEquip(useCardType);
  }
};
