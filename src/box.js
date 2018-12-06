const Box = x => ({
  ap: b2 => b2.map(x), // b2 is a Functor
  map: f => Box(f(x)),
  fold: (f = x => x) => f(x),
  chain: f => f(x),
  inspect: () => `Box(${x})`
});
Box.of = (x) => Box(x);

module.exports = Box;