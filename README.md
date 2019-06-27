# hypercite

The `hypercite` package is a package for manipulating and rendering academic citations.
It uses [CSL-JSON][] as its input, and bibliographic entries are rendered using a 
HyperScript-compatible constructor function.  It therefore integrates well with the Unified
ecosystem (through [hastscript][]).

In order to make that possible, it provides JavaScript API implementations of utility
functions for working with the CSL-JSON data structures, implemented in wrapper objects
that simplify access to the CSL data model.

This is currently a *very early* prototype.

[CSL-JSON]: https://citeproc-js.readthedocs.io/en/latest/csl-json/markup.html#
[hastscript]: https://github.com/syntax-tree/hastscript

## Why CSL-JSON?

CSL-JSON is a tedious and verbose format, and a lot of the logic for working with it is
embedded in the Citeproc code in a form that is not easily extracted and reusable. But 
it is the common language for exchanging citation data; further, while I might in principle
prefer BibJSON, it is not as well-specified, and [citation.js][] can convert BibJSON to
CSL-JSON but not the other way around.  Therefore, using CSL-JSON as the underlying data
model for hypercite maximizes interoperability.


[citation.js]: https://citation.js.org/
