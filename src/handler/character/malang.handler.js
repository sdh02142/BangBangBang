import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';

export const malangHandler = (user, game) => {
  // 말랑이 로직 추가
  // 체력이 n 깎이면 카드 n 장 추가
  const loseHp = user.maxHp - user.characterData.hp;
  for (let i = 0; i < loseHp; i++) {
    const card = game.deck.shift();
    user.addHandCard({ type: card, count: 1 });
    user.increaseHandCardsCount();
  }
};
