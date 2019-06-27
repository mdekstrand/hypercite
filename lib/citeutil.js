/**
 * An array with an additional method for optional pushing.
 */
class Collector extends Array {
  /**
   * Push `obj`, only if it is not `null` or `undefined`.
   * 
   * @param {Object} obj The object to push.
   */
  maybePush(obj) {
    if (obj != null) {
      this.push(obj);
    }
  }
}

module.exports.Collector = Collector;
