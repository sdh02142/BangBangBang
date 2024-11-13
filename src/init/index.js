import { loadProto } from './loadProtos.js';

const initServer = async () => {
  try {
    // TODO:
    // DB 연결 테스트
    await loadProto();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default initServer;
