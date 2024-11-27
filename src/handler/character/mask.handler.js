import { Packets } from '../../init/loadProtos.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';

export const maskHandler = (game) => {
  // 가면군 로직 추가
  // 다른 사람이 사망 시 장비중인 카드 포함 모든 카드를 손에 가져온다.
  // TODO: 장비중인 카드 포함, 가면군이 막타 친 애만 들고 오는건지?? (튜터님 질문)
  const deathUser = game.users.find((user) => user.characterData.hp === 0);

  if (deathUser && deathUser.characterData.alive) {
    deathUser.characterData.alive = false;
    const maskUser = game.users.find(
      (user) => user.characterData.characterType === Packets.CharacterType.MASK,
    );
    const deathUserCards = deathUser.characterData.handCards;
    const cardsLength = deathUserCards.length;
    // console.dir(deathUserCards, { depth: null });
    for (let i = 0; i < cardsLength; i++) {
      for (let j = 0; j < deathUserCards[i].count; j++) {
        maskUser.addHandCard(deathUserCards[i].type);
      }
    }

    userUpdateNotification(game.users);
  }
};
