const fs = require('fs-extra');
const path = require('path');
const expect = require('chai').expect;
const dm = require('../lib/data-model');

describe("normalizeType()", () => {
  let norm = dm.BibEntry.normalizeType;

  it("should convert a word to title case", () => {
    expect(norm('foo')).to.equal('Foo')
  });
  it("should convert hyphenated words to title case", () => {
    expect(norm('foo-bar')).to.equal('FooBar')
  });
  it("should convert underbar words to title case", () => {
    expect(norm('foo_bar')).to.equal('FooBar')
  });
});

describe('Bibligraphy', () => {
  let bib;
  let papers = ['yangMeasuringFairnessRanked2017', 'bag-recsys18']

  it('should load a list of CSLs', async () => {
    let text = await fs.readFile(path.join(__dirname, 'test-cites.json'));
    bib = dm.Bibliography.fromCSL(JSON.parse(text));
    expect(bib.bibList.length).to.be.above(5);
  });

  for (let pid of papers) {
    it(`should have the paper ${pid}`, () => {
      let rank = bib.lookup(pid);
      expect(rank).to.exist;
      expect(rank.id).to.equal(pid);
    });
  }
})
