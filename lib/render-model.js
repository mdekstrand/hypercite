/**
 * Code for the model of citation renderers.
 */

/**
 * The default renderer hierarchy.
 */
const DefaultHierarchy = {
  $root: null,
  Article: '$root',
  ArticleJournal: 'Article',
  ArticleMagazine: 'Article',
  Bill: '$root',
  Book: 'Manuscript',
  Broadcast: '$root',
  Chapter: '$root',
  Dataset: '$root',
  Entry: '$root',
  EntryDictionary: 'Entry',
  EntryEncyclopedia: 'Entry',
  Figure: '$root',
  Graphic: 'Figure',
  Interview: '$root',
  LegalCase: '$root',
  Legislation: '$root',
  Manuscript: '$root',
  Map: '$root',
  MotionPicture: '$root',
  MusicalScore: '$root',
  Pamphlet: '$root',
  PaperConference: 'Article',
  Patent: '$root',
  PersonalCommunication: '$root',
  Post: '$root',
  PostWeblog: 'Post',
  Report: 'Manuscript',
  Review: '$root',
  ReviewBook: 'Review',
  Song: '$root',
  Speech: '$root',
  Thesis: '$root',
  Treaty: '$root',
  Webpage: '$root'
};

function _scanForWirable(impls, finished) {
  let res = [];
  for (let k in impls) {
    if (finished[k]) continue;

    let base = impls[k].$base || DefaultHierarchy[k];
    if (!base || finished[base]) {
      res.push(k);
    }
  }
}

/**
 * A bibliography renderer.
 * 
 * This renderer looks up the type of a citation, and 
 */
class BibRenderer {
  constructor(impls) {
    this.renderers = {};
    let next;
    while ((next = _scanForWirable(impls, this.renderers))) {
      for (let nk of next) {
        let impl = impls[k];
        let base = impls[k].$base || DefaultHierarchy[k];
        if (base) {
          base = this.renderers[base];
        }

        if (base) {
          let methods = impl;
          impl = Object.create(base);
          Object.assign(impl, methods);
        }
        this.renderers[nk] = impl;
      }
    }

    for (let k in DefaultHierarchy) {
      // FIXME handle multiple levels in renderers
      if (!this.renderers[k]) {
        this.renderers[k] = this.renderers[DefaultHierarchy[k]];
      }
    }
  }

  renderBibEntry(cite) {
    let type = cite.type;
    let r = this.renderers[type];
    let pt = type;
    while (pt && !r) {
      pt = DefaultHierarchy[pt];
      if (pt) {
        r = this.renderers[pt]
      }
    }
    if (r) {
      return r.render(cite);
    } else {
      throw new Error(`unknown entry type ${type}`);
    }
  }
}

/**
 * Construct a renderer.
 * 
 * @param {*} objs 
 * @returns {BibRenderer} The renderer.
 */
function makeBibRender(objs) {
  
}

module.exports = {
  BibRenderer, makeBibRender
}
