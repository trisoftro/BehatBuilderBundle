(function($) {
    'use strict';

    $(function() {

        $.timerNotifier = function (text, className, seconds) {

            seconds = seconds || 5;
            className = className || 'text-success';

            $('#status').addClass(className).html(text);

            var successTimeout = window.setTimeout(
                function () {
                    $('#status').html('').removeClass(className);
                },
                seconds * 1000
            );

        };

        var editor = CodeMirror.fromTextArea($('#editor').get(0), {
            mode: "text/html",
            lineNumbers: true
        });

        var editorHeight = $('#feature-c').height();
        editorHeight = editorHeight < 500 ? 500 : editorHeight;
        editor.setSize('100%', editorHeight);

        var currentFeature;

        $.loadFile = function (file) {
            $('#status').html('Loading `' + file + '`.');

            $.ajax({
                type: 'POST',
                url: Routing.generate('behat_load_file'),
                data: {
                    file: file
                },
                success: function(data)
                {
                    if(data.content) {
                        editor.setValue(data.content);
                        currentFeature = file;
                        $.timerNotifier('`' + currentFeature + '` loaded successfully.')
                    } else {
                        editor.setValue('');
                        $.timerNotifier('Could not load requested file.', 'text-danger')
                    }
                }
            });
        };

        $.loadHash = function() {
            var file = (window.location.href.indexOf('#') != -1) ? window.location.href.substring(window.location.href.indexOf('#')+1) : false;

            if(file) {
                $.loadFile(file);
            }
        };

        //load initial hash
        $.loadHash();

        //load hash on history change
        $(window).bind('popstate', function(event) {
            $.loadHash();
        });

        $('a[data-feature]').click(function() {
            var file = this.hash.substring(this.hash.indexOf('#')+1);

            $.loadFile(file);
        });

        $("a.save").click(function() {

            $('#status').html('Saving `' + currentFeature + '` ...');

            $.ajax({
                type: 'POST',
                url: Routing.generate('behat_save_file'),
                data: {
                    file: currentFeature,
                    data: editor.getValue()
                },
                success: function(data)
                {
                    if (data.success) {
                        $.timerNotifier('`' + currentFeature + '` saved successfully.');
                    }
                    else {
                        $('#status').html('Could not save `' + currentFeature + '`.');
                    }
                }
            });

            return false;
        });

    });
}(jQuery));
