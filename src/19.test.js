// Apply multiple functors as arguments to a function (Applicatives)

const { Either } = require("./either");

const liftA2 = (f, fx, fy) => fx.map(f).ap(fy);

const $ = selector => Either.of({ selector, height: 10 });

const getScreenSize = screen => head => foot =>
  screen - (head.height + foot.height);

test(`Either is a applicative functor`, () => {
  expect(
    Either.of(getScreenSize(800))
      .ap($("header"))
      .ap($("footer"))
      .inspect()
  ).toEqual(`Right(780)`);
});

test(`We may use liftA2 to apply multiple functors as arguments to a function`, () => {
  expect(
    liftA2(getScreenSize(800), $("header"), $("footer")).inspect()
  ).toEqual(`Right(780)`);
});

test(`We may do the same thing, but sequentially, using just the Functors api`, () => {
  expect(
    $("header").chain(head =>
      $("footer").map(footer => getScreenSize(800)(head)(footer))
    ).inspect()
  ).toEqual(`Right(780)`);
});
