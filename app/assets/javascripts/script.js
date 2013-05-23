$("document").ready(function(){

    var $form    = $("#mc-embedded-subscribe-form"),
        $error   = $(".mce_inline_error"),
        $lError  = $("#mce-error-response"),
        $success = $("#mce-success-response"),
        $email,
        emailData,
        linkData,
        $t;

    if ($form.length) {

        $email = $form.find("#mce-EMAIL");
        if ($email.length) {
            $email.focus();
        }

        $("body").on('click', ".resendMail", function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                $t        = $(this);
                emailData = {email: $t.data("email")};
                linkData  = $t.data("link");
                console.log('emailData: ', emailData);
                performAjax(linkData, emailData);
           }
        );

        //bind the event
        $form.on({
            submit: function(e) {
                e.stopImmediatePropagation();
                e.preventDefault();
                e.stopPropagation();

                performAjax("/subscribe", $(this).serialize());
            }
        })
    }

    function performAjax(ajaxUrl, theData) {
        hideAll();

        $.ajax({
            url: ajaxUrl,
            type: "POST",
            dataType: 'json',
            data: theData
        }).done(function(resp) {
            switch (resp.status) {
                case 0:
                    $error.html(resp.message).stop(true, true).fadeIn();
                    break;

                case 1:
                    $success.html(resp.message).stop(true, true).fadeIn();
                    break;

                case 2:
                    $lError.html(resp.message).stop(true, true).fadeIn();
                    break;
            }
            console.log("Response: ", resp);
        });
    }

    function hideAll() {
        $error.stop(true, true).fadeOut();
        $success.stop(true, true).fadeOut();
        $lError.stop(true, true).fadeOut();
    }

});