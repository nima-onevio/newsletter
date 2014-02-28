"use strict";

var onevio = onevio || {};
onevio.email = onevio.email || {};
onevio.loader = onevio.loader || {};
onevio.modal = onevio.modal || {};
onevio.navigation = onevio.navigation || {};
onevio.mobile = onevio.mobile || {};
onevio.counter = onevio.counter || {};
onevio.$page = $("body");
onevio.$html = $("html");

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
        if (!onevio.mobile.isMobile()) {
            t.setPageHeights();
        }
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

        $rows = t.$homePage.find("> row");
        $rows.each(function (i, el) {
            row_heights += $(el).height();
        });
        padding = ((height - row_heights) / 5);
        t.$homePage.css('padding-top', padding + 'px');

        row_heights = 0;
        $rows = t.$homePage.find("> row");
        $rows.each(function (i, el) {
            row_heights += $(el).height();
        });
        padding = ((height - row_heights) / 5);
        t.$worksPage.css('padding-top', padding + 'px');

        t.$page.animate({ scrollTop: t.$homePage.offset().top }, 1000, function () {
            onevio.counter.initAll();
        });
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
        $(document).bind('cbox_closed', function () {
            $(".result").hide();
        });
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
        if (onevio.$html.hasClass("cssanimations") && onevio.$html.hasClass("csstransitions")) {
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
                t.$result.fadeOut();
            }
        });

        t.$form.on({
            submit: function (e) {
                var $form = $(this),
                    $email = $form.find(".mce-EMAIL"),
                    $result = $("[data-form='" + $form.data('result') + "']");

                e.stopImmediatePropagation();
                e.preventDefault();
                e.stopPropagation();

                t.updateAnimated();
                t.hideAll();

                $(":animated").promise().done(function () {
                    $result.stop().fadeIn(500, function () {
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

onevio.mobile = {
    setup: function () {
        if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
            var viewportmeta = document.querySelector('meta[name="viewport"]');

            if (viewportmeta) {
                viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
                document.body.addEventListener('gesturestart', function () {
                    viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
                }, false);
            }
        }
    },

    isMobile: function () {
        return (/iphone|ipod|android|blackberry/).test(navigator.userAgent.toLowerCase());
    }

};

onevio.counter.progress = function (options) {
    var t = this;
    t.o = options;
    t.nowValue = t.o.nowValue;
    t.now2Value = t.o.now2Value;
    t.$target = $(t.o.target);
};

onevio.counter.progress.prototype.setup = function () {
    var t = this;
    t.maind();
};

onevio.counter.progress.prototype.maind = function () {
    var t = this,
        startdate = new Date();

    t.now(startdate.getYear(), startdate.getMonth(), startdate.getDate(), startdate.getHours(), startdate.getMinutes(), startdate.getSeconds());
};

onevio.counter.progress.prototype.changeValue = function (number, pv) {
    var t = this,
        numberstring = "",
        i = 0,
        j = 0;

    while (number > 1) {

        numberstring = (Math.round(number - 0.5) % 10) + numberstring;
        number = number / 10;
        j += 1;
        if (number > 1 && j === 3) {
            numberstring = "," + numberstring;
            j = 0;
        }
        i += 1;
    }

    if (pv === 1) {
        t.$target.html(numberstring);
    }
};

onevio.counter.progress.prototype.now = function (year, month, date, hours, minutes, seconds) {
    var t = this,
        startDate = new Date(year, month, date, hours, minutes, seconds),
        now = t.nowValue,
        now2 = t.now2Value,
        growRatePercentage = (now2 - now) / now * 100,
        growRatePerSecond = t.o.growRatePerSecond || (now * (growRatePercentage / 100)) / 365.0 / 24.0 / 60.0 / 60.0,
        nu = new Date(),
        shouldStartAt = new Date(t.o.startYear, 1, 1),
        secondenoppagina = (nu.getTime() - startDate.getTime()) / 1000,
        totaleschuld = (nu.getTime() - shouldStartAt.getTime()) / 1000 * growRatePerSecond + now,
        timerID;

    t.changeValue(totaleschuld, 1);

    timerID = setTimeout(function () {
        t.now(startDate.getYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
    }, 50);
};

onevio.counter.statsPerSeconds = function (yearValue) {
    var perDay = yearValue / 360,
        perHour = perDay / 24,
        perMinute = perHour / 60,
        perSecond = perMinute / 60;

    return perSecond;
};

onevio.counter.setup = {
    co2: function () {
        var t = this,
            c,
            options = {};

        options.nowValue = 4714536340.0;
        options.growRatePerSecond = onevio.counter.statsPerSeconds(options.nowValue);
        options.now2Value = options.nowValue + options.growRatePerSecond;
        options.startYear = 2014;
        options.target = "#co2";
        c = new onevio.counter.progress(options);
        c.setup();
    },

    population: function () {
        var t = this,
            c,
            options = {};

        options.nowValue = 5600000000.0;
        options.now2Value = 5690000000.0;
        options.startYear = 96;
        options.target = "#worldpopulation";
        c = new onevio.counter.progress(options);
        c.setup();
    },

    healthCare: function () {
        var t = this,
            c,
            options = {};

        options.nowValue = 6416071364.0;
        options.growRatePerSecond = onevio.counter.statsPerSeconds(options.nowValue);
        options.now2Value = options.nowValue + options.growRatePerSecond;
        options.startYear = 2014;
        options.target = "#health";
        c = new onevio.counter.progress(options);
        c.setup();
    },

    desertification: function () {
        var t = this,
            c,
            options = {};

        options.nowValue = (1631102.0) * 3;
        options.growRatePerSecond = onevio.counter.statsPerSeconds(options.nowValue);
        options.now2Value = options.nowValue + options.growRatePerSecond;
        options.startYear = 2014;
        options.target = "#desert";
        c = new onevio.counter.progress(options);
        c.setup();
    },

    energy: function () {
        var t = this,
            c,
            options = {};

        options.nowValue = 20005993584.0;
        options.growRatePerSecond = onevio.counter.statsPerSeconds(options.nowValue);
        options.now2Value = options.nowValue + options.growRatePerSecond;
        options.startYear = 2014;
        options.target = "#energy";
        c = new onevio.counter.progress(options);
        c.setup();

    },

    childLabor: function () {
        var t = this,
            c,
            options = {};

        options.nowValue = 115314000.0;
        options.growRatePerSecond = onevio.counter.statsPerSeconds(options.nowValue);
        options.now2Value = options.nowValue + options.growRatePerSecond;
        options.startYear = 2014;
        options.target = "#childLabor";
        c = new onevio.counter.progress(options);
        c.setup();
    }
};

onevio.counter.countTo = {
    setup: function () {
        var $members = $('#members.odometer'),
            $remaining = $("#remaining.odometer");

        setTimeout(function () {
            $members.html($members.data('target'));
        }, 1000);

        setTimeout(function () {
            $remaining.html("007");
        }, 1000);

//        $members.countTo({
//            from: 0,
//            to: parseInt($members.data('target')),
//            speed: 2000,
//            refreshInterval: 40,
//            onComplete: function(value) {
//                console.debug(this);
//            }
//        });
//
//        $remaining.countTo({
//            from: 115,
//            to: parseInt($remaining.data('target')),
//            speed: 2000,
//            refreshInterval: 40,
//            onComplete: function(value) {
//                console.debug(this);
//            }
//        });
    }
};

$.fn.countTo = function (options) {
    // merge the default plugin settings with the custom options
    var defaults = {
        from: 0,  // the number the element should start at
        to: 100,  // the number the element should end at
        speed: 1000,  // how long it should take to count between the target numbers
        refreshInterval: 100,  // how often the element should be updated
        decimals: 0,  // the number of decimal places to show
        onUpdate: null,  // callback method for every time the element is updated,
        onComplete: null  // callback method for when the element finishes updating
    };

    options = $.extend({}, defaults, options || {});

    // how many times to update the value, and how much to increment the value on each update
    var loops = Math.ceil(options.speed / options.refreshInterval),
        increment = (options.to - options.from) / loops;

    return $(this).each(function() {
        var _this = this,
            loopCount = 0,
            value = options.from,
            interval = setInterval(updateTimer, options.refreshInterval);

        function updateTimer() {
            value += increment;
            loopCount++;
            $(_this).html(value.toFixed(options.decimals));

            if (typeof(options.onUpdate) == 'function') {
                options.onUpdate.call(_this, value);
            }

            if (loopCount >= loops) {
                clearInterval(interval);
                value = options.to;

                if (typeof(options.onComplete) == 'function') {
                    options.onComplete.call(_this, value);
                }
            }
        }
    });
};

onevio.counter.initAll = function () {
    onevio.counter.setup.population();
    onevio.counter.setup.co2();
    onevio.counter.setup.healthCare();
    onevio.counter.setup.desertification();
    onevio.counter.setup.energy();
    onevio.counter.setup.energy();
    onevio.counter.setup.childLabor();
    //onevio.counter.countTo.setup();
};

$(function () {
    onevio.mobile.setup();
    onevio.navgigation.setup();
    onevio.email.setup();
    onevio.modal.setup();
});

