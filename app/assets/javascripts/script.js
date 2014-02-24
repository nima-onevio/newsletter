"use strict";

var onevio       = onevio || {};
onevio.email     = onevio.email || {};
onevio.loader    = onevio.loader || {};
onevio.modal     = onevio.modal || {};

onevio.modal = {
    setup: function () {
        $(".cboxInline").colorbox({inline:true, width:"50%"});
    }
};

onevio.loader = {
    setup: function (options) {
        var t = this,
            defaults = {
                containerClass: ".loader"
            };
        t.o          = $.extend(options, defaults);
        t.$container = $(t.o.containerClass);

        if (!t.$container.length) {
            console.log("unable to find loader container");
            return false;
        }
    },

    show: function () {
        var t = this;
        t.$container.stop(true, true).fadeIn();
    },

    hide: function () {
        var t = this;
        t.$container.stop(true, true).fadeOut();
    }
};

onevio.email = {
    setup: function () {
        var t = this;

        onevio.loader.setup();
        t.initVars();
        t.updateAnimated();

        if (t.$form.length) {
            if (t.$email.length) {
                t.$email.focus();
            }
            t.bindEvents();
        }
    },

    initVars: function () {
        var t = this;

        t.$form     = $("#mc-embedded-subscribe-form");
        t.$error    = $(".mce_inline_error");
        t.$lError   = $("#mce-error-response");
        t.$success  = $("#mce-success-response");
        t.$body     = $("body");
        t.$email    = t.$form.find("#mce-EMAIL");
        t.valid     = false;
        t.emailData = '';
        t.linkData  = '';
    },

    bindEvents: function () {
        var t = this;

        //bind the event
        t.$body.on('click', ".resendMail", function (e) {
            var $t        = $(this),
                emailData = {email: $t.data("email")},
                linkData  = $t.data("link");

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            t.updateAnimated();
            t.hideAll();

            $(":animated").promise().done(function () {
                onevio.loader.show();
                $(":animated").promise().done(function () {
                    t.performAjax(linkData, emailData);
                });
            });

        });

        t.$form.on({
            submit: function (e) {
                e.stopImmediatePropagation();
                e.preventDefault();
                e.stopPropagation();

                t.updateAnimated();
                t.hideAll();

                $(":animated").promise().done(function () {
                    onevio.loader.show();
                    $(":animated").promise().done(function () {
                        if (t.validateEmail(t.$email) === true) {
                            t.performAjax("/subscribe", t.$form.serialize());
                        }
                    });

                });
            }
        });
    },

    validateEmail: function ($email) {
        var t     = this,
            email = $.trim($email.val()),
            valid = false,
            re    = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (email === '') {
            t.displayMessage(0, "Invalid E-mail");
        } else if (re.test(email)) {
            valid = true;
        }

        return valid;
    },

    performAjax: function (ajaxUrl, theData) {
        var t = this;

        t.hideAll();

        $.ajax({
            url: ajaxUrl,
            type: "POST",
            dataType: 'json',
            data: theData
        }).done(function (resp) {
            t.displayMessage(resp.status, resp.message);
        });
    },

    displayMessage: function (status, message) {
        var t = this;

        t.updateAnimated();

        switch (status) {
        case 0:
            t.$animated.promise().done(function () {
                onevio.loader.hide();
                $(":animated").promise().done(function () {
                    t.$error.html(message).stop().fadeIn();
                });

            });
            break;

        case 1:
            t.$animated.promise().done(function () {
                onevio.loader.hide();
                $(":animated").promise().done(function () {
                    t.$success.html(message).stop().fadeIn();
                });

            });
            break;

        case 2:
            t.$animated.promise().done(function () {
                onevio.loader.hide();
                $(":animated").promise().done(function () {
                    t.$lError.html(message).stop().fadeIn();
                });

            });
            break;
        }
    },

    hideAll: function () {
        var t = this;

        t.$error.fadeOut();
        t.$success.fadeOut();
        t.$lError.fadeOut();
    },

    updateAnimated: function () {
        var t = this;
        t.$animated = $(":animated");
    }
};

$(function () {
    onevio.email.setup();
    onevio.modal.setup();
});
