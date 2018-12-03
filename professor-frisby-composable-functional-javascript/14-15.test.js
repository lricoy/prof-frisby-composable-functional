// You've been using Functors
// Lift into a Pointed Functor with of

const Box = require("./box");
const Task = require("data.task");
const Either = require("./either");
const { Right, Left, fromNullabe } = Either;
const { List, Map } = require("immutable-ext");

// fx.map(f).map(g) == fx.map(x => g(f(x)))

test("can use box", () => {
  expect(Box(1).fold(x => x)).toEqual(1);
});

test("Box respects the first law", () => {
  const f = x => x + 1;
  const g = x => x - 1;

  expect(
    Box(2)
      .map(f)
      .map(g)
      .fold()
  ).toEqual(
    Box(2)
      .map(x => g(f(x)))
      .fold()
  );
});

test("Right respects the first law", () => {
  const f = x => x + 1;
  const g = x => x - 1;

  expect(
    Right(2)
      .map(f)
      .map(g)
      .inspect()
  ).toEqual(
    Right(2)
      .map(x => g(f(x)))
      .inspect()
  );
});

const id = x => x;
// Second law: fx.map(id) == id(fx)

test("Box respects the second law", () => {
  expect(
    Box(2)
      .map(id)
      .inspect()
  ).toEqual(id(Box(2)).inspect());
});

test("All known functors respects the second law", () => {
  const functors = [Box, Right, Left, List];

  functors.forEach(fx => {
    expect(
      fx(["crayons"])
        .map(id)
        .inspect()
    ).toEqual(id(fx(["crayons"])).inspect());
  });
});

test("Box can use .of as a pointed functor", () => {
  expect(
    Box.of("anything")
      .map(x => x + "!")
      .inspect()
  ).toEqual(Box("anything!").inspect());
});
