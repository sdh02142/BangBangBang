export const maturedSavingsCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  // 사용자 : cardUsingUser, 타겟 : npc
  // 패킷 타입: USE_CARD_REQUEST
  // 버전: 1.0.0
  // 시퀸스: 367
  // 패킷길이: 21
  // 페이로드: {"useCardRequest":{"cardType":"MATURED_SAVINGS"}}
  // targetUserId: 0
  // targetUserId: 0
  // addHandCard, inGame.deck 에서 shift 두번
  for (let i = 0; i < 2; i++) {
    const gainCard = currentGame.deck.shift(); // return값 없
    cardUsingUser.addHandCard(gainCard.type);
  }
};
