const Right = x => ({
  _name: `Right(${x})`,
  _value: x,
  ap: F => F.map(x),
  chain: f => f(x),
  map: f => Right(f(x)),
  fold: (f, g) => g(x),
  inspect: () => `Right(${x})`
});

const Left = x => ({
  _name: `Left(${x})`,
  _value: x,
  ap: F => Left(x),
  chain: f => Left(x),
  map: f => Left(x),
  fold: (f, g) => f(x),
  inspect: () => `Left(${x})`
});
const fromNullable = x => (x != null ? Right(x) : Left(null));

const tryCatch = f => {
  try {
    return Right(f());
  } catch (e) {
    return Left(e);
  }
};

const Either = {
  of: x => Right(x)
};

module.exports = {
  Either,
  Right,
  Left,
  fromNullable,
  tryCatch
};
