$("document").ready(function(){

    var $form = $("#mc-embedded-subscribe-form");

    if ($form.length) {
        //bind the event
        $form.on({
            submit: function(e) {
                e.stopImmediatePropagation();
                e.preventDefault();
                e.stopPropagation();

                $.ajax({
                    url: "/subscribe",
                    type: "POST",
                    dataType: 'json',
                    data: $(this).serialize()
                }).done(function(resp) {
                    console.log("Response: ", resp);
                });
            }
        })
    }

});