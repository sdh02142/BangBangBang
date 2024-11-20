import { characterPositions } from '../../init/loadPositions.js';
import { Packets } from '../../init/loadProtos.js';

export const phaseUpdateNotification = (game) => {
  // 밤 30000밀리초
  // 낮 180000밀리초
  let nextPhaseAt = 0;
  switch (game.currentPhase) {
    case Packets.PhaseType.DAY:
      nextPhaseAt = 180000;
      break;
    // // 음성 채팅만 가능한 회의 시간(붙이려면 클라 추가해야함)
    // // 지금 어차피 클라에서 안받는다 함
    // case Packets.PhaseType.EVENING:
    //   nextPhaseAt = Infinity;
    //   break;
    case Packets.PhaseType.END:
      nextPhaseAt = 30000;
      break;
  }

  // 낮인 경우만 위치가 다시 셔플돼서 updatePosition
  // 밤에는 현재 위치
  if (game.currentPhase === Packets.PhaseType.DAY) {
    const inGameUsers = game.users;
    // 랜덤 위치 뽑기
    const selectedPositions = new Set();
    while (true) {
      if (selectedPositions.size === inGameUsers.length) {
        break;
      }

      const randId = Math.floor(Math.random() * 20);
      selectedPositions.add(characterPositions[randId]); // 0부터 방의 20 길이까지의 랜덤
    }
    console.log(selectedPositions);

    // 선택된 위치 정보는 JSON의 id고, 그걸 접속한 유저의 아이디로 치환
    const posArr = [...selectedPositions];
    for (let i = 0; i < inGameUsers.length; i++) {
      posArr[i].id = inGameUsers[i].id;
      // UPDATE: 초기 좌표 세팅
      inGameUsers[i].updatePosition(posArr[i].x, posArr[i].y);
    }
  }

  const responsePayload = {
    phaseUpdateNotification: {
      phaseType: game.currentPhase,
      nextPhaseAt: Date.now() + nextPhaseAt,
      characterPositions: game.users.map((user) => {
        return { id: user.id, x: user.getX(), y: user.getY() };
      }),
    },
  };

  return responsePayload;
};

// message S2CPhaseUpdateNotification {
//     PhaseType phaseType = 1; // DAY 1, EVENING 2, END 3
//     int64 nextPhaseAt = 2; // 다음 페이즈 시작 시점(밀리초 타임스탬프)
//     repeated CharacterPositionData characterPositions = 3; // 변경된 캐릭터 위치
// }
