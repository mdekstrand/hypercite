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
