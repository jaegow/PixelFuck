// Author: Justin Gow
// Date: 4.13.14

// Dependent Upon
// - jQuery
// - Util
// Module(s) (static)
// - PixelFuck

//
var PixelFuck = function($) { // ----- static module
    // private var(s)

    // private method(s)
    var _fuckit = function($container) {

        var pixelation_steps = [5, 10, 20, 30, 40, 50];

        $container.each(function(i, iteredElement) {
            var $iteredElement = $(iteredElement);
            var image_src = $iteredElement.data('image');

            $('<img/>').load(function(response, status, xhr) {
                if (status == "error") {
                    var message = 'preload failed';
                    message += ' for (' + src_new + ')';
                    message += '\n';
                    message += xhr.status;
                    message += '\n';
                    message += xhr.statusText;
                    Util.log(message);
                } else {
                    var loaded_image_element = this;
                    var canvases = _collectPixelatedCanvases(loaded_image_element, pixelation_steps);
                    var childElements = [loaded_image_element];
                    childElements = childElements.concat(canvases);
                    $iteredElement.append(childElements);
                    _defineAnimation($iteredElement);
                }
            }).attr('src', image_src);
        });
    };

    var _defineAnimation = function($container) {

        var children = $container.children();
        var animationIncrement = 0.2;
        var delay = 1;
        var delayIncrement = 0.15;

        for (var i = children.length - 1; i >= 1; i--) {
            var iteredChild = children[i];
            Util.log('iteredChild', iteredChild);
            TweenMax.to(iteredChild, animationIncrement, {
                autoAlpha: 0,
                delay: delay,
                onComplete: function() {
                    $(this.target).remove();
                }
            });
            delay += delayIncrement;
        }
    };

    var _collectPixelatedCanvases = function(image_element, pixelation_steps) {
        //
        var canvases = [];
        //
        for (var i = 0; i < pixelation_steps.length; i++) {
            var iteredStep = pixelation_steps[i];
            var iteredCanvas = _getPixelizedCanvas(image_element, iteredStep);
            canvases.push(iteredCanvas);
        }
        return canvases;
    };

    // use larger numbers for easier rendering
    var _getPixelizedCanvas = function(image_element, pixelized_amount) {
        var canvas = document.createElement('canvas');
        var image_width = canvas.width = image_element.width;
        var image_height = canvas.height = image_element.height;
        // canvas.className = 'canvas_' + pixelized_amount;

        var canvas_context = canvas.getContext("2d");
        canvas_context.drawImage(image_element, 0, 0);

        var image_data = canvas_context.getImageData(0, 0, canvas.width, canvas.height);
        var image_pixel_data = image_data.data;

        _renderPixelCollection(image_pixel_data, canvas, 0, 0, pixelized_amount);
        //
        canvas_context.putImageData(image_data, 0, 0);

        var image = new Image();
        image.src = canvas.toDataURL();

        canvas = null;

        return image;
    };

    var _renderPixelCollection = function(pixel_data, canvas_element, start_x, start_y, pixels_from_center) {

        var bounds_horizontal = canvas_element.width;
        var bounds_vertical = canvas_element.height;

        var center_x = start_x + pixels_from_center;
        var center_y = start_y + pixels_from_center;

        var end_x = center_x + pixels_from_center;
        var end_y = center_y + pixels_from_center;

        // reset center position based on bounds limitations
        if (center_x > bounds_horizontal) center_x = bounds_horizontal;
        if (center_y > bounds_vertical) center_y = bounds_vertical;
        if (end_x > bounds_horizontal) end_x = bounds_horizontal;
        if (end_y > bounds_vertical) end_y = bounds_vertical;

        var center_red_pixel_index = ((bounds_horizontal * center_y) + center_x) * 4;

        var center_image_data = {
            r: pixel_data[center_red_pixel_index],
            g: pixel_data[center_red_pixel_index + 1],
            b: pixel_data[center_red_pixel_index + 2],
            a: pixel_data[center_red_pixel_index + 3]
        };

        for (var y = start_y; y <= end_y; y++) {
            // loop through each column
            for (var x = start_x; x <= end_x; x++) {
                var red_pixel_index = ((bounds_horizontal * y) + x) * 4;
                pixel_data[red_pixel_index] = center_image_data.r; // set red
                pixel_data[red_pixel_index + 1] = center_image_data.g; // set green
                pixel_data[red_pixel_index + 2] = center_image_data.b; // set blue
                pixel_data[red_pixel_index + 3] = center_image_data.a; // set alpha
            }
        }

        var next_x = end_x + 1;
        var next_y = start_y;

        if (next_x > bounds_horizontal) {
            next_x = 0;
            next_y = start_y + (pixels_from_center * 2) + 1;
        }

        if (next_y > bounds_vertical) {
            // Util.log('*** render complete ***');
        } else {
            _renderPixelCollection(pixel_data, canvas_element, next_x, next_y, pixels_from_center);
        }
    };

    // output/public     
    return {
        fuckit: _fuckit,
        getPixelizedCanvas: _getPixelizedCanvas
    };
}(jQuery);