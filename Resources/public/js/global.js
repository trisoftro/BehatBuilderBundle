(function($) {
    'use strict';

    $(function() {

        $.timerNotifier = function (text, seconds) {

            seconds = seconds || 5;

            $('#status').addClass('text-success').html(text);

            var successTimeout = window.setTimeout(
                function () {
                    $('#status').html('').removeClass('text-success');
                },
                seconds * 1000
            );

        };

        var editor = CodeMirror.fromTextArea($('#editor').get(0), {
            mode: "text/html",
            lineNumbers: true,
            matchBrackets: true
        });

        var editorHeight = $('#feature-c').height();
        editorHeight = editorHeight < 500 ? 500 : editorHeight;
        editor.setSize('100%', editorHeight);

        var currentFeature;

        $('a[data-feature]').click(function() {
            var a = $(this),
                file = a.get(0).hash.substring(a.get(0).hash.indexOf('#')+1);

            $('#status').html('Loading `' + file + '`.');

            $.ajax({
                type: 'POST',
                url: Routing.generate('behat_load_file'),
                data: {
                    file: file
                },
                success: function(data)
                {
                    editor.setValue(data);
                    currentFeature = file;
                    $('#status').html('');
                }
            });
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
