export const winLotteryCardHandler = (cardUsingUser, targetUser, currentGame) => {
  for (let i = 0; i < 3; i++) {
    const gainCard = currentGame.deck.shift();
    cardUsingUser.addHandCard({ type: gainCard, count: 1 });
    cardUsingUser.increaseHandCardsCount();
  }
};
