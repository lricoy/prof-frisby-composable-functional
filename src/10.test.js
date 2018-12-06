// Unbox types with foldMap
const { Map, List } = require("immutable-ext");
const { Sum } = require("./monoid");

test("we may fold a list using a monoid identity as the initial value", () => {
  expect(List.of(Sum(1), Sum(2), Sum(3)).fold(Sum.empty()).x).toEqual(6);
});

test("we may fold a Map that holds monoids", () => {
  expect(Map({brian: Sum(3), sara: Sum(5)}).fold(Sum.empty()).x).toEqual(8);
});

test("we may foldMap a Map to have the same result", () => {
  expect(Map({ brian: 3, sara: 5 }).foldMap(Sum, Sum.empty()).x).toEqual(8);
});
