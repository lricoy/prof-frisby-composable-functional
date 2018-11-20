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

console.log(Sum.empty().concat(Sum(1).concat(Sum(2))));

const All = x => ({
  x,
  concat: ({ x: y }) => All(x && y),
  inspect: () => `Sum(${x})`
});
All.empty = () => All(true);

console.log(All.empty().concat(All(true).concat(All(false))))

const First = x => ({
  x,
  concat: _ => First(x),
  inspect: () => `Sum(${x})`
});

console.log(First('blah').concat(First('ice cream')).concat(First('twice')))

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

console.log(first([1, 2, 3]))// will give back 1
console.log(first([]))// will blow up
