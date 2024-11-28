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
import { hallucinationCardHandler } from './hallucinationCard.handler.js';
import { fleaMarketCardHandler } from './fleaMarketCard.handler.js';
import { absorbCardHandler } from './absorbCard.handler.js';
import { containmentUnitCardHandler } from './containmentUnitCard.handler.js';
import { bombCardHandler } from './bombCard.handler.js';
import { satelliteTargetCardHandler } from './satelliteTargetCard.handler.js';
import { handGunCardHandler } from './handGunCard.handler.js';
import { desertEagleCardHandler } from './desertEagleCard.handler.js';
import { autoRifleCardHandler } from './autoRifleCard.handler.js';
import { sniperGunCardHandler } from './sniperGunCard.handler.js';
import { laserPointerHandler } from './laserPointer.handler.js';
import { radarHandler } from './radarCard.handler.js';
import { autoShieldHandler } from './autoShieldCard.handler.js';
import { stealthSuitHandler } from './stealthSuitCard.handler.js';

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
  [8]: absorbCardHandler,
  // HALLUCINATION 9
  [9]: hallucinationCardHandler,
  // FLEA_MARKET 10
  [10]: fleaMarketCardHandler,
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
  [17]: laserPointerHandler,
  // RADAR 18
  [18]: radarHandler,
  // AUTO_SHIELD 19
  [19]: autoShieldHandler,
  // STEALTH_SUIT 20
  [20]: stealthSuitHandler,
  // CONTAINMENT_UNIT 21
  [21]: containmentUnitCardHandler,
  // SATELLITE_TARGET 22
  [22]: satelliteTargetCardHandler,
  // BOMB 23
  [23]: bombCardHandler,
};

const getCardHandlerByCardType = (useCardType) => cardHandlers[useCardType];

export default getCardHandlerByCardType;
