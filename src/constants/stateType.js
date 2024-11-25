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
};

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
