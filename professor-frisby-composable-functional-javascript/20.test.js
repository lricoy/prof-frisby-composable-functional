// List comprehensions with Applicative Functors
const { List } = require("immutable-ext");

const merch = () => List.of(x => x).ap(List([1, 2, 3]));

test("we may generate lists with applicatives", () => {
  expect(
    List.of(x => x)
      .ap(List([1, 2, 3]))
      .toJS()
  ).toEqual([1, 2, 3]);
});

test("me may generate lists with applicatives in combination", () => {
  expect(
    List.of(x => y => `${x}-${y}`)
      .ap(List(["teeshirt", "sweater"]))
      .ap(List(["large", "medium", "small"]))
      .toJS()
  ).toEqual([
    "teeshirt-large",
    "teeshirt-medium",
    "teeshirt-small",
    "sweater-large",
    "sweater-medium",
    "sweater-small"
  ]);
});

test("me may do the same with liftA2", () => {
  const liftA2 = (f, fx, fy) => fx.map(f).ap(fy);
  expect(
    liftA2(
      x => y => `${x}-${y}`,
      List(["teeshirt", "sweater"]),
      List(["large", "medium", "small"])
    ).toJS()
  ).toEqual([
    "teeshirt-large",
    "teeshirt-medium",
    "teeshirt-small",
    "sweater-large",
    "sweater-medium",
    "sweater-small"
  ]);
});

test("me may generate lists with applicatives in combination with even more lists", () => {
  expect(
    List.of(x => y => z => `${x}-${y}-${z}`)
      .ap(List(["teeshirt", "sweater"]))
      .ap(List(["large", "medium", "small"]))
      .ap(List(["black"]))
      .toJS()
  ).toEqual([
    "teeshirt-large-black",
    "teeshirt-medium-black",
    "teeshirt-small-black",
    "sweater-large-black",
    "sweater-medium-black",
    "sweater-small-black"
  ]);
});

