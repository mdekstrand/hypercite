const rm = require('../lib/render-model');
const PreJSON = require('../lib/styles/PreJSON');

function allTests(h) {

}

describe('PreJSON style', () => {
  describe('with Hastscript', () => {
    const h = require('hastscript');
    let re = rm.makeBibRender(PreJSON, h);

    it('should have a root render function', () => {

    })
  });  
});
