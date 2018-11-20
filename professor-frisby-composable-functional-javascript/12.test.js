// Capture Side Effects in a Task
const Task = require("data.task");
const log = console.log.bind(console);

Task.rejected(1)
  .map(x => x + 1)
  .fork(e => console.log("err", e), x => console.log("sucess", x));

Task.of(1)
  .map(x => x + 1)
  .chain(x => Task.of(x * 2))
  .fork(e => console.log("err", e), x => console.log("sucess", x));

const launchMissiles = () => new Task((rej, res) => {
  console.log("lauch missiles!");
  res('missile');
});

const app = launchMissiles().map(x => x + '!');

app.map(x => x + '!').fork(
  log,
  log
)


