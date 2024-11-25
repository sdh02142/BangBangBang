import { Packets } from '../init/loadProtos.js';

export const getStateNormal = () => {
  return {
    currentState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now(),
    targetUserId: 0,
  };
};

export const getStateBbangShooter = (targetUser) => {
  return {
    currentState: Packets.CharacterStateType.BBANG_SHOOTER,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + 5000,
    targetUserId: targetUser,
  };
};

export const getStateBbangTarget = (targetUser) => {
  return {
    currentState: Packets.CharacterStateType.BBANG_TARGET,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + 5000,
    targetUserId: targetUser,
  };
};

export const getStateBigBbangShooter = (targetUser) => {
  return {
    currentState: Packets.CharacterStateType.BIG_BBANG_SHOOTER,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + 5000,
    targetUserId: targetUser,
  };
};

export const getStateBigBbangTarget = (targetUser) => {
  return {
    currentState: Packets.CharacterStateType.BIG_BBANG_TARGET,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + 5000,
    targetUserId: targetUser,
  };
};

export const getStateDeathInitShooter = (targetUser) => {
  return {
    currentState: Packets.CharacterStateType.DEATH_MATCH_STATE,
    nextState: Packets.CharacterStateType.DEATH_MATCH_TURN_STATE,
    nextStateAt: Date.now() + 5000,
    targetUserId: targetUser,
  };
};

export const getStateDeathInitTarget = (targetUser) => {
  return {
    currentState: Packets.CharacterStateType.DEATH_MATCH_TURN_STATE,
    nextState: Packets.CharacterStateType.DEATH_MATCH_STATE,
    nextStateAt: Date.now() + 5000,
    targetUserId: targetUser,
  };
};

export const getStateDeathMatchShooter = (User) => {
  return {
    currentState: Packets.CharacterStateType.DEATH_MATCH_STATE,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + 5000,
    targetUserId: User.characterData.stateInfo.stateTargetUserId,
  };
};

export const getStateDeathMatchTarget = (User) => {
  return {
    currentState: Packets.CharacterStateType.DEATH_MATCH_TURN_STATE,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + 5000,
    targetUserId: User.characterData.stateInfo.stateTargetUserId,
  };
};

export const getStateDeathMatchEnd = (targetUser) => {
  return {
    currentState: Packets.CharacterStateType.DEATH_MATCH_STATE,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + 5000,
    targetUserId: targetUser,
  };
}; // 안 쓸 거 같기도..?


/**
 *   
 * NONE_CHARACTER_STATE = 0;
    DEATH_MATCH_STATE = 3; // 현피 중 자신의 턴이 아닐 때
    DEATH_MATCH_TURN_STATE = 4; // 현피 중 자신의 턴
 * 
 * 
 *   const stateType = {
    normal:{
        currentState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
        nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
        nextStateAt: Date.now(),
        targetUserId: 0,
    },
    
    
  };
 */
