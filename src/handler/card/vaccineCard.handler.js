export const vaccineCardHandler = (cardUsingUser, targetUser, currentGame) => {
  console.log(`${cardUsingUser.nickname}: 백신 카드 사용`);
  cardUsingUser.increaseHp();
};
