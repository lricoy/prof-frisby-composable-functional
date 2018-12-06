// Enforce null check with composable code branching using Either

const id = x => x;
const Right = x => ({
  map: f => Right(f(x)),
  fold: (f, g) => g(x),
  inspect: () => `Right(${x})`
});

const Left = x => ({
  map: f => Left(x),
  fold: (f, g) => f(x),
  inspect: () => `Left(${x})`
});

test("result should be a Right of 4", () => {
  expect(
    Right(3)
      .map(x => x + 1)
      .inspect()
  ).toBe(`Right(4)`);
});

test("result should be a Right of 2", () => {
  expect(
    Right(3)
      .map(x => x + 1)
      .map(x => x / 2)
      .inspect()
  ).toBe(`Right(2)`);
});

test("Left should refuse to do anything with the value", () => {
  expect(
    Left(3)
      .map(x => x + 1)
      .map(x => x / 2)
      .inspect()
  ).toBe(`Left(3)`);
});

test("it should branch accordingly", () => {
  expect(
    Left(2)
      .map(x => x + 1)
      .map(x => x / 2)
      .fold(x => "error", x => x)
  ).toBe(`error`);

  expect(
    Right(2)
      .map(x => x + 1)
      .map(x => x / 2)
      .fold(x => "error", x => x)
  ).toBe(1.5);
});

const fromNullable = x => 
  x != null ? Right(x) : Left(null);

const findColor = name => 
  fromNullable({ red: "#ff4444", blue: "#3b5998", yellow: "#fff68f" }[name]);

test("It should return the appropriate Functor", () => {
  expect(findColor("red").fold(x => "not found", id)).toBe("#ff4444");
  expect(findColor("do not exist").fold(x => "not found", id)).toBe(
    "not found"
  );
});

test("When using either we can guard and branch", () => {
  expect(
    findColor("green")
      .map(c => c.slice(1))
      .fold(e => "no color", 
            c => c.toUpperCase())
  ).toBe('no color');

  expect(
    findColor("blue")
      .map(c => c.slice(1))
      .fold(e => "no color", 
            c => c.toUpperCase())
  ).toBe('3B5998');
});
