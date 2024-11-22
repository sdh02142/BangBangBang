import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { Packets } from '../../init/loadProtos.js';
import { findUserById, getUserBySocket } from '../../sessions/user.session.js';
import { findGameById } from '../../sessions/game.session.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';
import { getStateNormal } from '../../constants/stateType.js';

export const reactionHandler = (socket, payload) => {
  const user = getUserBySocket(socket);
  user.decreaseHp();
  const game = findGameById(user.roomId);
  // game.removeEvent(user.id);
  game.events.cancelEvent(user.id, 'finishShieldWait');
  game.events.cancelEvent(user.id, 'finishShieldWaitOnBigBbang');
  const targetUser = findUserById(user.characterData.stateInfo.stateTargetUserId);
  user.setCharacterState(getStateNormal());
  targetUser.setCharacterState(getStateNormal());
  userUpdateNotification(game.users); //updateUserData

  const responsePayload = {
    reactionResponse: {
      success: true,
      failCode: Packets.GlobalFailCode.NONE_FAILCODE,
    },
  };
  socket.write(createResponse(PACKET_TYPE.REACTION_RESPONSE, 0, responsePayload));

  //   const reactionType = payload.reactionRequest.reactionType;

  //   if (reactionType !== Packets.reactionType.NOT_USE_CARD) {
  //     const errorPayload = {
  //       reactionResponse: {
  //         success: false,
  //         failCode: Packets.GlobalFailCode.INVALID_REQUEST,
  //       },
  //     };
  //     socket.write(createResponse(PACKET_TYPE.REACTION_RESPONSE, 0, errorPayload));
  //     return;
  //   }
};

/**
 * 
 * message C2SReactionRequest {
    ReactionType reactionType = 1; // NOT_USE_CARD = 1
}
 *  message S2CReactionResponse {
    bool success = 1;
    GlobalFailCode failCode = 2;    
}
 * enum ReactionType {
    NONE_REACTION = 0;
    NOT_USE_CARD = 1;  // 이거 위주
}
 */
