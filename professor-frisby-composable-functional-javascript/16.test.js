// You have been using Monads
const axios = require("axios");
const Box = require("./box");
const Task = require("data.task");

// monads have a .of method
//        and a .chain mehtod
// (.of, .chain) creates the monadic interface
// const httpGet = url =>
//   new Task((reject, resolve) => {
//     axios
//       .get(url)
//       .then(resolve)
//       .catch(reject);
//   }).map(x => x.data);

// const updateDOM = (planet, planet2) =>
//   Task.of(`${planet.name} - ${planet2.rotation_period}`);

// const getTwoPlanetsStuff = httpGet("http://swapi.co/api/planets/1/")
//   .chain(planet =>
//     httpGet("http://swapi.co/api/planets/2/")
//     .chain(planet2 => updateDOM(planet, planet2)))

// // Task - httGetp(Task - httpGet2(Task(String)))
// // join(join(httpGet, httpGet2), updateDom)
// // Task(String)

// const app = getTwoPlanetsStuff.map(x => x.toUpperCase());

// app.fork(e => console.log("err", e), x => console.log("sucess", x));

const join = m => m.chain(x => x);

// First law = join(m.map(join)) == join(join(m))
test('our first law is true', () => {
  const m = Box(Box(Box(3)));
  const res1 = join(m.map(join))
            // map(Box(Box(3) => Box(Box(3)).chain() == Box(3)
            // join(Box(Box(3)))
            // Box(3)
  const res2 = join(join(m));
  // This means we can "join" from the inside as well as the outside.
  // It is capturing associativity
  expect(res1.inspect()).toEqual(res2.inspect())
});

// Second law = join(Box.of(m)) == join(m.map(Box.of))
test('our second law is true', () => {
  const m = Box('wonder');
  const res1 = join(Box.of(m))
            // ( 2   (   1   ))
            // 1 = Box.of(Box('wonder')) -> Box(Box('wonder'))
            // 2 = join(Box(Box('wonder')))
            // Box('wonder')

  const res2 = join(m.map(Box.of));
            // (2   (    1      ))
            // 1 = Box('wonder').map(Box.of(Box('wonder))) -> Box(Box('wonder'))
            // join(Box(Box('wonder')))
            // Box('wonder')
  
  expect(res1.inspect()).toEqual(res2.inspect())
});
