
const shuffle = <T>(a: T[]) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const getRandomElement = <T>(elementList: T[]): T => {
    let randomNumber: number = Math.random() * (elementList.length - 1);
    let roundRandomNumber: number = Math.round(randomNumber);
    return elementList[roundRandomNumber]
}

const getNumberInRange = (min: number, max: number, round: boolean = true): number => {
    let number = Math.random() * (max - min) + min;
    if (round) {
        number = Math.round(number);
    }
    return number;
}

export {
    shuffle,
    getRandomElement,
    getNumberInRange
}