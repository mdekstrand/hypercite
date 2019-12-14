const {Bibliograpy, BibEntry} = require('./lib/data-model');
const rm = require('./lib/render-model');

const styles = {
  PreJSON: require('./lib/styles/PreJSON')
};

module.exports = {
  BibEntry, Bibliograpy,
  BibRenderer: rm.BibRenderer,
  makeBibRender: rm.makeBibRender,
  styles
};
