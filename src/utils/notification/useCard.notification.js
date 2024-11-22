const useCardNotification = (cardType, cardUsingUserId, targetUserId = 0) => {
  console.log('targetUserId:', targetUserId);
  const responsePayload = {
    useCardNotification: {
      cardType: cardType,
      userId: cardUsingUserId,
      targetUserId: targetUserId,
    },
  };

  return responsePayload;
};

export default useCardNotification;

// message S2CUseCardNotification {
//     CardType cardType = 1;
//     int64 userId = 2;
//     int64 targetUserId = 3; // 타겟 없으면 빈 값
// }
