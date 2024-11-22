// CardHandler 맵핑 해둘 곳
import { bbangCardHandler } from './bbangCard.handler.js';
import { bigBbangCardHandler } from './bigBbangCard.handler.js';
import { call119CardHandler } from './call119Card.handler.js';
import { maturedSavingsCardHandler } from './maturedSavingsCard.handler.js';
import { shieldCardHandler } from './shieldCard.handler.js';
import { vaccineCardHandler } from './vaccineCard.handler.js';
import { winLotteryCardHandler } from './winLotteryCard.handler.js';

const cardHandlers = {
  // BBANG 1
  [1]: bbangCardHandler,
  // BIG_BBANG 2
  [2]: bigBbangCardHandler,
  // SHIELD 3
  [3]: shieldCardHandler,
  // VACCINE 4
  [4]: vaccineCardHandler,
  // CALL_119 5
  [5]: call119CardHandler,
  // DEATH_MATCH 6
  [6]: () => {},
  // GUERRILLA 7
  [7]: () => {},
  // ABSORB 8
  // HALLUCINATION 9
  // FLEA_MARKET 10
  // MATURED_SAVINGS 11
  [11]: maturedSavingsCardHandler,
  // WIN_LOTTERY 12
  [12]: winLotteryCardHandler,
  // SNIPER_GUN 13
  // HAND_GUN 14
  // DESERT_EAGLE 15
  // AUTO_RIFLE 16
  // LASER_POINTER 17
  // RADAR 18
  // AUTO_SHIELD 19
  // STEALTH_SUIT 20
  // CONTAINMENT_UNIT 21
  // SATELLITE_TARGET 22
  // BOMB 23
};

const getCardHandlerByCardType = (useCardType) => cardHandlers[useCardType];

export default getCardHandlerByCardType;
