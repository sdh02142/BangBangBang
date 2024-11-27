import { getStateBbangShooter, getStateBbangTarget } from '../../constants/stateType.js';
import { Packets } from '../../init/loadProtos.js';

export const sharkHandler = (cardUsingUser, targetUser, game) => {
  // cardUsingUser: 상어군, targetUser: 빵야 맞는 사람
  // 상어군 로직 추가
  // 상어가 빵야를 쐇을 때 대상자는 막으려면 쉴드 2개 필요

  const shieldCount = targetUser.characterData.handCards.find((card) => {
    if (card.type === Packets.CardType.SHIELD) return card.count;
  });
  if (shieldCount < 2) {
    targetUser.decreaseHp();
  } else {
    targetUser.setCharacterState(getStateBbangTarget(cardUsingUser.id));
  }
};
