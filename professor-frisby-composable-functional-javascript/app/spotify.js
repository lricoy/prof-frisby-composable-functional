const axios = require("axios");
const Task = require("data.task");
const Either = require("data.either");

const httpGet = url =>
  new Task((reject, resolve) => {
    axios
      .get(url, {
        headers: {
          Authorization: "Bearer <PUT TOKEN HERE>"
        }
      })
      .then(resolve)
      .catch(reject);
  }).map(x => x.data);

const first = xs => Either.fromNullable(xs[0]);

const eitherToTask = e => e.fold(Task.rejected, Task.of);

const findArtist = name =>
  httpGet(`https://api.spotify.com/v1/search?q=${name}&type=artist`)
    .map(results => results.artists.items)
    .map(first)
    .chain(eitherToTask);

const findRelatedArtists = id =>
  httpGet(`https://api.spotify.com/v1/artists/${id}/related-artists`).map(
    results => results.artists
  );

module.exports = {
  findArtist,
  findRelatedArtists
};
