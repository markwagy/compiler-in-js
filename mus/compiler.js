var testobj = 
    { tag: 'seq',
      left: 
       { tag: 'par',
         left: { tag: 'rest', dur: 250 },
         right: { tag: 'note', pitch: 'g4', dur: 500 } },
      right:
       { tag: 'par',
         left: { tag: 'note', pitch: 'd3', dur: 500 },
         right: { tag: 'note', pitch: 'f4', dur: 250 } } };

/*
 should compile to
[ { tag: 'note', pitch: 'c3', start: 0, dur: 250 },
  { tag: 'note', pitch: 'g4', start: 0, dur: 250 },
  { tag: 'note', pitch: 'd3', start: 500, dur: 500 },
  { tag: 'note', pitch: 'f4', start: 500, dur: 250 } ]
*/

var convertPitch = function(pitchval) {
	var letterPitch;

	switch (pitchval.charAt(0)) {
	case "a": letterPitch=9; break;
	case "b": letterPitch=11; break;
	case "c": letterPitch=0; break;
	case "d": letterPitch=2; break;
	case "e": letterPitch=4; break;
	case "f": letterPitch=5; break;
	case "g": letterPitch=7; break;
	}

	var octave = pitchval.charAt(1);
	return 12 + 12 * octave + letterPitch;
};

var endTime = function (time, expr) {
    if (expr.tag === 'note' || expr.tag === 'rest') {
        return expr.dur;
    } else {
		var endLeft = endTime(time, expr.left);
		var endRight = endTime(endLeft, expr.right);
		if (expr.tag === "seq") {
			return endLeft + endRight;
		} else {
			if (endLeft > endRight) {
				time += endLeft;
			} else {
				time += endRight;
			}
			return time;
		}
    }
};

var compileHelper = function(musexpr, start) {
	
	if (musexpr.tag === 'note' || musexpr.tag === 'rest') {
		musexpr.start = start;
		if (musexpr.tag === 'note') {
			musexpr.midi = convertPitch(musexpr.pitch);
		}
		return [musexpr];
	}

	var rtn = [];

	var le = compileHelper(musexpr.left, start);

	if (musexpr.tag === "seq") {
		start += endTime(start, musexpr.left);
	}

	var ri = compileHelper(musexpr.right, start);

	for (var i=0; i<le.length; i++) {
		rtn.push(le[i]);
	}
	for (i=0; i<ri.length; i++) {
		rtn.push(ri[i]);
	}

	return rtn;
};

var compile = function(musexpr) {
	var arr = compileHelper(musexpr, 0);
	return arr;
};

console.log("\n>> MUS");
console.log(JSON.stringify(testobj, null, 2));
console.log("\n>> NOTE");
console.log(JSON.stringify(compile(testobj), null, 2));
