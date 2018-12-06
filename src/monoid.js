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

const Product = x => ({
  x,
  concat: ({ x: y }) => Product(x * y)
});
Product.empty = () => Product(1);

const Any = x => ({
  x,
  concat: ({ x: y }) => Any(x || y)
});
Any.empty = () => Any(false);

const All = x => ({
  x,
  concat: ({ x: y }) => All(x && y)
});
All.empty = () => All(true);

const Max = x => ({
  x,
  concat: ({ x: y }) => Max(x > y ? x : y)
});
Max.empty = () => Max(Number.MIN_SAFE_INTEGER);

const Min = x => ({
  x,
  concat: ({ x: y }) => Min(x < y ? x : y)
});
Min.empty = () => Min(Number.MAX_SAFE_INTEGER);

const First = either => ({
  fold: f => f(either),
  concat: o => (either.isLeft ? o : First(either))
});
First.empty = () => First(Left());

const Fn = f => ({
  fold: f,
  concat: o => Fn(x => f(x).concat(o.fold(x)))
});

const Pair = (x, y) => ({
  x,
  y,
  toList: () => [x, y],
  bimap: (f, g) => Pair(f(x), g(y)),
  concat: ({ x: x1, y: y1 }) => Pair(x.concat(x1), y.concat(y1))
});

module.exports = {
  Right,
  Left,
  fromNullable,
  tryCatch,
  Sum,
  Product,
  Any,
  All,
  Max,
  Min,
  First,
  Fn,
  Pair
};
