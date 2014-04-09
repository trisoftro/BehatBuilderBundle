(function($) {
    'use strict';

    $.modalDialog = {
        getModal: function () {
            var modal = $('#hive-modal');
            if (modal.length === 0) {
                modal = $('<div></div>');
                modal.attr('id', 'hive-modal');
                modal.addClass('modal').addClass('fade');
                modal.attr('tabindex', '-1');
                modal.attr('id', 'hive-modal');
                modal.attr('aria-hidden', 'true');
                $('body').append(modal);
                modal = $('#hive-modal');
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
            body: 'Hive',
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

        // Initialize tooltips
        $('[rel="tooltip"]').tooltip();

        // Hide success message after delay
        if ($('#alert-success').length) {
            var successTimeout = window.setTimeout(
                function () {
                    $('#alert-success').alert('close');
                },
                5000
            );
        }

        $('a[data-delete]').each(function (k, v) {
            var $v = $(v),
                message = $v.data('message') || 'Are you sure?',
                selector = $v.data('delete');

            // this may be stupid but we must make sure that the dialog won't be triggered twice
            if ( $v.is('[data-delete]') ) {
                var title = $v.data('modal-title') || 'Confirm Delete',
                    buttonText = $v.data('modal-button') || 'Delete';

                $v.click(function () {
                    $.modalDialog.render({
                        header: '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3>' + title + '</h3>',
                        body: message,
                        footer: '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button><button type="button" class="btn btn-primary">' + buttonText + '</button>'
                    });

                    $.modalDialog.show();

                    $.modalDialog.getFooter().find('.btn-primary').click(function() {
                        $.modalDialog.hide();
                        window.location.href = $v.data('href');
                        return false;
                    });

                    return false;
                });
            }
        });

        //datepickers
        $.initDatePickers = function () {
            $('input[id][data-date-format]').each(function (k, element) {
                var $element = $(element);
                if (!$element.data().hasOwnProperty('datepicker')) {
                    $element.datepicker({
                        weekStart: 1,
                        autoclose: true
                    });
                }
            });
        };
        $.initDatePickers();

        // Initialize Select2
        $.initSelect2 = function () {
            var selects = $('select.select2, input.select2');
            selects.each(function (k, v) {
                var $v = $(v),
                    options = {
                        width : 'element'
                    },
                    selectAttrbutes = {},
                    $input = $('<input/>'),
                    value = ('' + $v.val()).split(':');
                if ($v.data().hasOwnProperty('select2')) {
                    return;
                }
                $v.select2(options);
            });
        };
        $.initSelect2();

        var interval;

        // Initialize Timelog
        $.initTimelog = function () {
            var form = $('form#tw');

            var parsleyOptions = {
                showErrors: false
                , listeners: {
                    onFieldError: function ( elem, constraints, ParsleyField ) {
                        elem.parents('.form-group').removeClass('has-success').addClass('has-error');

                        var title='';
                        $.each(constraints, function(index, constrain) {
                            if(ParsleyField.Validator.messages[index] != 'undefined') {
                                title += ParsleyField.Validator.messages[index];
                            }
                        });

                        elem.parents('.form-group').tooltip({
                            title: title
                        });
                    }
                    , onFieldSuccess: function ( elem, constraints, ParsleyField ) {
                        elem.parents('.form-group').removeClass('has-error').addClass('has-success');
                        elem.parents('.form-group').tooltip('destroy');
                    }
                }
            };

            form.parsley(parsleyOptions);

            $('form#tw .stop[data-id]').each(function (k, element) {
                interval = setInterval(countUp, 1000);
            });

            $('.newt').click(function() {
                $('div.timelog').toggle();
                $('.select2').width('100%');
                return false;
            });

            $("form#tw .start").click(function() {

                var button = $(this);

                form.parsley('validate');

                if(form.parsley('isValid')) {
                    $("form#tw .time-manual").hide();
                    $("form#tw .time-count").show();
                    $("form#tw .plus").hide();
                    button.hide();
                    $("form#tw .stop").show();

                    $('button.count-up').html('00:00:00');

                    interval = setInterval(countUp, 1000);

                    var data = form.serializeArray();

                    data.push({
                        'name': 'start',
                        'value': true
                    });

                    $.ajax({
                        type: form.attr('method'),
                        url: form.attr('action'),
                        data: data,
                        success: function(data)
                        {

                        }
                    });
                }

                return false;
            });

            $("form#tw .stop").click(function() {

                var button = $(this);

                form.parsley('validate');

                if(form.parsley('isValid')) {
                    window.clearInterval(interval);

                    button.html('loading...');
                    button.removeClass('btn-danger').addClass('btn-info');

                    var data = form.serializeArray();

                    data.push({
                        'name': 'stop',
                        'value': true
                    });

                    $.ajax({
                        type: form.attr('method'),
                        url: form.attr('action'),
                        data: data,
                        success: function(data)
                        {
                            form.parent().html(data);
                            $.initSelect2();
                            $.initTimelog();
                            form.parsley(parsleyOptions);
                        }
                    });
                }

                return false;
            });

            $("form#tw .plus").click(function() {

                var button = $(this);

                form.parsley('validate');

                if(form.parsley('isValid')) {
                    $("form#tw .start").hide();
                    $("form#tw .stop").hide();
                    button.html('loading...');

                    var data = form.serializeArray();

                    data.push({
                        'name': 'plus',
                        'value': true
                    });

                    $.ajax({
                        type: form.attr('method'),
                        url: form.attr('action'),
                        data: data,
                        success: function(data)
                        {
                            form.parent().html(data);
                            $.initSelect2();
                            $.initTimelog();
                            form.parsley(parsleyOptions);
                        }
                    });
                }

                return false;
            });
        };
        $.initTimelog();

        function countUp() {
            var hour, minute, second;
            var time = $('button.count-up').html().split(":");

            time = parseInt(time[0])*3600 + parseInt(time[1])*60 + parseInt(time[2]) + 1;

            hour = parseInt(time / 3600);
            minute = parseInt((time - hour * 3600)/60);
            second = parseInt(time - hour*3600 - minute*60);

            // Add leading zero to hour
            if ( hour.toString().length === 1 ) {
                hour = '0' + hour;
            }

            // Add leading zero to minute
            if ( minute.toString().length === 1 ) {
                minute = '0' + minute;
            }

            // Add leading zero to second
            if ( second.toString().length === 1 ) {
                second = '0' + second;
            }

            $('button.count-up').html(hour + ':' + minute + ':' + second);
        }

        $('textarea').each(function (k, v) {

            if($(v).data('html')) {
                $(v).height(200);

                var elements = ['br', 'a'];
                $(v).textcomplete({
                    html: {
                        match: /<(\w*)$/,
                        search: function (term, callback) {
                            callback($.map(elements, function (element) {
                                return element.indexOf(term) === 0 ? element : null;
                            }));
                        },
                        index: 1,
                        replace: function (element) {
                            if(element == 'br') {
                                return ['<' + element + '>', ''];
                            }
                            else {
                                return ['<' + element + '>', '</' + element + '>'];
                            }
                        }
                    }
                });
            }

            var textCompleteXhr;

            if($(v).data('ticket')) {
                $(v).textcomplete({
                    ticket: {
                        match: /(^|\s)#(\w*)$/,
                        search: function (term, callback) {
                            var project = $('#tss_corebundle_timelogwidgettype_project').val();
                            var form = $('form#tw');

                            form.parsley('validate');

                            if(form.parsley('isValid')) {
                                if(typeof textCompleteXhr != 'undefined') {
                                    textCompleteXhr.abort();
                                    callback([]);
                                }
                                textCompleteXhr = $.getJSON(Routing.generate('hive_ticket_search', { projectId: project, term: term }), {})
                                    .done(function (resp) { callback(resp); })
                                    .fail(function ()     { callback([]);   });
                            }
                            else {
                                callback([]);
                            }
                        },
                        replace: function (value) {
                            return '$1' + value + ' ';
                        },
                        index: 2
                    }
                });
            }
        });

        // Initialize Timelog
        $.initTicketsRefresh = function (open) {
            var button = $("a#ticket-refresh");

            button.show();
            $("a#ticket-hide").show();
            $("a#ticket-open").hide();

            $("table#ticket-refresh-content").fadeOut();

            button.html('loading...');

            $.ajax({
                type: 'POST',
                url: Routing.generate('hive_my_tickets_refresh'),
                data: {
                    open: open
                },
                success: function(data)
                {
                    $("table#ticket-refresh-content").html(data.content);
                    $("table#ticket-refresh-content").fadeIn();
                    button.html('refresh');
                    $('small.my-tickets-cache-date').html(data.cacheDate);
                    $('small.my-tickets-cache-date').show();
                }
            });
        };

        $("a#ticket-open").click(function() {

            $.initTicketsRefresh(1);

            return false;
        });

        $("a#ticket-hide").click(function() {

            $.ajax({
                type: 'POST',
                url: Routing.generate('hive_my_tickets_hide'),
                data: {},
                success: function(data)
                {
                    $("a#ticket-refresh").hide();
                    $("a#ticket-hide").hide();
                    $("a#ticket-open").show();
                    $('small.my-tickets-cache-date').hide();

                    $("table#ticket-refresh-content").html('');
                    $("table#ticket-refresh-content").fadeOut();
                }
            });

            return false;
        });

        $("a#ticket-refresh").click(function() {

            $.initTicketsRefresh(0);

            return false;
        });

        if($.jStorage.get('ticket-open') === true ) {
            $.initTicketsRefresh();
        }

        // Toggle Report Widget on Dashboard
        $.toggleDashboardWidget = function (button) {

            button.html('working...');

            $.ajax({
                type: 'POST',
                url: Routing.generate('hive_toggle_dashboard_widget'),
                data: {
                    pin: button.data('pin'),
                    id: button.data('id')
                },
                success: function(data)
                {
                    button.removeClass('widget-'+(button.data('pin') ? 'pin' : 'unpin')).addClass('widget-'+(button.data('pin') ? 'unpin' : 'pin'));
                    button.html((button.data('pin') ? 'unpin from dashboard' : 'pin on dashboard'));

                    if(button.hasClass('dashboard') && !button.data('pin')) {
                        var prevWidget = $('#widget-'+button.data('id')).prev('.report');
                        var nextWidget = $('#widget-'+button.data('id')).next('.report');

                        $('#widget-'+button.data('id')).remove();

                        $.cleanMenuMoveDashboardWidget(prevWidget);
                        $.cleanMenuMoveDashboardWidget(nextWidget);
                    }

                    button.data('pin', (button.data('pin') ? 0 : 1));
                }
            });
        };

        $("a.widget-toggle").click(function() {

            var button = $(this);

            $.toggleDashboardWidget(button);

            return false;
        });

        $.cleanMenuMoveDashboardWidget = function(widget) {
            if(widget.prev('.report').length) {
                widget.find('.widget-move-up').parent().show();
            }
            else {
                widget.find('.widget-move-up').parent().hide();
            }

            if(widget.next('.report').length) {
                widget.find('.widget-move-down').parent().show();
            }
            else {
                widget.find('.widget-move-down').parent().hide();
            }
        }

        // Move Report Widget on Dashboard
        $.moveDashboardWidget = function (button, move) {

            var currentWidget, previousWidget, nextWidget, buttonHtml;
            buttonHtml = button.html();
            button.html('working...');

            $.ajax({
                type: 'POST',
                url: Routing.generate('hive_move_dashboard_widget'),
                data: {
                    move: move,
                    id: button.data('id')
                },
                success: function(data)
                {
                   currentWidget = $('#widget-'+button.data('id'));
                   if(move == -1) {
                       previousWidget = currentWidget.prev();

                       if(previousWidget.length) {
                           currentWidget.after(previousWidget);
                           button.html(buttonHtml);
                           $.cleanMenuMoveDashboardWidget(previousWidget);
                       }
                   }
                   else if(move == 1) {
                       nextWidget = currentWidget.next();

                       if(nextWidget.length) {
                           currentWidget.before(nextWidget);
                           button.html(buttonHtml);
                           $.cleanMenuMoveDashboardWidget(nextWidget);
                       }
                   }
                   $.cleanMenuMoveDashboardWidget(currentWidget);
                }
            });
        };

        $("a.widget-move-down").click(function() {

            var button = $(this);

            $.moveDashboardWidget(button, 1);

            return false;
        });

        $("a.widget-move-up").click(function() {

            var button = $(this);

            $.moveDashboardWidget(button, -1);

            return false;
        });

        $('a[data-pay]').each(function (k, v) {
            var $v = $(v),
                paypal = $v.data('paypal'),
                invoice = $v.data('invoice');

            $v.click(function () {

                var form = $('<form></form>').attr("id",'hiddenForm' ).attr("name", 'hiddenForm').attr('action', paypal.action).attr('method', 'POST');

                $("<input type='hidden'/>").attr("name", 'business').val(paypal.business).appendTo(form);
                $("<input type='hidden'/>").attr("name", 'cancel_return').val(Routing.generate('hive_core_dashboard_index', {}, true)).appendTo(form);
                $("<input type='hidden'/>").attr("name", 'return').val(Routing.generate('hive_core_dashboard_index', {}, true)).appendTo(form);
                $("<input type='hidden'/>").attr("name", 'notify_url').val(Routing.generate('hive_paypal_notify', {}, true)).appendTo(form);
                $("<input type='hidden'/>").attr("name", 'cmd').val('_xclick').appendTo(form);
                $("<input type='hidden'/>").attr("name", 'display').val('1').appendTo(form);
                $("<input type='hidden'/>").attr("name", 'quantity').val('1').appendTo(form);
                $("<input type='hidden'/>").attr("name", 'item_name').val(invoice.title).appendTo(form);
                $("<input type='hidden'/>").attr("name", 'amount').val(invoice.amount).appendTo(form);
                $("<input type='hidden'/>").attr("name", 'currency_code').val(invoice.currency).appendTo(form);
                $("<input type='hidden'/>").attr("name", 'custom').val(invoice.id).appendTo(form);

                form.appendTo('body').submit();

                return false;
            });
        });
    });
}(jQuery));
