// Leapfrogging types with Traversable
const fs = require("fs");
const Task = require("data.task");
const futurize = require("futurize").futurize(Task);
const { List } = require("immutable-ext");

const readFile = futurize(fs.readFile);

const files = List(["./box.js", "./config.json"]);
const res = files.traverse(Task.of, fn => readFile(fn, "utf-8"));
res.fork(console.error, console.log)

/**
How do we know when all of them are finished? How do we fork each one of these?
 We can very well map fork each one and we want to know when we are all done. 
 Really, what we want is to take this array of tasks and turn it into a  Task of 
 an array of results.
 */
// const res = files.map(fn => readFile(fn, "utf-8"));
// res.map(task => task.fork(console.error, console.log));