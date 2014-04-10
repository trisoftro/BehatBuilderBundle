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
                    editor.setValue(data);
                    currentFeature = file;
                    $('#status').html('');
                }
            });
        };

        $(window).bind('popstate', function(event) {
            var file = this.location.href.substring(this.location.href.indexOf('#')+1);

            $.loadFile(file);
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
