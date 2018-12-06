// Use Task for Asynchronous Actions
const Task = require("data.task");
const fs = require("fs");

const readFile = (fileName, encoding) =>
  new Task((rej, res) =>
    fs.readFile(fileName, encoding, (err, contents) =>
      err ? rej(err) : res(contents)
    )
  );

const writeFile = (fileName, contents) =>
  new Task((rej, res) =>
    fs.writeFile(fileName, contents, (err, sucess) =>
      err ? rej(err) : res(sucess)
    )
  );

const app =
  readFile("config.json", "utf-8")
    .map(content => content.replace(/8/g, "6"))
    .chain(content => writeFile("config1.json", content));

app.fork(e => console.log("err", e), x => console.log("sucess"));
