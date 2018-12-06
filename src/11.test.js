// Delay evaluation with LazyBox
const Box = x => ({
  fold: f => f(x),
  map: f => Box(f(x)),
  inspect: () => `Box(${x})`
});

const LazyBox = g => ({
  fold: f => f(g()),
  map: f => LazyBox(() => f(g())),
  inspect: () => `LazyBox(${g})`
});

const result = LazyBox(() => ` 64 `)
  .map(abba => abba.trim())
  .map(trimmed => new Number(trimmed))
  .map(number => number + 1)
  .map(x => String.fromCharCode(x))
  .fold(x => x.toLowerCase());

test("LazyBox will do nothing until we fold it", () => {
  const spy = jest.fn(x => x);
  const result = LazyBox(() => ` 64 `)
    .map(abba => abba.trim())
    .map(trimmed => new Number(trimmed))
    .map(number => number + 1)
    .map(x => String.fromCharCode(x))
    .map(spy);
    
  expect(spy).not.toHaveBeenCalled();
  expect(result).not.toEqual('a');
});

test("LazyBox will do stuff when we fold it", () => {
  const spy = jest.fn(x => x);
  LazyBox(() => ` 64 `)
    .map(abba => abba.trim())
    .map(trimmed => new Number(trimmed))
    .map(number => number + 1)
    .map(x => String.fromCharCode(x))
    .map(spy)
    .fold(x => x.toLowerCase());

  expect(spy).toHaveBeenCalledWith('A');
  expect(result).toEqual('a');
});