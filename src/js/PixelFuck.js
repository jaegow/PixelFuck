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
    var _renderType = {
        PIXELIZED: 'pixelized',
        INVERSE: 'inverse',
        GREYSCALE: 'greyscale'
    };
    // todo: incorporate a animation duration
    // var _animation_duration = 1;

    // private method(s)
    var _fuckit = function($container, type) {
        // type is not defined and is defaulted
        if (arguments.length == 1) type = _renderType.PIXELIZED;

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
                    var animationElements = _getAnimationElements(loaded_image_element, type);
                    var childElements = [loaded_image_element];
                    childElements = childElements.concat(animationElements);
                    $iteredElement.append(childElements);
                    _animateChildElements($iteredElement);
                }
            }).attr('src', image_src);
        });
    };

    var _getAnimationElements = function(orgin_image_element, render_type) {

        var elements = [];

        switch (render_type) {
            case _renderType.PIXELIZED:
                elements = _getPixelizedImages(orgin_image_element);
                break;
            case _renderType.INVERSE:
                elements = _getInverseImages(orgin_image_element);
                break;
            case _renderType.GREYSCALE:
                elements = _getGreyScaleImages(orgin_image_element);
                break;    
        }
        return elements;
    };

    var _getPixelizedImages = function(image_element) {
        //
        var images = [];
        // use larger numbers for easier rendering
        var pixelation_steps = [5, 10, 20, 30, 40, 50];
        //
        var canvas = document.createElement('canvas');
        var image_width = canvas.width = image_element.width;
        var image_height = canvas.height = image_element.height;
        var canvas_context = canvas.getContext("2d");

        for (var i = 0; i < pixelation_steps.length; i++) {
            var iteredStep = pixelation_steps[i];

            canvas_context.drawImage(image_element, 0, 0);

            var image_data = canvas_context.getImageData(0, 0, canvas.width, canvas.height);
            var image_pixel_data = image_data.data;

            _pixelate(image_pixel_data, canvas, 0, 0, iteredStep);
            canvas_context.putImageData(image_data, 0, 0);
            var image = new Image();
            image.src = canvas.toDataURL();

            images.push(image);
        }
        return images;
    };

    var _pixelate = function(pixel_data, canvas_element, start_x, start_y, pixels_from_center) {

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
            _pixelate(pixel_data, canvas_element, next_x, next_y, pixels_from_center);
        }
    };

    var _getInverseImages = function(image_element) {
        Util.log('PixelFuck._getInverseImages()');
        //
        var images = [];
        //
        var canvas = document.createElement('canvas');
        var image_width = canvas.width = image_element.width;
        var image_height = canvas.height = image_element.height;
        var canvas_context = canvas.getContext("2d");
        canvas_context.drawImage(image_element, 0, 0);
        var image_data = canvas_context.getImageData(0, 0, canvas.width, canvas.height);
        var image_pixel_data = image_data.data;

        for (var i = 0; i < image_pixel_data.length; i += 4) {
            var index_red = i;
            var index_green = i + 1;
            var index_blue = i + 2;

            image_pixel_data[index_red] = 255 - image_pixel_data[index_red];
            image_pixel_data[index_green] = 255 - image_pixel_data[index_green];
            image_pixel_data[index_blue] = 255 - image_pixel_data[index_blue];
        }
        canvas_context.putImageData(image_data, 0, 0);
        var image = new Image();
        image.src = canvas.toDataURL();

        images.push(image);

        return images;
    };

    var _getGreyScaleImages = function(image_element) {
        Util.log('PixelFuck._getGreyScaleImages()');
        //
        var images = [];
        //
        var canvas = document.createElement('canvas');
        var image_width = canvas.width = image_element.width;
        var image_height = canvas.height = image_element.height;
        var canvas_context = canvas.getContext("2d");
        canvas_context.drawImage(image_element, 0, 0);
        var image_data = canvas_context.getImageData(0, 0, canvas.width, canvas.height);
        var image_pixel_data = image_data.data;

        for (var i = 0; i < image_pixel_data.length; i += 4) {
            var index_red = i;
            var index_green = i + 1;
            var index_blue = i + 2;
            var average = (image_pixel_data[index_red] + image_pixel_data[index_green] + image_pixel_data[index_blue]) / 3;
            image_pixel_data[index_red] = image_pixel_data[index_green] = image_pixel_data[index_blue] = average;
        }
        canvas_context.putImageData(image_data, 0, 0);
        var image = new Image();
        image.src = canvas.toDataURL();

        images.push(image);

        return images;
    };   

    var _animateChildElements = function($container) {

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

    // output/public     
    return {
        fuckit: _fuckit,
        TYPE: _renderType
    };
}(jQuery);