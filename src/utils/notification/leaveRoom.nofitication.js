const leaveRoomNotification = (user) => {
    const responsePayload = {
        leaveRoomNotification: { userId: user.id }
    };

    return responsePayload;
}

export default leaveRoomNotification;