// Author: Justin Gow
// Date: 4.13.14

// Dependent Upon
// - jQuery
// - TweenMax
// - Util
// Module(s) (static)
// - Control
//
var Control = function($) { // ----- static module
    // private var(s)
    // jQuery cached elements
    var _body;
    //
    // private method(s)
    var _init = function() {
        Util.log('Control._init()');
        // cache jQuery element references  
        _body = $('body');
        //
        _pixelManipulation();
    };

    var _pixelManipulation = function() {
        //
        PixelFuck.fuckit(_body.find('.pixel_fuck'), PixelFuck.TYPE.PIXELIZED);
    };

    // output/public     
    return {
        init: _init
    };
}(jQuery);