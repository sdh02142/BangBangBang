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
//   GUERRILLA_SHOOTER = 7; // 게릴라 시전자
//   GUERRILLA_TARGET = 8; // 게릴라 대상

export const getStateGuerrillaShooter = (targetUser) => {
  return {
    currentState: Packets.CharacterStateType.GUERRILLA_SHOOTER,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + 5000,
    targetUserId: targetUser,
  };
};

export const getStateGuerrillaTarget = (targetUser) => {
  return {
    currentState: Packets.CharacterStateType.GUERRILLA_TARGET,
    nextState: Packets.CharacterStateType.NONE_CHARACTER_STATE,
    nextStateAt: Date.now() + 5000,
    targetUserId: targetUser,
  };
};

/**
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
