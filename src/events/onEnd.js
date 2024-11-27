import { leaveRoomHandler } from '../handler/room/leaveRoom.handler.js';
import { Packets } from '../init/loadProtos.js';
import { findGameById } from '../sessions/game.session.js';
import { getUserBySocket, removeUser } from '../sessions/user.session.js';

export const onEnd = (socket) => () => {
  try {
    console.log('클라이언트 연결이 종료되었습니다.');
    const user = getUserBySocket(socket);
    const currentGame = findGameById(user.roomId);
    if (currentGame.state === Packets.RoomStateType.WAIT) {
      //게임 시작 전
      leaveRoomHandler(socket);
    }
    if (currentGame.state === Packets.RoomStateType.PREPARE){
      //게임 세팅 중
      setTimeout(()=>{
        user.setHp(0);
        removeUser(socket);
      },5000)
      return;
    }
    if (currentGame.state === Packets.RoomStateType.INAGAME) {
      //인 게임
      user.setHp(0);
    }
    

    removeUser(socket);
  } catch (e) {
    removeUser(socket);
  }
};
