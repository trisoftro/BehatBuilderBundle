(function($) {
    'use strict';

    $.modalDialog = {
        getModal: function () {
            var modal = $('#behat-modal');
            if (modal.length === 0) {
                modal = $('<div></div>');
                modal.attr('id', 'behat-modal');
                modal.addClass('modal').addClass('fade');
                modal.attr('tabindex', '-1');
                modal.attr('id', 'behat-modal');
                modal.attr('aria-hidden', 'true');
                $('body').append(modal);
                modal = $('#behat-modal');
            }
            return modal;
        },
        html: {
            header: '<div class="modal-header">%header%</div>',
            body: '<div class="modal-body">%body%</div>',
            footer: '<div class="modal-footer">%footer%</div>'
        },
        defaults: {
            header: null,
            body: 'Behat',
            footer: null,
            remote: null,
            backdrop: true,
            keyboard: true,
            show: false
        },
        currentOptions: {},
        render: function (options) {
            $.extend(this.currentOptions, this.defaults, options);
            this.update();
            this.show();
        },
        update: function () {
            this.getModal().html(

                '<div class="modal-dialog"><div class="modal-content">' +

                    (this.currentOptions.header === null
                        ? ''
                        : this.html.header.replace('%header%', this.currentOptions.header)) +
                    (this.currentOptions.body === null
                        ? ''
                        : this.html.body.replace('%body%', this.currentOptions.body)) +
                    (this.currentOptions.footer === null
                        ? ''
                        : this.html.footer.replace('%footer%', this.currentOptions.footer)) +

                    '</div></div>'
            );

            $(document).trigger("modal.update", []);
        },
        show: function () {
            this.getModal().modal('show');
        },
        hide: function () {
            this.getModal().modal('hide');
        },
        setHeader: function (data, html) {
            this.currentOptions.header = html === true ? data : '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3>' + data + '</h3>';
            this.update();
        },
        setBody: function (data) {
            this.currentOptions.body = data;
            this.update();
        },
        setFooter: function (data) {
            this.currentOptions.footer = data;
            this.update();
        },
        removeHeader: function () {
            this.setHeader(null);
        },
        removeBody: function () {
            this.setBody(null);
        },
        removeFooter: function () {
            this.setFooter(null);
        },
        getHeader: function () {
            return this.getModal().find('.modal-header');
        },
        getBody: function () {
            return this.getModal().find('.modal-body');
        },
        getFooter: function () {
            return this.getModal().find('.modal-footer');
        }
    };

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

        var featuresColumn = $('#features-c');

        var editorHeight = featuresColumn.height();
        editorHeight = editorHeight < 500 ? 500 : editorHeight;
        editor.setSize('100%', editorHeight);

        var currentFeature;

        $.loadFeature = function (file) {
            $('#status').removeClass().html('Loading `' + file + '`.');

            $.ajax({
                type: 'POST',
                url: Routing.generate('behat_load_feature'),
                data: {
                    file: file
                },
                success: function(data) {
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

        $.loadFeatures = function () {
            $('#status').removeClass().html('Loading features.');

            $.ajax({
                type: 'POST',
                url: Routing.generate('behat_load_features'),
                success: function(data) {
                    if(data.content) {
                        featuresColumn.html(data.content);
                        $.timerNotifier('Features loaded successfully.')
                    } else {
                        editor.setValue('');
                        $.timerNotifier('Could not load features.', 'text-danger')
                    }
                }
            });
        };

        $.loadHash = function() {
            var file = (window.location.href.indexOf('#') != -1) ? window.location.href.substring(window.location.href.indexOf('#')+1) : false;

            if(file) {
                $.loadFeature(file);
            }
        };

        //load initial hash
        $.loadHash();

        //load hash on history change
        $(window).bind('popstate', function(event) {
            $.loadHash();
        });

        $("a.save").click(function() {

            $('#status').html('Saving `' + currentFeature + '` ...');

            $.ajax({
                type: 'POST',
                url: Routing.generate('behat_save_feature'),
                data: {
                    file: currentFeature,
                    data: editor.getValue()
                },
                success: function(data) {
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

        $(document).bind("modal.update", function() {
            $('#submit').on("click", function(){

                var form = $('#new-feature');
                var data = form.serializeArray();

                $.ajax({
                    type: form.attr('method'),
                    url: form.attr('action'),
                    data: data,
                    beforeSend: function (xhr) {
                        $.modalDialog.setBody('Submitting ...');
                    },
                    success: function(data) {
                        $.modalDialog.hide();
                        $.loadFeatures();
                    }
                });
            });
        });

        $("a.add").click(function() {

            if($('#new-feature').length === 0) {

                $.modalDialog.render({
                    header: '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3>Add new feature</h3>',
                    body: 'Loading form ...',
                    footer: '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button><button type="button" id="submit" class="btn btn-primary">Save</button>'
                });

                $.ajax({
                    type: 'GET',
                    url: Routing.generate('behat_new_feature'),
                    success: function(data) {
                        $.modalDialog.setBody(data.content);
                    }
                });
            }

            $.modalDialog.show();

            return false;
        });

    });
}(jQuery));
