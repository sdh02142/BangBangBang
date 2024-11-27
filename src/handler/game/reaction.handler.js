import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { Packets } from '../../init/loadProtos.js';
import { findUserById, getUserBySocket } from '../../sessions/user.session.js';
import { findGameById } from '../../sessions/game.session.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';
import { getStateNormal } from '../../constants/stateType.js';
import { malangHandler } from '../character/malang.handler.js';
import { froggyHandler } from '../character/froggy.handler.js';
import { pinkSlimeHandler } from '../character/pinkSlime.handler.js';

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

  if (user.characterData.characterType !== Packets.CharacterType.FROGGY) {
    if (user.characterData.stateInfo.state === Packets.CharacterStateType.BBANG_TARGET) {
      game.events.cancelEvent(user.id, 'finishShieldWait');
      user.decreaseHp(targetUser.damage);
    } else {
      user.decreaseHp();
    }
  } else {
    // 개굴군만 해당 TODO: 쉴드 애니메이션
    const autoSheild = Math.random();
    if (autoSheild < 0.25) {
      froggyHandler(user, game);
    } else {
      game.events.cancelEvent(user.id, 'finishShieldWait');
      user.decreaseHp();
    }
  }

  if (user.characterData.characterType === Packets.CharacterType.MALANG) {
    malangHandler(user, game);
  } else if (user.characterData.characterType === Packets.CharacterType.PINK_SLIME) {
    pinkSlimeHandler(user, targetUser, game);
  }

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
