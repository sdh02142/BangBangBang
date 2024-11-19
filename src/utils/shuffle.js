const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // 0에서 i 사이의 무작위 인덱스 생성
        [array[i], array[j]] = [array[j], array[i]]; // 요소 위치를 교환
    }
    return array;
}

export default shuffle;