import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../response/createResponse.js';

export const animationNotification = (users, animationUser, animationType) => {
  const responsePayload = {
    animationNotification: {
      userId: animationUser.id,
      animationType: animationType,
    },
  };

  users.forEach((user) => {
    user.socket.write(createResponse(PACKET_TYPE.ANIMATION_NOTIFICATION, 0, responsePayload));
  });
};

// message S2CAnimationNotification {
//     int64 userId = 1;
//     AnimationType animationType = 2;
// }
