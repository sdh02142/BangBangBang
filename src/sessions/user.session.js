import { userSession } from "./session.js";

export const addUser = (user) => {
    // 로그인 시 유저 생성하고 세션에 넣기
    // const user = new User();
    userSession.push(user);

    // 추가 된 유저를 반환할 필요가 있으면 주석 해제
    // return user;
}

export const removeUser = (socket) => {
    const index = userSession.findIndex((user) => user.socket === socket);
    // 못 찾은 경우
    if (index === -1) {
        console.error('유저를 찾지 못했습니다.');
        return null;
    }

    return userSession.splice(index, 1)[0];
}

export const findUserById = (id) => {
    return userSession.find((user) => user.id === id);
}

export const getUserBySocket = (socket) => {
    return userSession.find((user) => user.socket === socket);
}

// 상대한테 카드 쓸 때 닉네임을 통해 상대 정보를 받아올 수 있지 않을까? 라는 의견
export const getUserByNickname = (nickname) => {
    return userSession.find((user) => user.nickname === nickname);
}