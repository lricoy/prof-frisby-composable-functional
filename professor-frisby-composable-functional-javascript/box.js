const Box = x => ({
  map: f => Box(f(x)),
  fold: (f = x => x) => f(x),
  chain: f => f(x),
  inspect: () => `Box(${x})`
});
Box.of = (x) => Box(x);

module.exports = Box;