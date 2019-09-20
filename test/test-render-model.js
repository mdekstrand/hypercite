const expect = require('chai').expect;
const rm = require('../lib/render-model');

describe('Render model', () => {
  it('should set up default hierarchy', () => {
    let $root = {
      render(c) {
        return JSON.stringify(c.csl);
      }
    };
    let br = rm.makeBibRender({ $root });
    expect(br).to.exist;

    for (let k in rm.DefaultHierarchy) {
      expect(br.renderers[k]).to.exist;
      expect(br.renderers[k]).to.equal(br.renderers.$root);
    }
  });

  it('should wire up an Article renderer', () => {
    let $root = {
      render(c) {
        return JSON.stringify(c.csl);
      }
    };
    let Article = {
      render(c) {
        return 'A{' + JSON.stringify(c.csl) + '}';
      }
    };
    let br = rm.makeBibRender({ $root, Article });
    expect(br).to.exist;

    for (let k in rm.DefaultHierarchy) {
      expect(br.renderers[k]).to.exist;
      if (rm.DefaultHierarchy[k] == 'Article' || k == 'Article') {
        expect(br.renderers[k]).to.equal(br.renderers.Article);
        expect(Object.getPrototypeOf(br.renderers[k])).to.equal(br.renderers.$root);
      } else {
        expect(br.renderers[k]).to.equal(br.renderers.$root);
      }
    }
  });
});
