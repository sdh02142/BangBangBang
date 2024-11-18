import testDBConnection from '../utils/db/testConnection.js';
import { loadCharacterPositions } from './loadPositions.js';
import { loadProto } from './loadProtos.js';

const initServer = async () => {
  try {
    await testDBConnection();
    await loadProto();
    loadCharacterPositions();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default initServer;
