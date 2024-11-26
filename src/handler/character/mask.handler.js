export const maskHandler = (user, targetUser, game) => {
  // 가면군 로직 추가
  // 다른 사람이 사망 시 장비중인 카드 포함 모든 카드를 손에 가져온다.
  const deathUser = game.users.find((user) => user.characterData.hp === 0);
  const deathUserCards = deathUser.handCards;
  for (let i = 0; i < deathUserCards.length; i++) {
    user.addHandCard({ type: deathUserCards[i].type, count: deathUserCards[i].count });
    user.increaseHandCardsCount();
  }
};

/**
 * 어딘가에 집어 넣을 코드
 * if (user.characterData.characterType === Packets.CharacterType.MASK) {
    maskHandler(user, targetUser, game);
  }
 */
