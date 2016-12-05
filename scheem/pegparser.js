var peg = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('scheemparser.peg', 'utf-8');
// Show the PEG grammar file
console.log(data);
console.log(JSON.stringify(Object.keys(peg.compiler)));
// Create my parser
var parser = peg.generate(data);

assert.deepEqual( parser.parse("(a b c)"), ["a", "b", "c"] );
assert.deepEqual( parser.parse("(a (+ b c))"), ["a", ["+", "b", "c"]] );
assert.deepEqual( parser.parse("(* (+ (* b c c)))"), ["*", ["+", ["*", "b", "c", "c"]]] );
assert.deepEqual( parser.parse("(a (+         b    c))"), ["a", ["+", "b", "c"]] );
assert.deepEqual( parser.parse("'(a b)"), ["quote", ["a", "b"]]);
assert.deepEqual( parser.parse("'(a '(b c))"), ["quote", ["a", ["quote", ["b", "c"]]]] );
assert.deepEqual( parser.parse("'(a '(b c)) ;; some comment stuff here"), ["quote", ["a", ["quote", ["b", "c"]]]] );
