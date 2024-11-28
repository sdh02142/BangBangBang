import { getStateBbangTarget } from '../../constants/stateType.js';
import { Packets } from '../../init/loadProtos.js';

export const sharkHandler = (cardUsingUser, targetUser) => {
  // cardUsingUser: 상어군, targetUser: 빵야 맞는 사람
  // 상어군 로직 추가
  // 상어가 빵야를 쐇을 때 대상자는 막으려면 쉴드 2개 필요

  // 상어가 조준경을 착용했을 때 쉴드 3개 깍이는 걸로 로직 추가
  // 쉴드가 없을 때 오류남 (count에서)
  const shieldCount = targetUser.characterData.handCards.find((card) => {
    if (card.type === Packets.CardType.SHIELD) {
      return card.count;
    } else {
      return 0;
    }
  });
  console.log(`쉴드 개수 ${shieldCount}`);
  const isLaserPointer = cardUsingUser.characterData.equips.includes(
    Packets.CardType.LASER_POINTER,
  );

  let needShield = 2;

  if (isLaserPointer) {
    needShield = 3;
  }

  if (shieldCount < needShield) {
    targetUser.decreaseHp(cardUsingUser.damage);
  } else {
    targetUser.setCharacterState(getStateBbangTarget(cardUsingUser.id));
  }
};
