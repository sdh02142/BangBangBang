import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export let characterPositions = null;

export const loadCharacterPositions = () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const positionsPath = path.resolve(__dirname, '../assets/characterPositionData.json');

    try {
        const data = readFileSync(positionsPath, 'utf-8');
        const parsedData = JSON.parse(data);
        characterPositions = parsedData.position;

        if (characterPositions) {
            console.log('characterPositionData.json 로드 성공');
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}