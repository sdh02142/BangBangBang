export const pinkSlimeHandler = (user, targetUser, game) => {
  // 핑크슬라임 로직 추가
  // 피격 시 가해자의 카드를 한 장 가져옴
  // 죽을 때도 카드를 빼앗아옴..
  const card =
    targetUser.characterData.handCards[
      Math.floor(Math.random() * targetUser.characterData.handCardsCount)
    ];
  console.log(card);
  console.log(Math.floor(Math.random() * targetUser.handCardsCount));
  targetUser.removeHandCard(card.type);
  user.addHandCard(card.type);
};
