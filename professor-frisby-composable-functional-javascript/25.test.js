// Apply natural transformations in everyday work

const { List } = require("immutable-ext");

test("we may use the List constructor as a natural transformation", () => {
  expect(
    List(["hello", "world"])
      .chain(x => List(x.split("")))
      .toJS()
  ).toEqual(["h", "e", "l", "l", "o", "w", "o", "r", "l", "d"]);
});

const { fromNullable } = require("./either");

const first = xs => fromNullable(xs[0]);

const largeNumbers = xs => xs.filter(x => x > 100);

const larger = x => x * 2;

test("We will get a Right(800)", () => {
  const app = xs => first(largeNumbers(xs).map(larger));

  expect(app([2, 400, 5, 100]).inspect()).toEqual(`Right(800)`);
});

test("We will still get a Right(800) if we change the order of operations", () => {
  const app = xs => first(largeNumbers(xs)).map(larger);

  expect(app([2, 400, 5, 100]).inspect()).toEqual(`Right(800)`);
});

const { Right, Left } = require("./either");
const Box = require("./box");
const Task = require("data.task");

const fake = id => ({ id, name: "user1", best_friend_id: id + 1 });

const Db = {
  find: id =>
    new Task((rej, res) => res(id > 2 ? Right(fake(id)) : Left("not found")))
};

const eitherToTask = e => e.fold(Task.rejected, Task.of);

// Find a user, then find that user best friend

test("we may do that", () => {
  Db.find(3) // Task(Right(user))
    .chain(eitherToTask) // Goes inside the Task and transform Right(user) to Task(user) Task(Task(user))
    .chain(user => Db.find(user.best_friend_id)) // -> Task(Right(user))
    .chain(eitherToTask) // -> Task(Task(user))
    .fork(console.error, console.log);
});

test("we may do that without natural transformation", () => {
  Db.find(10) // Task(Right(user))
    .chain(either => Task.of(either.map(user => Db.find(user.best_friend_id))))
    .chain(either => either.chain(task => task.chain(either => either.chain(Task.of)))) // Right(Task(Right(User)))
    .fork(console.error, console.log);
});

test("we may do that without natural transformation v2", () => {
  Db.find(10) // Task(Right(user))
    .chain(either => Task.of(either.chain(user => Db.find(user.best_friend_id)))) // Task(Task(Right(user))))
    .chain(task => task.chain(either => either.chain(Task.of))) // Task(Task(Task(user)))
    .fork(console.error, console.log);
});
