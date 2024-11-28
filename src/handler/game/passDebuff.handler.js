import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { findUserById, getUserBySocket } from '../../sessions/user.session.js';
import warningNotification from '../../utils/notification/warning.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const passDebuffHandler = (socket, payload) => {
  const passer = getUserBySocket(socket);
  const debuffCard = payload.debuffCardType;
  const debuffUser = findUserById(payload.targetUserId);

  passer.characterData.debuffs = passer.characterData.debuffs.filter(
    (debuff) => debuff !== debuffCard,
  );

  debuffUser.characterData.debuffs.push(debuffCard);

  warningNotification(debuffUser, Packets.WarningType.BOMB_WANING, Date.now() + 30000);
  warningNotification(passer, Packets.WarningType.NO_WARNING, Date.now());

  const responsePayload = {
    passDebuffResponse: {
      success: true,
      failCode: Packets.GlobalFailCode.NONE_FAILCODE,
    },
  };

  socket.write(createResponse(PACKET_TYPE.PASS_DEBUFF_RESPONSE, 0, responsePayload));
  // 소켓에서 패스를 시킨 유저의 디버프 삭제
  // 페이로드에서 옮길 유저의 디버프에 추가, 노티 보내기?
};

// 30초를 세는 이벤트가 필요? 30초가 지나기 전에 passDebuffHandler 가 날라오면 전에 있던 이벤트 삭제
// 그럼 패스를 한 유저의 워닝창도 없애주기 위해 노티를 한번더?

// message C2SPassDebuffRequest {
//     int64 targetUserId = 1;
//     CardType debuffCardType = 2;
// }

// message S2CPassDebuffResponse {
//     bool success = 1;
//     GlobalFailCode failCode = 2;
// }
