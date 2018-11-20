// Unbox types with foldMap
const { Map, List } = require("immutable-ext");
const { Sum } = require('./monoid');

// const res = List.of(Sum(1), Sum(2), Sum(3))
//   .fold(Sum.empty())

// const res = Map({brian: Sum(3), sara: Sum(5)})
//   .fold(Sum.empty())

const res = Map({brian: 3, sara: 5})
  .foldMap(Sum, Sum.empty())

console.log(res);

