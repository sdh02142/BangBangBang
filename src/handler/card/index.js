// CardHandler 맵핑 해둘 곳
import { bbangCardHandler } from './bbangCard.handler.js';
import { bigBbangCardHandler } from './bigBbangCard.handler.js';
import { call119CardHandler } from './call119Card.handler.js';
import { guerrillaCardHandler } from './guerrillaCard.handler.js';
import { maturedSavingsCardHandler } from './maturedSavingsCard.handler.js';
import { shieldCardHandler } from './shieldCard.handler.js';
import { vaccineCardHandler } from './vaccineCard.handler.js';
import { winLotteryCardHandler } from './winLotteryCard.handler.js';
import { deathMatchCardHandler } from './deathMatchCard.handler.js';
import { handGunCardHandler } from './handGunCard.handler.js';
import { desertEagleCardHandler } from './desertEagleCard.handler.js';
import { autoRifleCardHandler } from './autoRifleCard.handler.js';
import { sniperGunCardHandler } from './sniperGunCard.handler.js';

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
  [6]: deathMatchCardHandler,
  // GUERRILLA 7
  [7]: guerrillaCardHandler,
  // ABSORB 8
  // HALLUCINATION 9
  // FLEA_MARKET 10
  // MATURED_SAVINGS 11
  [11]: maturedSavingsCardHandler,
  // WIN_LOTTERY 12
  [12]: winLotteryCardHandler,
  // SNIPER_GUN 13
  [13]: sniperGunCardHandler,
  // HAND_GUN 14
  [14]: handGunCardHandler,
  // DESERT_EAGLE 15
  [15]: desertEagleCardHandler,
  // AUTO_RIFLE 16
  [16]: autoRifleCardHandler,
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
