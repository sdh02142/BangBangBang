import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import useCardNotification from '../../utils/notification/useCard.notification.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { pinkHandler } from '../character/pink.handler.js';
import getCardHandlerByCardType from './index.js';

//캐릭터 정보
// 빨강이 (CHA00001) 하루에 원하는만큼 빵야!를 사용할 수 있다. // 캐릭터 데이터 설정할 때 BBangCount 추가 설정
// 상어군 (CHA00003) 빵야!를 막기 위해 쉴드 2개가 필요함. //
// 말랑이 (CHA00005) 생명력을 1 잃을 때마다 카드 한장을 획득한다. //
// 개굴군 (CHA00007) 표적이 될 때 25% 확률로 공격을 막는다. //
// 핑크군 (CHA00008) 남은 카드가 없으면 새로 카드를 한장 받는다. //
// 물안경군 (CHA00009) 추가로 두명의 위치가 미니맵에 표시 됨 (최대 4명) - 클라
// 가면군 (CHA00010) 다른 사람이 사망 시 장비중인 카드 포함 모든 카드를 손에 가져온다. //
// 공룡이 (CHA00012) 다른 유저에게서 미니맵 상 위치를 감춤 - 클라
// 핑크슬라임 (CHA00013) 피격 시 가해자의 카드를 한장 가져옴. //

export const useCardHandler = (socket, payload) => {
  const useCardType = payload.useCardRequest.cardType; //사용 카드
  const targetUserId = payload.useCardRequest.targetUserId.low; //대상자 ID
  const cardUsingUser = getUserBySocket(socket); //카드 사용자
  const currentGame = findGameById(cardUsingUser.roomId);
  const targetUser = currentGame.findInGameUserById(targetUserId);

  const cardHandler = getCardHandlerByCardType(useCardType);
  if (!cardHandler) {
    console.error('카드 핸들러를 찾을 수 없습니다.');
    return;
  }

  // 에러 안나면 아무것도 반환하지 않기
  const errorResponse = cardHandler(cardUsingUser, targetUser, currentGame);
  if (errorResponse) {
    // 뭔가 에러가 났음.
    console.error('카드 핸들러: 뭔가 문제 있음');
    socket.write(createResponse(PACKET_TYPE.USE_CARD_RESPONSE, 0, errorResponse));
    return;
  }

  // if (!cardUsingUser.canUseBbang()) {
  //   // 빵야 실패
  //   const errorResponse = {
  //     useCardResponse: {
  //       success: false,
  //       failCode: Packets.GlobalFailCode.ALREADY_USED_BBANG,
  //     },
  //   };
  //   return errorResponse;
  // }
  // 공통 로직
  // cardUsingUser.decreaseHandCardsCount(); // 카드 사용자의 손에 들고 있던 카드 수 감소
  cardUsingUser.removeHandCard(useCardType); // 카드 사용자의 손에 들고 있던 카드 제거
  currentGame.returnCardToDeck(useCardType); // 카드 덱으로 복귀
  // 카드를 사용하고 덱에서 삭제 되었을 때, 손에 남은 카드가 0이고 캐릭터가 핑크군이면 실행
  if (
    cardUsingUser.characterData.handCardsCount === 0 &&
    cardUsingUser.characterData.characterType === Packets.CharacterType.PINK
  ) {
    pinkHandler(cardUsingUser, currentGame);
  }
  const useCardNotificationResponse = useCardNotification(
    useCardType,
    cardUsingUser.id,
    targetUserId,
  );

  //게임 방 안에 모든 유저들에게 카드 사용알림
  currentGame.users.forEach((user) => {
    user.socket.write(
      createResponse(PACKET_TYPE.USE_CARD_NOTIFICATION, 0, useCardNotificationResponse),
    );
  });

  // 동기화
  userUpdateNotification(currentGame.users);

  // 성공 response 전송
  const responsePayload = {
    useCardResponse: {
      success: true,
      failCode: Packets.GlobalFailCode.NONE_FAILCODE,
    },
  };

  socket.write(createResponse(PACKET_TYPE.USE_CARD_RESPONSE, 0, responsePayload));
};
