import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { createResponse } from '../response/createResponse.js';

/**
 *
 * @param {Game} room
 * @param {User} winner
 * @returns
 */
export const gameEndNotification = (room, winner) => { //언제 돌아가야 하는지... 인터벌매니저로?
  // 정상적으로 게임이 끝나는 경우
  // 보안관이 사망한 경우 or 무법자 + 배신자 사망한 경우 or 배신자만 살아남은 경우
  // 생존한 유저(승리자) 찾기
  // 생존한 유저의 역할 찾기

  let responsePayload;
  console.log('winner.characterData.roleType:', winner.characterData.roleType);
  let winners = [winner.id];
  console.log("winners:",winners)
  if ( //보안관 승리
    winner.characterData.roleType === Packets.RoleType.TARGET ||
    winner.characterData.roleType === Packets.RoleType.BODYGUARD
  ) {
    responsePayload = {
      gameEndNotification: {
        winners: [winner.id],
        winType: Packets.WinType.TARGET_AND_BODYGUARD_WIN,
      },
    };
  }
  if (winner.characterData.roleType === Packets.RoleType.HITMAN) { //무법자 승리
    responsePayload = {
      gameEndNotification: {
        winners: winner.id,
        winType: Packets.WinType.HITMAN_WIN,
      },
    };
  }
  if (winner.characterData.roleType === Packets.RoleType.PSYCHOPATH) { //배신자 승리
    responsePayload = {
      gameEndNotification: {
        winners: winner.id,
        winType: Packets.WinType.PSYCHOPATH_WIN,
      },
    };
  }

  room.users.forEach((user) => {
    user.socket.write(createResponse(PACKET_TYPE.GAME_END_NOTIFICATION, 0, responsePayload));
  });

  // 게임 종료 시 게임 세션 삭제
  // winner.roomId

  // 비정상적으로 게임이 끝나는 경우
  // 강제 종료 - 클라? 강제로 누군가 승리로?
  

};

// message S2CGameEndNotification {
//     repeated int64 winners = 1;
//     WinType winType = 2;
// }

// enum WinType {
//     TARGET_AND_BODYGUARD_WIN = 0; 보안관 + 부관
//     HITMAN_WIN = 1; 무법자
//     PSYCHOPATH_WIN = 2; 배신자
// }
