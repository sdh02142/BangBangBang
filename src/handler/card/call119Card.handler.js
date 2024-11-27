export const call119CardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  // 타겟이 나 일때 (사용자: cardUsingUser, 타겟: targetUser)
  // payload
  // {"useCardRequest":{"cardType":"CALL_119"}}
  if (cardUsingUser === targetUser) {
    cardUsingUser.increaseHp();
    return;
  }

  // 타겟이 내가 아닐 때 (사용자: cardUsingUser, 타겟: oterUsers)
  currentGame.users.forEach((user) => {
    if (
      cardUsingUser.id !== user.id &&
      0 < user.characterData.hp &&
      user.characterData.hp < user.maxHp
    ) {
      //자신을 제외한 모두에게 체력 1 증가
      user.increaseHp();
    }
  });
};
