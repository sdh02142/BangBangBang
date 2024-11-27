import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../response/createResponse.js';

export const fleaMarketNotification = (gainCardUser, cardTypes, pickIndex, currentUsers, fleaMarketUsers) => {
    const responsePayload = {
        fleaMarketNotification: {
            cardTypes: cardTypes,
            pickIndex: pickIndex,
      },
    };
    if(currentUsers.length === fleaMarketUsers.length){
      currentUsers.forEach((user) => {
        user.socket.write(createResponse(PACKET_TYPE.FLEA_MARKET_NOTIFICATION, 0, responsePayload));
      });
      console.log('처음 플리마켓 사용 Notification')
    } else {
      gainCardUser.socket.write(createResponse(PACKET_TYPE.FLEA_MARKET_NOTIFICATION, 0, responsePayload));
      fleaMarketUsers.forEach((user) => {
      user.socket.write(createResponse(PACKET_TYPE.FLEA_MARKET_NOTIFICATION, 0, responsePayload));
    });
    console.log('카드 선택 플리마켓 Notification')
    };  
  };

// message S2CFleaMarketNotification {
//     repeated CardType cardTypes = 1;
//     repeated int32 pickIndex = 2;
// }