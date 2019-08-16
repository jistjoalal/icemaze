const assert = require("assert");
const { IceMazeSolver } = require("./main");

const {
  badMap,
  map,
  map2,
  map3,
  map4,
  map5,
  map6,
  map7,
  map8,
  map9,
  map10
} = require("./maps");

const tests = [
  {
    name: "badMap",
    map: badMap,
    exp: null
  },
  {
    name: "map",
    map: map,
    exp: [..."urdlur"]
  },
  {
    name: "map2",
    map: map2,
    exp: [..."lur"]
  },
  {
    name: "map3",
    map: map3,
    exp: [..."lurur"]
  },
  {
    name: "map4",
    map: map4,
    exp: [..."ulururdluldrdrur"]
  },
  {
    name: "map5",
    map: map5,
    exp: [..."ld"]
  },
  {
    name: "map6",
    map: map6,
    exp: [..."uluulur"]
  },
  {
    name: "map7",
    map: map7,
    exp: [..."ululullulul"]
  },
  {
    name: "map8",
    map: map8,
    exp: [..."dlururuururdrdrdlul"]
  },
  {
    name: "map9",
    map: map9,
    exp: null
  },
  {
    // not returning optimal solution (below)
    name: "map10",
    map: map10,
    exp: [..."urululuu"]
  }
];

const test = f => ({ name, map, exp }) => {
  console.log(`
    #######  TESTING:
    #######  - ${name}
  `);
  const start = +new Date();
  const res = f(map);
  assert.deepStrictEqual(res, exp);
  console.log(`
    ✓✓✓✓✓✓✓  PASSED
    ✓✓✓✓✓✓✓ - ${name} - ${+new Date() - start} ms
  `);
};

tests.forEach(test(IceMazeSolver));
