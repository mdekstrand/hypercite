/**
 * PreJSON style, rendering the citation into a `pre` tag of indented JSON.
 */

 module.exports = {
  $root: {
    render(cite) {
      return this.h('pre', JSON.stringify(cite.csl, 2));
    }
  }
};
