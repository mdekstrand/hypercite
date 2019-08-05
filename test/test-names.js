const expect = require('chai').expect;
const data = require('../lib/data-model');

const basicLatinName = {
  family: 'Caesar',
  given: 'Julius'
}

const rvwName = {
  family: 'Winkle',
  given: 'Rip',
  'non-dropping-particle': 'van'
}

const longName = {
  family: 'Pulcifer',
  given: 'Thou Shalt Not Commit Adultery'
}

const mde = {
  family: 'Ekstrand',
  given: 'Michael D.'
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

  describe('#givenInitials', () => {
    it('should return the given name initials', () => {
      let name = make(basicLatinName);
      expect(name.givenInitials).to.equal('J.');
    });
    it('should initialize multiple words', () => {
      let name = make(longName);
      expect(name.givenInitials).to.equal('T. S. N. C. A.');
    });
    it('should not reinitialize words', () => {
      let name = make(mde);
      expect(name.givenInitials).to.equal('M. D.');
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

    describe('Rip van Winkle, a non-dropping particle', () => {
      let name = make(rvwName);

      it('should include van in family name', () => {
        expect(name.familyName).to.equal('van Winkle');
      });

      it('should lead with van in family-first', () => {
        expect(name.renderName('family-first')).to.equal('van Winkle, Rip');
      });

      it('should render given-first', () => {
        expect(name.renderName('given-first')).to.equal('Rip van Winkle');
      });

      it('should demote van when sorting', () => {
        expect(name.renderName('sort')).to.equal('Winkle, Rip van');
      });
    })
  });
});
