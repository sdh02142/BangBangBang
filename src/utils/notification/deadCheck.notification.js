import { Packets } from '../../init/loadProtos.js';
import userUpdateNotification from './userUpdate.notification.js';

export const deadCheck = (game) => {
  // 가면군 로직 추가
  // 다른 사람이 사망 시 장비중인 카드 포함 모든 카드를 손에 가져온다.
  // TODO: 가면군이 막타 친 애만 들고 오는건지?? 현재는 막타 안쳐도 가져옴! (튜터님 질문)
  const deathUser = game.users.find((user) => user.characterData.hp === 0);
  if (deathUser && deathUser.characterData.alive) {
    console.log('죽은 유저 확인, 카드 추가');

    deathUser.characterData.alive = false;
    characterTypeGetCard(game, deathUser);
  }
};

//캐릭터 특성 - 마스크
const characterTypeGetCard = (game, deathUser) => {
  const maskUser = game.users.find(
    (user) => user.characterData.characterType === Packets.CharacterType.MASK,
  );
  const deathUserHandCards = deathUser.characterData.handCards;
  const handCardsLength = deathUserHandCards.length;
  const deathUserEquips = deathUser.characterData.equips;
  const equipCardsLength = deathUserEquips.length;
  if (deathUser.characterData.weapon !== 0) {
    maskUser.addHandCard(deathUser.characterData.weapon);
  }
  for (let i = 0; i < equipCardsLength; i++) {
    maskUser.addHandCard(deathUserEquips[i]);
  }

  for (let i = 0; i < handCardsLength; i++) {
    for (let j = 0; j < deathUserHandCards[i].count; j++) {
      maskUser.addHandCard(deathUserHandCards[i].type);
    }
  }

  userUpdateNotification(game.users);
};
