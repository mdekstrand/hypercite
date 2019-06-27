const cu = require('./citeutil');

/**
 * An entry in CSL-JSON.
 * @typedef {Object} CslEntry
 * 
 * @property {string?} type
 * @property {(string|number)} id
 * @property {string[]} [categories]
 * @property {string} [language]
 * @property {string} [journalAbbreviation]
 
 * @property {string} [title]
 * @property {string} [title-short]
 * @property {string} [shortTitle]
 * @property {string} [abstract]
 * 
 * @property {string} [collection-title]
 * @property {string} [collection-number]
 * @property {string} [container-title]
 * @property {string} [container-title-short]
 * 
 * @property {(string|number)} [volume]
 * @property {(string|number)} [number-of-volumes]
 * @property {(string|number)} [number]
 * @property {string} [chapter-number]
 * @property {string} [page]
 * @property {string} [number-of-pages]
 * @property {string} [page-first]
 * @property {string} [version]
 * 
 * @property {string} [original-title]
 * @property {string} [original-publisher]
 * @property {string} [original-publisher-place]
 *
 * @property {string} [reviewed-title]
 *
 * @property {string} [publisher]
 * @property {string} [publisher-place]
 * @property {string} [archive]
 * @property {string} [archive_location]
 * @property {string} [archive-place]
 * 
 * @property {string} [annote]
 * @property {string} [authority]
 * @property {string} [citation-label]
 * @property {string} [dimensions]
 * @property {string} [event]
 * @property {string} [event-place]
 * @property {string} [genre]
 * @property {string} [first-reference-note-number]
 * @property {string} [jurisdiction]
 * @property {string} [keyword]
 * @property {string} [locator]
 * @property {string} [medium]
 * @property {string} [note]
 * @property {string} [scale]
 * @property {string} [section]
 * @property {string} [source]
 * @property {string} [status]
 * @property {string} [year-suffix]
 * 
 * @property {CslName[]} [author]
 * @property {CslName[]} [collection-editor]
 * @property {CslName[]} [composer]
 * @property {CslName[]} [container-author]
 * @property {CslName[]} [director]
 * @property {CslName[]} [editor]
 * @property {CslName[]} [editorial-director]
 * @property {CslName[]} [interviewer]
 * @property {CslName[]} [illustrator]
 * @property {CslName[]} [original-author]
 * @property {CslName[]} [recipient]
 * @property {CslName[]} [reviewed-author]
 * @property {CslName[]} [translator]
 * 
 * @property {CslDate} [issued]
 * @property {CslDate} [accessed]
 * @property {CslDate} [container]
 * @property {CslDate} [event-date]
 * @property {CslDate} [original-date]
 * @property {CslDate} [submitted]
 * 
 * @property {string} [DOI]
 * @property {string} [call-number]
 * @property {string} [ISBN]
 * @property {string} [ISSN]
 * @property {string} [PMID]
 * @property {string} [PMCID]
 * @property {string} [URL]
 */

 /**
  * A name in CSL-JSON.
  * @typedef {Object} CslName
  * @property {string} [family]
  * @property {string} [given]
  * @property {string} [dropping-particle]
  * @property {string} [non-dropping-particle]
  * @property {string} [suffix]
  * @property {(string|number|boolean)} [comma-suffix]
  * @property {(string|number|boolean)} [static-ordering]
  * @property {string} [literal]
  * @property {(string|number|boolean)} [parse-names]
  */

/**
 * A date in CSL-JSON.
 * 
 * @typedef {Object} CslDate
 * @property {CslDatePart[][]} [date-parts]
 * @property {string} [season]
 * @property {(string|number|boolean)} [circa]
 * @property {string} [literal]
 * @property {string} [raw]
 */

 /**
  * A date part in CSL-JSON
  * @typedef {(string|number)} CslDatePart
  */

/**
 * Wrapper object for working with names.
 * 
 * @param {CslName} csl The CSL object for the name.
 * @property {CslName} csl The CSL object backing this name.
 */
class Name {
  constructor(csl) {
    this.csl = csl
  }

  get familyName() {
    let name = this.csl.family;
    let ndp = this.csl['non-dropping-particle']
    if (ndp) {
      name = `${ndp} ${name}`;
    }
    return name;
  }

  get givenName() {
    return this.csl.given;
  }

  /**
   * Render a name into text.
   *
   * The order in which to render the name can be one of the following:
   * 
   * - `family-first`, to render the family name first.
   * - `given-first`, to render the given name first (the default).
   * 
   * @todo Make this work well with non-latin scripts.
   * @todo Support initialization.
   * 
   * @param {(string|Object)} options The name rendering options.  If a string, interpreted as the `order` option.
   * @param {string} options.order The order in which to render the name.
   * @param {string} options.initials Whether to render the given name with initials.
   * @param {string} options.demote Whether to demote the non-dropping particle when rendering `family-first`.
   */
  renderName(options) {
    if (typeof(options) === 'string') {
      options = {order: options};
    }
    let part1 = new cu.Collector();
    let part2 = new cu.Collector();
    if (options.order == 'given-first') {
      part1.maybePush(this.csl.given);
      part1.maybePush(this.csl['dropping-particle']);
      part1.maybePush(this.csl['non-dropping-particle']);
      part1.maybePush(this.csl.family);
      part1.maybePush(this.csl.suffix);
    } else if (options.order == 'family-first') {
      if (!options.demote) {
        part1.maybePush(this.csl['non-dropping-particle']);
      }
      part1.maybePush(this.csl.family);
      
      part2.maybePush(this.csl.given);
      part2.maybePush(this.csl['dropping-particle']);
      if (options.demote) {
        part2.maybePush(this.csl['non-dropping-particle']);
      }
      part2.maybePush(this.csl.suffix);
    } else {
      throw new RangeError(`invalid name order ${options.order}`);
    }

    let name = part1.join(' ');
    if (part2.length) {
      name += ', ' + part2.join(' ');
    }
    return name;
  }
}

module.exports.Name = Name;
