export const winLotteryCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  for (let i = 0; i < 3; i++) {
    const gainCard = currentGame.deck.shift();
    cardUsingUser.addHandCard(gainCard.type);
  }
};
