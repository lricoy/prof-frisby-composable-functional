// Capture Side Effects in a Task
const Task = require("data.task");

test("Task will not run map when rejected", () => {
  const spyLeft = jest.fn();
  const spyRight = jest.fn();
  const spyMap = jest.fn(x => x);

  Task.rejected(1)
    .map(spyMap)
    .fork(spyLeft, spyRight);

  expect(spyLeft).toHaveBeenCalled();
  expect(spyMap).not.toHaveBeenCalled();
  expect(spyRight).not.toHaveBeenCalled();
});

test("Task will run map and chain if not rejected", () => {
  const spyLeft = jest.fn();
  const spyRight = jest.fn(x => x);

  Task.of(1)
    .map(x => x + 1)
    .chain(x => Task.of(x * 2)) // will fold it like chain does :)
    .fork(spyLeft, spyRight);

  expect(spyLeft).not.toHaveBeenCalled();
  expect(spyRight).toHaveBeenCalledWith(4);
});

const launchMissiles = () =>
  new Task((rej, res) => {
    console.log("lauch missiles!");
    res("missile");
  });

const app = launchMissiles().map(x => x + "!");

test("We may build a task and separate it from our entrypoint so it remains pure", () => {
  const spyLeft = jest.fn();
  const spyRight = jest.fn();

  app.map(x => x + "!").fork(spyLeft, spyRight);

  expect(spyLeft).not.toHaveBeenCalled();
  expect(spyRight).toHaveBeenCalledWith('missile!!');
});
