import { PACKET_TYPE } from "../../constants/header.js";
import { getAllGameSessions } from "../../sessions/game.session.js"
import { createResponse } from "../../utils/response/createResponse.js";

const getRoomListHandler = (socket, payload) => {
    const rooms = getAllGameSessions(); // 현재 있는 게임들 배열
    //TODO: 방생성 후 테스트 요망
    // const responseRooms = rooms.forEach((game) => {
    //     return { 
    //         id: game.id, 
    //         ownerId: game.ownerId, 
    //         name: game.name, 
    //         maxUserNum: game.maxUserNum, 
    //         state: game.roomStateType, 
    //         users: game.users // 루프 돌려서 받아와야 할 수도 있음
    //     };
    // });
    
    const responsePayload = {
        getRoomListResponse: {
            rooms: rooms,
        }
    }

    socket.write(createResponse(PACKET_TYPE.GET_ROOM_LIST_RESPONSE, 0, responsePayload));
}

export default getRoomListHandler;

// message S2CGetRoomListResponse{
//     repeated RoomData rooms = 1;
// }

//message RoomData {
//    int32 id = 1;
//    string ownerId = 2;
//    string name = 3;
//    int32 maxUserNum = 4;
//    RoomStateType state = 5; // WAIT 0, PREPARE 1, INAGAME 2
//    repeated UserData users = 6; // 인덱스 기반으로 턴 진행
//}