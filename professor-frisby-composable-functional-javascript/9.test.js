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

console.log(`Sum(${Sum(2).concat(Sum(3)).x})`); // 5

const Product = x => ({
  x,
  concat: ({ x: y }) => Product(x * y)
});
Product.empty = () => Product(1);

console.log(`Product(${Product(2).concat(Product(5)).x})`); // 10

const Any = x => ({
  x,
  concat: ({ x: y }) => Any(x || y)
});
Any.empty = () => Any(false);

console.log(`Any(${Any(true).concat(Any(false)).x})`);
console.log(`Any(${Any(false).concat(Any(false)).x})`);

const All = x => ({
  x,
  concat: ({ x: y }) => All(x && y)
});
All.empty = () => All(true);

console.log(`All(${All(true).concat(All(true)).x})`);
console.log(`All(${All(true).concat(All(false)).x})`);

const Max = x => ({
  x,
  concat: ({ x: y }) => Max(x > y ? x : y)
});
Max.empty = () => Max(Number.MIN_SAFE_INTEGER);

console.log(`Max(${Max(10).concat(Max(2)).x})`); // 10

const Min = x => ({
  x,
  concat: ({ x: y }) => Min(x < y ? x : y)
});
Min.empty = () => Min(Number.MAX_SAFE_INTEGER);

console.log(`Min(${Min(10).concat(Min(2)).x})`); // 2

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

console.log(
  "foldMap",
  stats
    .foldMap(x => fromNullable(x.views).map(Sum), Right(Sum(0)))
    .fold(e => `Left(${e})`, s => `Sum(${s.x})`)
);

console.log(
  "foldMap statsWithNull",
  statsWithNull
    .foldMap(x => fromNullable(x.views).map(Sum), Right(Sum(0)))
    .fold(e => `Left(${e})`, s => `Sum(${s.x})`)
);

// foldMap will build the combination:
console.log(
  Right(Sum(0))
    .concat(Right(Sum(40)))
    .concat(Right(Sum(10)))
    .concat(Right(Sum(4)))
    .fold(e => `Left(${e})`, s => `Sum(${s.x})`)
);

const foldMap = (mapFn, id, list) =>
  list.reduce((acc, val) => {
    // console.log(acc.fold(y => y, x => x.x), val);
    return acc.concat(mapFn(val));
  }, id);

console.log(
  foldMap(x => fromNullable(x.views).map(Sum), Right(Sum(0)), [
    { page: "Home", views: 40 },
    { page: "About", views: 10 },
    { page: "Blog", views: 4 }
  ]).fold(e => `Left(${e})`, s => `Sum(${s.x})`)
);

console.log(
  foldMap(x => fromNullable(x.views).map(Sum), Right(Sum(0)), [
    { page: "Home", views: 40 },
    { page: "About", views: null }
  ]).fold(e => `Left(${e})`, s => `Sum(${s.x})`)
);

console.log(
  Right(Sum(0))
    .concat(Right(Sum(40)))
    .concat(Right(Sum(10)))
    .concat(Left(null))
    .fold(e => `Left(${e})`, s => `Sum(${s.x})`)
);

const First = either => ({
  fold: f => f(either),
  concat: o => (either.isLeft ? o : First(either))
});
First.empty = () => First(Left());

console.log(
  `First(${First("this is the first")
    .concat(First.empty())
    .fold(x => x)})`
);

const find = (xs, f) =>
  List(xs)
    .foldMap(x => First(f(x) ? Right(x) : Left()), First.empty())
    .fold(id);

console.log(find([3, 4, 5, 6, 7], x => x > 4).inspect());

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

console.log(["gym", "bird", "lilac"].filter(x => both.fold(x).x));

const Pair = (x, y) => ({
  x,
  y,
  concat: ({ x: x1, y: y1 }) => Pair(x.concat(x1), y.concat(y1))
});

const combinedPair = Pair(First("Hello"), Sum(2)).concat(
  Pair(First("second"), Sum(5))
);

console.log(`Pair(${combinedPair.x.fold(id)},${combinedPair.y.fold(id)})`);
