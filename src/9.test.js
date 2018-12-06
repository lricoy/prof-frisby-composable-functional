// A curated collection of Monoids and their uses
const { List } = require("immutable-ext");

const id = x => x;
const compose = (f, g) => x => f(g(x));

const Right = x => ({
  chain: f => f(x),
  ap: other => other.map(x),
  traverse: (of, f) => f(x).map(Right),
  map: f => Right(f(x)),
  fold: (f, g) => g(x),
  concat: o => o.fold(_ => Right(x), y => Right(x.concat(y))),
  inspect: () => `Right(${x})`,
  isLeft: false
});

const Left = x => ({
  chain: f => Left(x),
  ap: other => Left(x),
  traverse: (of, f) => of(Left(x)),
  map: f => Left(x),
  fold: (f, g) => f(x),
  concat: o => o.fold(_ => Left(x), y => o),
  inspect: () => `Left(${x})`,
  isLeft: true
});

const fromNullable = x => (x != null ? Right(x) : Left(null));

const tryCatch = f => {
  try {
    return Right(f());
  } catch (e) {
    return Left(e);
  }
};

const Sum = x => ({
  x,
  fold: f => f(x),
  concat: ({ x: y }) => Sum(x + y)
});
Sum.empty = () => Sum(0);

test("Sum monoid is working", () => {
  expect(Sum(2).concat(Sum(3)).x).toEqual(5);
});

const Product = x => ({
  x,
  concat: ({ x: y }) => Product(x * y)
});
Product.empty = () => Product(1);

test("Product monoid is working", () => {
  expect(Product(2).concat(Product(5)).x).toEqual(10);
});

const Any = x => ({
  x,
  concat: ({ x: y }) => Any(x || y)
});
Any.empty = () => Any(false);

test("Any monoid is working", () => {
  expect(Any(true).concat(Any(false)).x).toEqual(true);
  expect(Any(false).concat(Any(false)).x).toEqual(false);
});

const All = x => ({
  x,
  concat: ({ x: y }) => All(x && y)
});
All.empty = () => All(true);

test("All monoid is working", () => {
  expect(All(true).concat(All(true)).x).toEqual(true);
  expect(All(true).concat(All(false)).x).toEqual(false);
});

const Max = x => ({
  x,
  concat: ({ x: y }) => Max(x > y ? x : y)
});
Max.empty = () => Max(Number.MIN_SAFE_INTEGER);

test("Max monoid is working", () => {
  expect(Max(10).concat(Max(2)).x).toEqual(10);
  expect(Max(-10).concat(Max(-2)).x).toEqual(-2);
});

const Min = x => ({
  x,
  concat: ({ x: y }) => Min(x < y ? x : y)
});
Min.empty = () => Min(Number.MAX_SAFE_INTEGER);

test("Min monoid is working", () => {
  expect(Min(10).concat(Min(2).concat(Min(0))).x).toEqual(0);
});

const stats = List.of(
  { page: "Home", views: 40 },
  { page: "About", views: 10 },
  { page: "Blog", views: 4 }
);

const statsWithNull = List.of(
  { page: "Home", views: 40 },
  { page: "About", views: 10 },
  { page: "Blog", views: null }
);

test("that foldMapping the list with immutable-ext foldMap will return the correct Sum", () => {
  expect(
    stats
      .foldMap(x => fromNullable(x.views).map(Sum), Right(Sum(0)))
      .fold(e => `Left(${e})`, s => `Sum(${s.x})`)
  ).toEqual(`Sum(54)`);
});

test("that foldMapping the list with immutable-ext foldMap in a collection with null values will return the correct Sum", () => {
  expect(
    statsWithNull
      .foldMap(x => fromNullable(x.views).map(Sum), Right(Sum(0)))
      .fold(e => `Left(${e})`, s => `Sum(${s.x})`)
  ).toEqual(`Sum(50)`);
});

test("that sequentially concating yields the same result", () => {
  // foldMap will build the combination:
  expect(
    Right(Sum(0))
      .concat(Right(Sum(40)))
      .concat(Right(Sum(10)))
      .concat(Right(Sum(4)))
      .fold(e => `Left(${e})`, s => `Sum(${s.x})`)
  ).toEqual(`Sum(54)`);
});

test("that building the combinations with a Left(null) also yields Sum(50)", () => {
  expect(
    Right(Sum(0))
      .concat(Right(Sum(40)))
      .concat(Right(Sum(10)))
      .concat(Left(null))
      .fold(e => `Left(${e})`, s => `Sum(${s.x})`)
  ).toEqual(`Sum(50)`);
});

const foldMap = (mapFn, id, list) =>
  list.reduce((acc, val) => {
    // console.log(acc.fold(y => y, x => x.x), val);
    return acc.concat(mapFn(val));
  }, id);

test("that the custom foldMap with arrays work", () => {
  // foldMap will build the combination:
  expect(
    foldMap(x => fromNullable(x.views).map(Sum), Right(Sum(0)), [
      { page: "Home", views: 40 },
      { page: "About", views: 10 },
      { page: "Blog", views: 4 }
    ]).fold(e => `Left(${e})`, s => `Sum(${s.x})`)
  ).toEqual(`Sum(54)`);
});

test("that the custom foldMap with works with null values as well", () => {
  // foldMap will build the combination:
  expect(
    foldMap(x => fromNullable(x.views).map(Sum), Right(Sum(0)), [
      { page: "Home", views: 40 },
      { page: "About", views: null }
    ]).fold(e => `Left(${e})`, s => `Sum(${s.x})`)
  ).toEqual(`Sum(40)`);
});

const First = either => ({
  fold: f => f(either),
  concat: o => (either.isLeft ? o : First(either))
});
First.empty = () => First(Left());

test("that First is now a monoid", () => {
  expect(
    First("this is the first")
      .concat(First.empty())
      .fold(x => x)
  ).toEqual(`this is the first`);
});

const findFirst = (xs, f) =>
  List(xs)
    .foldMap(x => First(f(x) ? Right(x) : Left()), First.empty())
    .fold(id);

test("that findFirst is working", () => {
  expect(findFirst([3, 4, 5, 6, 7], x => x > 4).inspect()).toEqual(`Right(5)`);
});

const Fn = f => ({
  fold: f,
  concat: o => Fn(x => f(x).concat(o.fold(x)))
});

const hasVowels = x => !!x.match(/[aeiou]/gi);
const longWord = x => x.length >= 5;
const both = Fn(
  compose(
    All,
    hasVowels
  )
).concat(
  Fn(
    compose(
      All,
      longWord
    )
  )
);

test("that both works", () => {
  expect(["gym", "bird", "lilac"].filter(x => both.fold(x).x)).toEqual([
    "lilac"
  ]);
});

const Pair = (x, y) => ({
  x,
  y,
  concat: ({ x: x1, y: y1 }) => Pair(x.concat(x1), y.concat(y1))
});

test("that both works", () => {
  const combinedPair = Pair(First("Hello"), Sum(2)).concat(
    Pair(First("second"), Sum(5))
  );
  expect(combinedPair.x.fold(id)).toEqual("Hello");
  expect(combinedPair.y.fold(id)).toEqual(7);
});
