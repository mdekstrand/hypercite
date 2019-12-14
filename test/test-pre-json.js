const fs = require('fs');
const path = require('path');

const expect = require('chai').expect;
const cheerio = require('cheerio');

const rm = require('../lib/render-model');
const PreJSON = require('../lib/styles/PreJSON');
const { Bibliography } = require('../lib/data-model');

function allTests(h, stringify) {
  let re = rm.makeBibRender(PreJSON, h);
  let cites = fs.readFileSync(path.join(__dirname, 'test-cites.json'));
  let bib = Bibliography.fromCSL(JSON.parse(cites));
  let bag = bib.lookup('bag-recsys18');

  it('should have a root render function', () => {
    expect(re.renderers.$root).to.have.property('render');
  });

  describe('rendering a citation', () => {
    let cite = re.renderBibEntry(bag);
    console.log('cite: %s', cite);
    cite = stringify(cite);
    console.log('html: %s', cite);
    let $ = cheerio.load(cite);
    
    it('should render a PRE tag', () => {
      expect($('pre')).to.have.lengthOf(1);
    });
    it('should contain JSON of the citation', () => {
      let csl = JSON.parse($('pre').text());
      expect(csl).to.deep.equal(bag.csl);
    });
  });
}

describe('PreJSON style', () => {
  describe('with Hastscript', () => {
    const h = require('hastscript');
    const toHTML = require('hast-util-to-html');
    return allTests(h, toHTML);
  });

  describe('with Hyperscript', () => {
    const h = require('hyperscript');
    function stringify(node) {
      return node.outerHTML;
    }
    return allTests(h, stringify);
  });
});
