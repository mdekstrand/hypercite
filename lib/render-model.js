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
 * This renderer looks up the type of a citation, and dispatches it to the appropriate handler.
 */
class BibRenderer {
  constructor(impls, h) {
    this.renderers = {};
    this.hyper = h;
    let next;
    while ((next = _scanForWirable(impls, this.renderers))) {
      for (let nk of next) {
        let impl = impls[nk];
        let base = impls[nk].$base || DefaultHierarchy[nk];
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
      let r2 = Object.create(r);
      r2.h = this.hyper;
      return r2.render(cite);
    } else {
      throw new Error(`unknown entry type ${type}`);
    }
  }
}

/**
 * Construct a renderer.
 * 
 * This takes a renderer definition and creates a bibliography renderer from it.
 * The definition is an object of objects; each key defines a particular entry type's
 * formatter prototype.  The `render` method of a renderer takes a `BibEntry` object
 * and returns the results of rendering the bibliography entry.  Unspecified entries
 * are defaulted using the inheritance hierarchy in `DefaultHierarchy`.
 * 
 * A renderer prototype can contain a `$base` key, specifying the name of a base
 * renderer that should be the prototype for this renderer.  This allows an inheritance
 * hierarchy of renderer types; this function will take care of wiring together the
 * prototype chains.  If no `$base` is specified, `DefaultHierarchy` is consulted for
 * defaults.
 * 
 * In the default hierarchy, the root formatter is `$root`.  Common methods that are
 * used for all formatters should be defined here.
 * 
 * Prior to calling `render`, the bib renderer will ensure that `this.h` is set to the
 * provided hyperscript implementation.
 * 
 * @param {*} objs The implementation objects for the renderer.
 * @param {Function} h A HyperScript-compatible rendering function.
 * @returns {BibRenderer} The renderer.
 */
function makeBibRender(objs, h) {
  return new BibRenderer(objs, h);
}

module.exports = {
  BibRenderer, DefaultHierarchy, makeBibRender
}
