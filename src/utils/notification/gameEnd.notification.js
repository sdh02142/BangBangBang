import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { createResponse } from '../response/createResponse.js';
import { removeGameSession } from '../../sessions/game.session.js';
import intervalManager from '../../classes/manager/interval.manager.js';
import { roomManager } from '../../classes/manager/room.manager.js';
/**
 *
 * @param {Game} room
 * @returns
 */
export const gameEndNotification = (room) => { 
  // 정상적으로 게임이 끝나는 경우
  const survivor = [];
  room.users.forEach((user) => {
    if (user.characterData.hp > 0) {
      // 생존자 확인
      survivor.push({ id: user.id, role: user.characterData.roleType });
    }
  });

  const isTarget = survivor.find((user) => user.role === Packets.RoleType.TARGET);
  const isBodyguard = survivor.find((user) => user.role === Packets.RoleType.BODYGUARD);
  const isHitman = survivor.find((user) => user.role === Packets.RoleType.HITMAN);
  const isPsychopath = survivor.find((user) => user.role === Packets.RoleType.PSYCHOPATH);

  let responsePayload;

  if (!isTarget && isHitman) {
    //히트맨 승리
    console.log('히트맨 승리');
    const winners = room.users.filter((user) => user.characterData.roleType === Packets.RoleType.HITMAN);
    const winnerIds = winners.map((user) => user.id);
    responsePayload = {
      gameEndNotification: {
        winners: winnerIds,
        winType: Packets.WinType.HITMAN_WIN,
      },
    };
  }
  if (!isTarget && !isBodyguard && !isHitman && isPsychopath) {
    //싸이코패스 승리
    console.log('싸이코패스 승리');
    const winners = room.users.filter((user) => user.characterData.roleType === Packets.RoleType.PSYCHOPATH);
    const winnerIds = winners.map((user) => user.id);
    responsePayload = {
      gameEndNotification: {
        winners: winnerIds,
        winType: Packets.WinType.PSYCHOPATH_WIN,
      },
    };
  }
  if (!isHitman && !isPsychopath) {
    //타겟 & 보디가드 승리
    console.log('타겟&보디가드 승리');
    const winners = room.users.filter((user) => user.characterData.roleType === Packets.RoleType.TARGET || user.characterData.roleType === Packets.RoleType.BODYGUARD);
    const winnerIds = winners.map((user) => user.id);
    responsePayload = {
      gameEndNotification: {
        winners: winnerIds,
        winType: Packets.WinType.TARGET_AND_BODYGUARD_WIN,
      },
    };
  }

  if (responsePayload){
    room.users.forEach((user) => {
      user.socket.write(createResponse(PACKET_TYPE.GAME_END_NOTIFICATION, 0, responsePayload));
    });
    //게임 종료 시 인터벌 제거, 세션 삭제
    intervalManager.removeInterval(room.id, 'game');
    removeGameSession(room.id);
    roomManager.deleteRoom(room.id);
  }
  // 비정상적으로 게임이 끝나는 경우

  // 강제 종료 - 클라? 강제로 누군가 승리로?
};

//TODO: 게임이 끝난 후 다시 방을 만들고 접속이 안됨

// message S2CGameEndNotification {
//     repeated int64 winners = 1;
//     WinType winType = 2;
// }

// enum WinType {
//     TARGET_AND_BODYGUARD_WIN = 0; 보안관 + 부관
//     HITMAN_WIN = 1; 무법자
//     PSYCHOPATH_WIN = 2; 배신자
// }
