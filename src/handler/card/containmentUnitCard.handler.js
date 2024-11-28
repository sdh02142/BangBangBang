import { getStateNormal, getStateContained } from '../../constants/stateType.js';
import { Packets } from '../../init/loadProtos.js';

export const containmentUnitCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  targetUser.characterData.debuffs.push(Packets.CardType.CONTAINMENT_UNIT);
};

// 상태를 Contained 로 바꾸면 클라이언트상에서 움직일 수 없음
// 다음날 시작시 25%확률로 효과가 발동 X? 그러니깐 감금 디버프에 걸렸다고 무조건 다음날 감금이 아니라 25%확률로 무효 가능
// 페이즈 변환시(낮) 감금 디버프를 가지고 있는 유저를 25퍼 확률로 감금 상태로 만든다
// 다음 페이즈(밤)이 되면 감금 디버프가 풀린다.
// 페이즈 변환시 유저의 디버프를 보고 거기서 확률로 상태를 변환시켜야 할듯?
