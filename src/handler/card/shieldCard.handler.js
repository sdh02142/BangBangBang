import { getStateNormal } from '../../constants/stateType.js';
import { Packets } from '../../init/loadProtos.js';

export const shieldCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  // 쉴드 사용하려는 사람이 빵야 맞은 사람
  console.log('쉴드 쓴 사람:', cardUsingUser.id);
  const isLaserUser = targetUser.characterData.equips.find((card) => {
    if (card === Packets.CardType.LASER_POINTER) return true;
  });
  if (cardUsingUser.characterData.stateInfo.state === Packets.CharacterStateType.BBANG_TARGET) {
    if (targetUser.characterData.characterType === Packets.CharacterType.SHARK && isLaserUser) {
      for (let i = 0; i < 2; i++) {
        // 상어군이 조준경을 착용했을 때
        // 상어군이 빵야를 썼을 때 쉴드를 사용하면 일차적으로 2개씩 까고, useCard.handler에서 한 번 더 깜 -> 최종적으로 빵야카드를 막기위해 3개의 쉴드 사용
        cardUsingUser.removeHandCard(useCardType); // 카드 사용자의 손에 들고 있던 카드 제거
        currentGame.returnCardToDeck(useCardType); // 카드 덱으로 복귀
      }
    } else if (
      targetUser.characterData.characterType === Packets.CharacterType.SHARK ||
      isLaserUser
    ) {
      // 상어군이 빵야를 썼을 때 쉴드를 사용하면 일차적으로 1개씩 까고, useCard.handler에서 한 번 더 깜 -> 최종적으로 빵야카드를 막기위해 2개의 쉴드 사용
      cardUsingUser.removeHandCard(useCardType); // 카드 사용자의 손에 들고 있던 카드 제거
      currentGame.returnCardToDeck(useCardType); // 카드 덱으로 복귀
    }
    currentGame.events.cancelEvent(cardUsingUser.id, 'finishShieldWait');
  }

  if (cardUsingUser.characterData.stateInfo.state === Packets.CharacterStateType.BIG_BBANG_TARGET) {
    currentGame.events.cancelEvent(cardUsingUser.id, 'finishShieldWaitOnBigBbang');
  }

  cardUsingUser.setCharacterState(getStateNormal());
  targetUser.setCharacterState(getStateNormal());
};
