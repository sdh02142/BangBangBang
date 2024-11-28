import phaseTime from '../../constants/phaseTime.js';
import { getStateContained, getStateNormal } from '../../constants/stateType.js';
import { characterPositions } from '../../init/loadPositions.js';
import { Packets } from '../../init/loadProtos.js';
import { animationNotification } from './animation.notification.js';
import userUpdateNotification from './userUpdate.notification.js';

export const phaseUpdateNotification = (game) => {
  // 낮인 경우만 위치가 다시 셔플돼서 updatePosition
  // 밤에는 현재 위치
  if (game.currentPhase === Packets.PhaseType.DAY) {
    game.day++;
    console.log(`${game.day}번째 낮`);

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

    // 선택된 위치 정보는 JSON의 id고, 그걸 접속한 유저의 아이디로 치환
    const posArr = [...selectedPositions];
    for (let i = 0; i < inGameUsers.length; i++) {
      posArr[i].id = inGameUsers[i].id;
      // UPDATE: 초기 좌표 세팅
      inGameUsers[i].updatePosition(posArr[i].x, posArr[i].y);
    }

    // 낮이 시작되면 카드 버려주기(어차피 hp보다 적거나 같으면 안버리면 됨)
    inGameUsers.forEach((user) => {
      const userOverHandedCount = user.overHandedCount();
      console.log(`[${user.nickname}]: 카드 ${userOverHandedCount} 장 자동 삭제`);

      if (userOverHandedCount > 0) {
        for (let i = 0; i < userOverHandedCount; i++) {
          // 오버한 갯수만큼 랜덤하게 손패 삭제
          const randomCard =
            user.characterData.handCards[
              Math.floor(Math.random() * user.characterData.handCards.length)
            ];
          user.removeHandCard(randomCard.type); // <- randomCard 값이 안읽히는 것 같음
        }
      }
    });

    // 빵야 카운트 리셋, 카드 두 개씩 주기
    inGameUsers.forEach((user) => {
      for (let i = 0; i < 2; i++) {
        const card = game.deck.shift();
        user.addHandCard(card);
      }

      user.resetBbangCount();
    });

    // 페이즈 전환시 25퍼 확률로 감옥가는 로직
    // 이 로직 전체를 함수화서 prion(inGameUsers)를 할 수 있게 나중에 구현?
    const prisonUsers = inGameUsers.filter((user) =>
      user.characterData.debuffs.includes(Packets.CardType.CONTAINMENT_UNIT),
    );

    prisonUsers.forEach((user) => {
      if (user.characterData.stateInfo.state === Packets.CharacterStateType.CONTAINED) {
        user.setCharacterState(getStateNormal());
        user.characterData.debuffs = user.characterData.debuffs.filter(
          (debuff) => debuff !== Packets.CardType.CONTAINMENT_UNIT,
        );
      } else if (!(Math.random() < 0.25)) {
        user.setCharacterState(getStateContained());
      } else console.log(`${user}가 25퍼 확률을 뚫고 감옥에 가지 않음`);
    });

    // 위성 타겟 로직
    // 3퍼센트 확률로 체력 3 깎기
    // 이것도 나중에 함수화하면 좋을 듯?
    // 애니메이션 추가 해야됨
    const satelliteUser = inGameUsers.find((user) =>
      user.characterData.debuffs.includes(Packets.CardType.SATELLITE_TARGET),
    );

    if (satelliteUser) {
      // 3퍼센트 확률로 hp 3 감소
      if (Math.random() < 0.03) {
        satelliteUser.decreaseHp(3);
        // 현재 유저에서 디버프 제거
        satelliteUser.characterData.debuffs = satelliteUser.characterData.debuffs.filter(
          (debuff) => debuff !== Packets.CardType.SATELLITE_TARGET,
        );
        animationNotification(
          inGameUsers,
          satelliteUser,
          Packets.AnimationType.SATELLITE_TARGET_ANIMATION,
        );
      } else {
        // 3% 확률 실패 시 디버프를 다음 유저에게 이동
        const currentIndex = inGameUsers.indexOf(satelliteUser);
        const nextIndex = (currentIndex + 1) % inGameUsers.length;
        const nextUser = inGameUsers[nextIndex];

        // 현재 유저에서 디버프 제거
        satelliteUser.characterData.debuffs = satelliteUser.characterData.debuffs.filter(
          (debuff) => debuff !== Packets.CardType.SATELLITE_TARGET,
        );

        // 다음 유저에게 디버프 추가
        nextUser.characterData.debuffs.push(Packets.CardType.SATELLITE_TARGET);
      }
    }
  }

  // inGameUsers.forEach((user) => {
  //   user.resetBbangCount(); // 내부에서 캐릭터 특성에 따라
  // })

  const responsePayload = {
    phaseUpdateNotification: {
      phaseType: game.currentPhase,
      nextPhaseAt: Date.now() + phaseTime[game.currentPhase],
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
