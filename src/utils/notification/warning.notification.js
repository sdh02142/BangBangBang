import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../response/createResponse.js';

const warningNotification = (user, warningType, time) => {
  const responsePayload = {
    warningNotification: {
      warningType: warningType,
      expectedAt: time,
    },
  };

  user.socket.write(createResponse(PACKET_TYPE.WARNING_NOTIFICATION, 0, responsePayload));
};

export default warningNotification;

// message S2CWarningNotification {
//     WarningType warningType = 1;
//     int64 expectedAt = 2; // 밀리초 타임스탬프
// }

// enum WarningType {
//     NO_WARNING = 0;
//     BOMB_WANING = 1; // 설마 오타..? BOMB_WAR 인데 WAN 으로 되어있네.,. 확인해봤는데 클라이언트에서도 WAN으로 되어 있는 것 같음
// }
