import { Packets } from '../../init/loadProtos.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';

export const maskHandler = (game) => {
  // 가면군 로직 추가
  // 다른 사람이 사망 시 장비중인 카드 포함 모든 카드를 손에 가져온다.
  // TODO: 장비중인 카드 포함, 가면군이 막타 친 애만 들고 오는건지?? 현재는 막타 안쳐도 가져옴! (튜터님 질문)
  // 두번째부터 사망한 유저 카드 안들어옴
  const deathUser = game.users.find((user) => user.characterData.hp === 0);

  if (deathUser && deathUser.characterData.alive) {
    console.log('죽은 유저 확인, 카드 추가');

    deathUser.characterData.alive = false;
    const maskUser = game.users.find(
      (user) => user.characterData.characterType === Packets.CharacterType.MASK,
    );
    const deathUserHandCards = deathUser.characterData.handCards;
    const handCardsLength = deathUserHandCards.length;
    const deathUserEquips = deathUser.characterData.equips;
    const equipCardsLength = deathUserEquips.length;
    if (deathUser.characterData.weapon !== 0) {
      // 13 ~ 16
      maskUser.addHandCard(deathUser.characterData.weapon);
    }
    // console.dir(deathUserCards, { depth: null });
    // handCard 수 + equips 수 (0 ~ 4)
    for (let i = 0; i < equipCardsLength; i++) {
      maskUser.addHandCard(deathUserEquips[i]);
    }

    for (let i = 0; i < handCardsLength; i++) {
      for (let j = 0; j < deathUserHandCards[i].count; j++) {
        maskUser.addHandCard(deathUserHandCards[i].type);
      }
    }

    userUpdateNotification(game.users);
  }
};
