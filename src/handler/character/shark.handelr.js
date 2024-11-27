import { getStateBbangTarget } from '../../constants/stateType.js';
import { Packets } from '../../init/loadProtos.js';

export const sharkHandler = (cardUsingUser, targetUser) => {
  // cardUsingUser: 상어군, targetUser: 빵야 맞는 사람
  // 상어군 로직 추가
  // 상어가 빵야를 쐇을 때 대상자는 막으려면 쉴드 2개 필요

  const shieldCount = targetUser.characterData.handCards.find(
    (card) => card.type === Packets.CardType.SHIELD,
  ).count;
  console.log('shieldCOunt:', shieldCount);
  if (shieldCount < 2) {
    targetUser.decreaseHp(cardUsingUser.damage);
  } else {
    targetUser.setCharacterState(getStateBbangTarget(cardUsingUser.id));
  }
};
