export const pinkSlimeHandler = (user, targetUser, game) => {
  // 핑크슬라임 로직 추가
  // 피격 시 가해자의 카드를 한 장 가져옴 -> cardSelectHandler필요할듯
  // '피격 시'라는 조건에 hp가 깎이지 않는 것도 포함되는가 -> 국어사전 결과로는 포함 안됨
  //   const card = cardSelectHandler(user, targetUser, game);
  //   user.addHandCard({ type: card.type, count: 1 });
  user.increaseHandCardsCount();
};
