import { Packets } from '../../init/loadProtos.js';

/**
 *
 * @param {Game} room
 * @param {User} me: <<---- 노티 받는 사람
 * @returns
 */
export const gamePrepareNotification = (room, me) => {
  const responsePayload = {
    gamePrepareNotification: {
      room: {
        id: room.id,
        ownerId: room.ownerId,
        name: room.name,
        maxUserNum: room.maxUserNum,
        state: Packets.RoomStateType.PREPARE,
        users: room.users.map((user) => {
          // 본인이 아닌 경우 or target이 아닌 경우 handCards, roleType 빈 값
          // target인 경우 본인이 아니어도 roleType을 알고있어야함.
          // handCards는 본인이 아닌경우 아무도 몰라야함.
          if (user.id !== me.id) {
            const otherUser = user.makeRawObject();
            otherUser.character.handCards = [];
            if (otherUser.character.roleType !== Packets.RoleType.TARGET) {
              otherUser.character.roleType = Packets.RoleType.NONE_ROLE;
            }
            return otherUser;
          }

          // 본인인 경우 그대로
          return user.makeRawObject();
        }),
      },
    },
  };

  return responsePayload;
};

// message UserData {
//     int64 id = 1;
//     string nickname = 2;
//     CharacterData character = 3;
// }

// S2CGamePrepareNotification gamePrepareNotification = 19;
// message S2CGamePrepareNotification {
//     RoomData room = 1;
// }
