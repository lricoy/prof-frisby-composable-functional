// Type conversions with natural transformations

/**
 What the devil is a natural transformation? Simply put, and perhaps naively 
 put, it's just a type conversion. It's taking one functor to another. 
 A natural transformation is actually a function that takes a functor holding 
 some a to another functor holding that a. it's a structural change. F a -> G a
*/
const { Either, Right, Left, fromNullable } = require("./either");
const Box = require("./box");
const Task = require("data.task");
const { List } = require("immutable-ext");

// F a -> G a
// nt(x).map(f) == nt(x.map(f))

const boxToEither = b => b.fold(Right);
const first = xs => fromNullable(xs[0]);
const eitherToTask = e => e.fold(Task.rejected, Task.of);

test("boxToEither must respect our natural transformation law", () => {
  // Law : nt(x).map(f) == nt(x.map(f))
  const nt = boxToEither;
  const f = x => x * 2;
  const x = Box(100);

  const res1 = nt(x).map(f);
  const res2 = nt(x.map(f));

  expect(res1.inspect()).toEqual(res2.inspect());
});

test("first must respect our natural transformation law", () => {
  // Law : nt(x).map(f) == nt(x.map(f))
  const nt = first;
  const f = x => x + 1;
  const x = [1, 2, 3];

  const res1 = nt(x).map(f);
  const res2 = nt(x.map(f));

  expect(res1.inspect()).toEqual(res2.inspect());
});

// test("eitherToTask must respect our natural transformation law", () => {
//   const liftA2 = (f, fx, fy) => fx.map(f).ap(fy);

//   const nt = eitherToTask;
//   const f = s => s.toUpperCase();
//   const x = Right("nightingale");

//   const res1 = nt(x).map(f);
//   const res2 = nt(x.map(f));

//   const checkItIsTrue = a => b => a === b;

//   liftA2(checkItIsTrue, res1, res2).fork(
//     e => console.log(e),
//     result => expect(result).toBeTruthy()
//   );
// });
