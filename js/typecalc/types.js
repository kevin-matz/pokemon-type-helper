export const Types = {
    normal: "normal",
    fire: "fire",
    water: "water",
    electric: "electric",
    grass: "grass",
    ice: "ice",
    fighting: "fighting",
    poison: "poison",
    ground: "ground",
    flying: "flying",
    psychic: "psychic",
    bug: "bug",
    rock: "rock",
    ghost: "ghost",
    dragon: "dragon",
    dark: "dark",
    steel: "steel",
    fairy: "fairy"
}

const _ = 1;
const h = 1 / 2;
const x = NaN;

const gen1 = [
    [_, _, _, _, _, _, _, _, _, _, _, _, h, 0, _, x, x, x],
    [_, h, h, _, 2, 2, _, _, _, _, _, 2, h, _, h, x, x, x],
    [_, 2, h, _, h, _, _, _, 2, _, _, _, 2, _, h, x, x, x],
    [_, _, 2, h, h, _, _, _, 0, 2, _, _, _, _, h, x, x, x],
    [_, h, 2, _, h, _, _, h, 2, h, _, h, 2, _, h, x, x, x],
    [_, _, h, _, 2, h, _, _, 2, 2, _, _, _, _, 2, x, x, x],
    [2, _, _, _, _, 2, _, h, _, h, h, h, 2, 0, _, x, x, x],
    [_, _, _, _, 2, _, _, h, h, _, _, 2, h, h, _, x, x, x],
    [_, 2, _, 2, h, _, _, 2, _, 0, _, h, 2, _, _, x, x, x],
    [_, _, _, h, 2, _, 2, _, _, _, _, 2, h, _, _, x, x, x],
    [_, _, _, _, _, _, 2, 2, _, _, h, _, _, _, _, x, x, x],
    [_, h, _, _, 2, _, h, 2, _, h, 2, _, _, h, _, x, x, x],
    [_, 2, _, _, _, 2, h, _, h, 2, _, 2, _, _, _, x, x, x],
    [0, _, _, _, _, _, _, _, _, _, 0, _, _, 2, _, x, x, x],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, 2, x, x, x],
    [x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x],
    [x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x],
    [x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x],
    [x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x],
];

const gen2To5 = [
    [_, _, _, _, _, _, _, _, _, _, _, _, h, 0, _, _, h, x],
    [_, h, h, _, 2, 2, _, _, _, _, _, 2, h, _, h, _, 2, x],
    [_, 2, h, _, h, _, _, _, 2, _, _, _, 2, _, h, _, _, x],
    [_, _, 2, h, h, _, _, _, 0, 2, _, _, _, _, h, _, _, x],
    [_, h, 2, _, h, _, _, h, 2, h, _, h, 2, _, h, _, h, x],
    [_, h, h, _, 2, h, _, _, 2, 2, _, _, _, _, 2, _, h, x],
    [2, _, _, _, _, 2, _, h, _, h, h, h, 2, 0, _, 2, 2, x],
    [_, _, _, _, 2, _, _, h, h, _, _, _, h, h, _, _, 0, x],
    [_, 2, _, 2, h, _, _, 2, _, 0, _, h, 2, _, _, _, 2, x],
    [_, _, _, h, 2, _, 2, _, _, _, _, 2, h, _, _, _, h, x],
    [_, _, _, _, _, _, 2, 2, _, _, h, _, _, _, _, 0, h, x],
    [_, h, _, _, 2, _, h, h, _, h, 2, _, _, h, _, 2, h, x],
    [_, 2, _, _, _, 2, h, _, h, 2, _, 2, _, _, _, _, h, x],
    [0, _, _, _, _, _, _, _, _, _, 2, _, _, 2, _, h, h, x],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, 2, _, h, x],
    [_, _, _, _, _, _, h, _, _, _, 2, _, _, 2, _, h, h, x],
    [_, h, h, h, _, 2, _, _, _, _, _, _, 2, _, _, _, h, x],
    [x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x],
];

const gen6To9 = [
    [_, _, _, _, _, _, _, _, _, _, _, _, h, 0, _, _, h, _],
    [_, h, h, _, 2, 2, _, _, _, _, _, 2, h, _, h, _, 2, _],
    [_, 2, h, _, h, _, _, _, 2, _, _, _, 2, _, h, _, _, _],
    [_, _, 2, h, h, _, _, _, 0, 2, _, _, _, _, h, _, _, _],
    [_, h, 2, _, h, _, _, h, 2, h, _, h, 2, _, h, _, h, _],
    [_, h, h, _, 2, h, _, _, 2, 2, _, _, _, _, 2, _, h, _],
    [2, _, _, _, _, 2, _, h, _, h, h, h, 2, 0, _, 2, 2, h],
    [_, _, _, _, 2, _, _, h, h, _, _, _, h, h, _, _, 0, 2],
    [_, 2, _, 2, h, _, _, 2, _, 0, _, h, 2, _, _, _, 2, _],
    [_, _, _, h, 2, _, 2, _, _, _, _, 2, h, _, _, _, h, _],
    [_, _, _, _, _, _, 2, 2, _, _, h, _, _, _, _, 0, h, _],
    [_, h, _, _, 2, _, h, h, _, h, 2, _, _, h, _, 2, h, h],
    [_, 2, _, _, _, 2, h, _, h, 2, _, 2, _, _, _, _, h, _],
    [0, _, _, _, _, _, _, _, _, _, 2, _, _, 2, _, h, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, 2, _, h, 0],
    [_, _, _, _, _, _, h, _, _, _, 2, _, _, 2, _, h, _, h],
    [_, h, h, h, _, 2, _, _, _, _, _, _, 2, _, _, _, h, 2],
    [_, h, _, _, _, _, 2, h, _, _, _, _, _, _, 2, 2, h, _],
];

// https://pokemondb.net/type

function getDamageBase(typeAtk, typeDef, gen) {
    let typeAtkIdx = Object.keys(Types).indexOf(typeAtk);
    let typeDefIdx = Object.keys(Types).indexOf(typeDef);
    if (gen === 1) {
        // Gen 1
        return gen1[typeAtkIdx][typeDefIdx];
    } else if ([2, 3, 4, 5].includes(gen)) {
        // Gen 2-5
        return gen2To5[typeAtkIdx][typeDefIdx];
    } else if ([6, 7, 8, 9].includes(gen)) {
        // Gen 6-9 (nice)
        return gen6To9[typeAtkIdx][typeDefIdx];
    }
}

export function getDamage(typeAtk, typeDef1, typeDef2, gen) {
    if (typeDef2 === null) {
        return getDamageBase(typeAtk, typeDef1, gen);
    }
    return getDamageBase(typeAtk, typeDef1, gen) * getDamageBase(typeAtk, typeDef2, gen);
}
