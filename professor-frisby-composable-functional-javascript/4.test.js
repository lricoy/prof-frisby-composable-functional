// Use chain for composable error handling with nested Either
const fs = require("fs");

const id = x => x;
const Right = x => ({
  chain: f => f(x),
  map: f => Right(f(x)),
  fold: (f, g) => g(x),
  inspect: () => `Right(${x})`
});

const Left = x => ({
  chain: f => Left(x),
  map: f => Left(x),
  fold: (f, g) => f(x),
  inspect: () => `Left(${x})`
});

const fromNullable = x => (x != null ? Right(x) : Left(null));

const tryCatch = f => {
  try {
    return Right(f());
  } catch (e) {
    return Left(e);
  }
};

// const getPort = () => {
//   try {
//     const config = JSON.parse(str)
//     return config.port
//   } catch(e) {
//     return 3000
//   }
// }

const getPort = () =>
  tryCatch(() => fs.readFileSync("./config.json"))
    .chain(c => tryCatch(() => JSON.parse(c))) //Right(string) -> Right(Right(json)) // chain: Right(string) -> Right(json)
    .fold(_ => 3000, config => config.port);

// const result = getPort();
// console.log(result);
// process.exit()

test("should return 3000 if something goes wrong", () => {
  expect(getPort()).toBe(3000);
});
