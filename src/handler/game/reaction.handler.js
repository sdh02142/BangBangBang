import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { Packets } from '../../init/loadProtos.js';
import { findUserById, getUserBySocket } from '../../sessions/user.session.js';
import { findGameById } from '../../sessions/game.session.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';
import { getStateNormal } from '../../constants/stateType.js';

export const reactionHandler = (socket, payload) => {
  const user = getUserBySocket(socket);
  const game = findGameById(user.roomId);
  const targetUser = findUserById(user.characterData.stateInfo.stateTargetUserId);

  if (user.characterData.stateInfo.state === Packets.CharacterStateType.BIG_BBANG_TARGET) {
    game.events.cancelEvent(user.id, 'finishShieldWaitOnBigBbang');
  }

  if (user.characterData.stateInfo.state === Packets.CharacterStateType.DEATH_MATCH_TURN_STATE) {
    game.events.cancelEvent(user.id, 'onDeathMatch');
  }

  if (user.characterData.stateInfo.state === Packets.CharacterStateType.GUERRILLA_TARGET) {
    game.events.cancelEvent(user.id, 'finishBbangWaitOnGuerrilla');
  }
  let lostHp = 1;
  if (user.characterData.stateInfo.state === Packets.CharacterStateType.BBANG_TARGET) {
    //빵야의 타겟인 경우
    lostHp = targetUser.damage;
    game.events.cancelEvent(user.id, 'finishShieldWait');
    user.decreaseHp(lostHp);
  } else {
    //빵야 예외인 경우
    user.decreaseHp(lostHp);
  }
  characterTypeGetCard(user, targetUser, game, lostHp);

  user.setCharacterState(getStateNormal());
  if (targetUser) {
    targetUser.setCharacterState(getStateNormal());
  }
  userUpdateNotification(game.users); //updateUserData

  const responsePayload = {
    reactionResponse: {
      success: true,
      failCode: Packets.GlobalFailCode.NONE_FAILCODE,
    },
  };

  socket.write(createResponse(PACKET_TYPE.REACTION_RESPONSE, 0, responsePayload));
};

//캐릭터 특성 - 말랑이, 핑크슬라임
const characterTypeGetCard = (user, targetUser, game, lostHp) => {
  if (user.characterData.characterType === Packets.CharacterType.MALANG) {
    for (let i = 0; i < lostHp; i++) {
      const card = game.deck.shift();
      user.addHandCard(card);
    }
  }

  if (user.characterData.characterType === Packets.CharacterType.PINK_SLIME) {
    const card =
      targetUser.characterData.handCards[
        Math.floor(Math.random() * targetUser.characterData.handCardsCount)
      ];
    targetUser.removeHandCard(card.type);
    user.addHandCard(card.type);
  }
};
