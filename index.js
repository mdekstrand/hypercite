const {Bibliograpy, BibEntry} = require('./lib/data-model');
const rm = require('./lib/render-model');

module.exports = {
  BibEntry, Bibliograpy,
  BibRenderer: rm.BibRenderer,
  makeBibRender: rm.makeBibRender
};
