$(function() {
    function handleImage(e, container) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var img = new Image();
            img.onload = function() {
                var imgWidth = img.width;
                var imgHeight = img.height;
                var canvasWidth = container.width();
                var canvasHeight = container.height();

                if (imgWidth > canvasWidth) {
                    var scaleRatio = canvasWidth / imgWidth;
                    imgWidth = canvasWidth;
                    imgHeight *= scaleRatio;
                }

                if (imgHeight > canvasHeight) {
                    var scaleRatio = canvasHeight / imgHeight;
                    imgHeight = canvasHeight;
                    imgWidth *= scaleRatio;
                }

                var elem = $('<div>').addClass('resizable-image').css({
                    'width': imgWidth,
                    'height': imgHeight
                }).append($('<img>').attr('src', event.target.result).css({
                    'width': '100%',
                    'height': '100%'
                }));

                elem.css({
                    'position': 'absolute',
                    'top': '0',
                    'left': '0'
                });
                elem.draggable({
                    containment: 'parent',
                    scroll: false
                }).resizable({
                    containment: 'parent',
                    handles: 'se'
                });
                container.find('.images-container').append(elem);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    }

    $('.add-image').click(function() {
        $('#file-input').click();
        window.selectedContainer = $(this).closest('.block').find('.canvas-container');
    });

    $('#file-input').change(function(e) {
        handleImage(e, window.selectedContainer);
        $(this).val('');
    });
    
    $('.clear').click(function() {
        var confirmation = confirm('This will remove added images from this element.');

        if (confirmation) {
            var container = $(this).closest('.block').find('.canvas-container');
            container.find('.images-container').empty();
            container.css('background-color', '#ffffff');
            container.siblings('.controls').find('.background-color').val('#ffffff');
        }
    });

    $('.background-color').change(function() {
        var container = $(this).closest('.block').find('.canvas-container');
        container.css('background-color', $(this).val());
    });

    $('.tabs a').click(function(e) {
        e.preventDefault();

        $('.tabs a').removeClass('active');
        $(this).addClass('active');

        var tab = $(this).attr('href');
        $('.block').css('display', 'none');
        $(tab).css('display', 'flex');
    });
    // By default, select the first tab
    $('.tabs a:first').trigger('click');
});
