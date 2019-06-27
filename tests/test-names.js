const expect = require('chai').expect;
const data = require('../lib/data-model');

const basicLatinName = {
  family: 'Caesar',
  given: 'Julius'
}

function make(csl) {
  return new data.Name(csl);
}

describe('Name', () => {
  describe('#familyName', () => {
    it('should return the family name', () => {
      let name = make(basicLatinName);
      expect(name.familyName).to.equal('Caesar');
    });
  });
  
  describe('#givenName', () => {
    it('should return the given name', () => {
      let name = make(basicLatinName);
      expect(name.givenName).to.equal('Julius');
    });
  });

  describe('#renderName', () => {
    describe("a two-part Latin name", () => {
      let name = make(basicLatinName);
      it('should render given-first', () => {
        expect(name.renderName('given-first')).to.equal('Julius Caesar');
      });

      it('should render family-first', () => {
        expect(name.renderName('family-first')).to.equal('Caesar, Julius');
      });

      it('should render given-first with initials', () => {
        expect(name.renderName({
          order: 'given-first',
          initials: true
        })).to.equal('J. Caesar');
      });

      it('should render family-first with initials', () => {
        expect(name.renderName({
          order: 'family-first',
          initials: true
        })).to.equal('Caesar, J.');
      });
    });
  })
});
