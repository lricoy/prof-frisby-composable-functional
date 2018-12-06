// Applicative Functors for multiple arguments
// Note: Functions must be curried for the magic of .ap to work

const Box = require("./box");

const add = x => y => x + y;

test("Applicative functors can apply a Functor holding a function to a Functor holding a value", () => {
  const res = Box(add).ap(Box(2));
  expect(res.inspect()).toEqual(`Box(y => x + y)`);
});

test("Applicative functors can be applied in sequence", () => {
  expect(Box(add).inspect()).toEqual(`Box(x => y => x + y)`);

  // Box(add).ap(Box(2)) === Box(2).map(add)
  expect(
    Box(add)
      .ap(Box(2))
      .inspect()
  ).toEqual(`Box(y => x + y)`);

  // Box(y => 2 + y).ap(Box(3)) === Box(3).map(y => 2 + y)
  expect(
    Box(add)
      .ap(Box(2))
      .ap(Box(3))
      .inspect()
  ).toEqual(`Box(5)`);
});

/**
  Notice it's very important that this is in the curried form. It takes one argument at a time, and that's because it's going ahead and applying each Box one at a time. That's how this whole situation works.

Anyway, so far, a Box(x).map(f) is really all we've had to work with. map only gives it one argument at a time. This is a useful tool to have.

We call this applicative functors if it has an ap method. Now there are some laws here. If I have a. 
// F(x).map(f) == F(f).ap(F(x))
 */

test("for any functor F holding an x, calling F.map(f), is equal to a functor holding f applied to a functor holding x.", () => {
  // F(x).map(f) == F(f).ap(F(x))
  const liftA2 = (f, Fx, Fy) => Fx.map(f).ap(Fy); // === F(f).ap(fy)
  expect(
    Box(add) // Functor holding f applied to functor holding x
      .ap(Box(2))
      .ap(Box(3))
      .inspect()
      // liftA2: Functor holding x calling F.map(f)
  ).toEqual(liftA2(add, Box(2), Box(3)).inspect());
});

/**
 * Down here, it's a little bit clearer, perhaps, depending on your point of view. We can define a liftA3 and a  liftA4. Here's a liftA3. We'll take an fz here, and apply fz, and so on. That will give us the ability to apply multiple arguments to a function in a generic way.
 */
const liftA3 = (f, fx, fy, fz) => fx.map(f).ap(fy).ap(fz)