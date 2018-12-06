const Task = require("data.task");
const { findArtist, findRelatedArtists } = require("./spotify");
const { List } = require("immutable-ext");
const { Pair, Sum } = require("../monoid");

const argv = new Task((rej, res) => res(process.argv));
const names = argv.map(args => args.slice(2));

const Intersection = xs => ({
  xs,
  concat: ({ xs: ys }) => Intersection(xs.filter(x => ys.some(y => x === y)))
});

const related = name =>
  findArtist(name)
    .map(artist => artist.id)
    .chain(findRelatedArtists)
    .map(artists => artists.map(artist => artist.name));

const artistsIntersection = rels =>
  rels
    .foldMap(x => Pair(Intersection(x), Sum(x.length)))
    .bimap(x => x.xs, y => y.x)
    .toList();

const main = names =>
  List(names)
    .traverse(Task.of, related)
    .map(artistsIntersection);

names.chain(main).fork(console.error, console.log);
