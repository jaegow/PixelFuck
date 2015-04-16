// Dependent Upon
// - 
// Modules (static)
// - Util

// ------------------ Util (static)
var Util = function() {
	// private var(s)

	// getter(s)/setter(s) var(s)    
	var __debugMode = false;

	// todo : deine a local storage variable that can turn debugging on/off
	// getter(s)/setter(s) method(s)
	var _debugMode = function() {
		if (!arguments.length) return __debugMode;
		else __debugMode = arguments[0];
	};

	// private method(s)
	var _constructor = function() {
		// console.log('Util._constructor()');
	};

	// todo : add a force object for quick logs
	var _log = function() {
		if(!__debugMode) return;
		if (typeof console === "undefined" || typeof console.log === "undefined") return; // no log available

		for (var i = 0; i < arguments.length; i++) {
			var iteredArgument = arguments[i];
			console.log(iteredArgument);
		}
	};

	_constructor();
	// output/public     
	return {
		debugMode: _debugMode,
		log: _log
	};
}();