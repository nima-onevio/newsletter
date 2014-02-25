"use strict";

var onevio = onevio || {};
onevio.email = onevio.email || {};
onevio.loader = onevio.loader || {};
onevio.modal = onevio.modal || {};
onevio.navigation = onevio.navigation || {};
onevio.$page = $("html");

onevio.navgigation = {
    setup: function (options) {
        var t = this,
            defaults = {
                containerClass: ".links",
                activeClass:    "active",
                dataAttr:       'page',
                worksPage:      "#works",
                homePage:       "#home"
            };
        t.o = $.extend(options, defaults);
        t.$container = $(t.o.containerClass);

        if (!t.$container.length) {
            console.log("unable to find loader container");
            return false;
        }
        t.initVars();
        t.setPageHeights();
        t.bindEvents();
    },

    initVars: function () {
        var t = this;
        t.$page = onevio.$page;
        t.$links = t.$container.find('a');
        t.$homePage = $(t.o.homePage);
        t.$worksPage = $(t.o.worksPage);
    },

    setPageHeights: function () {
        var t = this,
            height = $(window).height() - t.$container.height(),
            row_heights = 0,
            padding,
            $rows;

        t.$worksPage.height(height);
        t.$homePage.height(height);
//        t.$page.scrollTop(t.$homePage.offset().top)

        $rows = t.$homePage.find("> row");
        $rows.each(function (i, el) {
            row_heights += $(e).height();
        });
        padding = ((height - row_heights) / 8);
        t.$homePage.css('padding-top', padding + 'px');

        row_heights = 0;
        $rows = t.$homePage.find("> row");
        $rows.each(function (i, el) {
            row_heights += $(el).height();
        });
        padding = ((height - row_heights) / 8);
        t.$worksPage.css('padding-top', padding + 'px');

        t.$page.animate({ scrollTop: t.$homePage.offset().top }, 1000);
    },

    bindEvents: function () {
        var t = this,
            $t,
            data;

        t.$links.on({
            click: function (e) {
                e.preventDefault();
                $t = $(this);
                data = $t.data(t.o.dataAttr);

                t.$links.removeClass(t.o.activeClass);
                $t.addClass(t.o.activeClass);

                if (data === "home") {
                    t.$worksPage.stop().fadeOut(500, function () {
                        t.$homePage.fadeIn();
                    });
                } else {
                    t.$homePage.stop().fadeOut(500, function () {
                        t.$worksPage.fadeIn();
                    });
                }
            }
        });
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

onevio.modal = {
    setup: function () {
        $(".cboxInline").colorbox({inline: true, width: "362px" });
    }
};

onevio.loader = {
    setup: function (options) {
        var t = this,
            defaults = {
                containerClass: ".loader"
            };
        t.o = $.extend(options, defaults);
        t.$container = $(t.o.containerClass);

        if (!t.$container.length) {
            console.log("unable to find loader container");
            return false;
        }
        if (onevio.$page.hasClass("cssanimations") && onevio.$page.hasClass("csstransitions")) {
            t.$container.html('&there4;');
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

        t.$form = $("form[name='mc-embedded-subscribe-form']");
        t.$error = $(".mce_inline_error");
        t.$errorMsg = t.$error.find(".err");
        t.$lError = $(".mce-error-response");
        t.$success = $(".mce-success-response");
        t.$successMsg = t.$success.find('.successMsg');
        t.$body = $("body");
        t.$email = t.$form.find(".mce-EMAIL");
        t.valid = false;
        t.emailData = '';
        t.linkData = '';
        t.$result = $(".result");
    },

    bindEvents: function () {
        var t = this;

        //bind the event
        t.$body.on('click', ".resendMail", function (e) {
            var $t = $(this),
                emailData = {email: $t.data("email")},
                linkData = $t.data("link");

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

        t.$result.on({
            click: function (e) {
                e.preventDefault();
                $(this).fadeOut();
            }
        });

        t.$form.on({
            submit: function (e) {
                var $form  = $(this);
                var $email = $form.find(".mce-EMAIL");

                e.stopImmediatePropagation();
                e.preventDefault();
                e.stopPropagation();

                t.updateAnimated();
                t.hideAll();


                $(":animated").promise().done(function () {
                    t.$result.stop().fadeIn(500, function () {
                        onevio.loader.show();
                        $(":animated").promise().done(function () {
                            if (t.validateEmail($email) === true) {
                                t.performAjax("/subscribe", $form.serialize());
                            }
                        });
                    });

                });
            }
        });
    },

    validateEmail: function ($email) {
        var t = this,
            email = $.trim($email.val()),
            valid = false,
            re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
            url:      ajaxUrl,
            type:     "POST",
            dataType: 'json',
            data:     theData
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
                        t.$errorMsg.html(message);
                        t.$error.stop().fadeIn();
                    });

                });
                break;

            case 1:
                t.$animated.promise().done(function () {
                    onevio.loader.hide();
                    $(":animated").promise().done(function () {
                        t.$successMsg.html(message);
                        t.$success.stop().fadeIn();
                    });

                });
                break;

            case 2:
                t.$animated.promise().done(function () {
                    onevio.loader.hide();
                    $(":animated").promise().done(function () {
                        t.$errorMsg.html(message);
                        t.$error.stop().fadeIn();
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
    onevio.navgigation.setup();
    onevio.email.setup();
    onevio.modal.setup();
});
