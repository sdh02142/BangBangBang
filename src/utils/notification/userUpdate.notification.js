const userUpdateNotification = (users) => {
    const responsePayload = {
        userUpdateNotification: { 
            userData: {
                users
            }
         }
    };
    
    
    return responsePayload;
}

export default userUpdateNotification;