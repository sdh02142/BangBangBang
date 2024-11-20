const positionUpdateNotification = (users) => {
  const responsePayload = {
    positionUpdateNotification: {
      characterPositions: users.map((user) => {
        return { id: user.id, x: user.getX(), y: user.getY() };
      }),
    },
  };

  return responsePayload;
};

export default positionUpdateNotification;

// message S2CPositionUpdateNotification {
//     repeated CharacterPositionData characterPositions = 1;
// }

// message CharacterPositionData {
//     int64 id = 1; // 유저의 아이디
//     double x = 2;
//     double y = 3;
// }
