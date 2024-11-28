const equipCardNotification = (cardType, cardUsingUserId) => {
  const responsePayload = {
    equipCardNotification: {
      cardType: cardType,
      userId: cardUsingUserId,
    },
  };

  return responsePayload;
};

export default equipCardNotification;

/**
 * message S2CEquipCardNotification {
    CardType cardType = 1;
    int64 userId = 2;
}
 */
