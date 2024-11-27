export const pinkHandler = (user, game) => {
  // 핑크군 로직 추가
  // 손에 카드 없으면 카드 한 장 추가
  const card = game.deck.shift();
  user.addHandCard(card.type);
};
