import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../response/createResponse.js';

const userUpdateNotification = (users) => {
  const responsePayload = {
    userUpdateNotification: {
      user: users.map((user) => {
        // TODO: 바뀐 애들만 보내기
        return user.makeRawObject();
      }),
    },
  };

  users.forEach((user) => {
    user.socket.write(createResponse(PACKET_TYPE.USER_UPDATE_NOTIFICATION, 0, responsePayload));
  });
};

export default userUpdateNotification;

// message S2CUserUpdateNotification {
//     repeated UserData user = 1;
// }
