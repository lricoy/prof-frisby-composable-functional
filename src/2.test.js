// Refactor imperative code to a single composed expressiong using Box

const Box = x => ({
  map: f => Box(f(x)),
  fold: f => f(x),
  toString: () => `Box(${x})`
});

const moneyToFloat = str =>
  Box(str)
    .map(s => s.replace(/\$/g, ""))
    .map(parseFloat);

const percentToFloat = str =>
  Box(str.replace(/\%/g, ""))
    .map(parseFloat)
    .map(n => n * 0.01);

const applyDiscount = (price, discount) =>
  moneyToFloat(price).fold(cost =>
    percentToFloat(discount).fold(savings => cost - cost * savings)
  );

test("expects final count to be 4", () => {
  expect(applyDiscount("$5.00", "20%")).toEqual(4);
});
