// Write applicatives for concurrent actions
const log = console.log.bind(console);
const Task = require("data.task");

const Db = {
  find: id =>
    new Task((rej, res) =>
      setTimeout(() => res({ id: id, title: `Project ${id}` }, 100))
    )
};

const reportHeader = name => p1 => p2 =>
  `${name} - Report: ${p1.title} compared to ${p2.title}`;

const findInSequence = Db.find(20).chain(p1 =>
  Db.find(8).map(p2 => reportHeader('sequence')(p1)(p2))
);

const findTogether = Task.of(reportHeader('together'))
  .ap(Db.find(20))
  .ap(Db.find(8));

findInSequence.fork(log, log);
findTogether.fork(log, log);
