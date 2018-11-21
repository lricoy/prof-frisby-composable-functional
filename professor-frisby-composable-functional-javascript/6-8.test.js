// Create types with Semigroups
// Semigroup examples
// Ensure failsafe combination using monoids

const { Map } = require("immutable-ext");
// Create types with Semigroups
// const res = "a".concat("b").concat("c")
// const res = [1,2].concat([3,4].concat([5,6]))

const Sum = x => ({
  x,
  concat: o => Sum(x + o.x),
  inspect: () => `Sum(${x})`
});
Sum.empty = () => Sum(0);

test('Sum monoid concats by using addition', () =>{
  expect(Sum(1).concat(Sum(2)).x).toEqual(3)
})
test('Sum monoid work with its identity', () =>{
  expect(Sum.empty().concat(Sum(1).concat(Sum(2))).x).toEqual(3)
})

const All = x => ({
  x,
  concat: ({ x: y }) => All(x && y),
  inspect: () => `Sum(${x})`
});
All.empty = () => All(true);

test('All monoid should remain true only if All concats are truthy', () =>{
  expect(All(true).concat(All(false)).x).toEqual(false)
  expect(All(true).concat(All(true)).x).toEqual(true)
})
test('All monoid work with its identity', () =>{
  expect(All.empty().concat(All(true).concat(All(false))).x).toEqual(false)
})

// Only a semigroup because it does not have a id function
const First = x => ({
  x,
  concat: _ => First(x),
  inspect: () => `Sum(${x})`
});

test('First should always keep the first item', () =>{
  expect(First('blah').concat(First('ice cream')).concat(First('twice')).x).toEqual('blah')
  // We don't have a identity function for First so far
})

const acct1 = Map({
  name: First("Nico"),
  isPaid: All(true),
  points: Sum(10),
  friends: ["Franklin"]
});

const acc2 = Map({
  name: First("Nico"),
  isPaid: All(false),
  points: Sum(2),
  friends: ["Gatsby"]
});

console.log((acct1.concat(acc2)).toJS());

const sum = xs => xs.reduce((acc, x) => acc + x, 0);
const all = xs => xs.reduce((acc, x) => acc && x, true);
const first = xs => xs.reduce((acc, x) => acc);

test('sum works with a empy array', () => {
  expect(sum([])).toEqual(0);
})

test('all works with a empy array', () => {
  expect(all([])).toEqual(true);
})

test('first to blow up with a empty array', () => {
  expect(() => first([])).toThrowError();
})
