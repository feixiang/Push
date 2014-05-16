$(document).ready(function() {
    var d = new Date();
    var time = d.getTime();
    var msg = "test " + time;
    $("#message").val(msg);
    
    $("button[type='submit']").click(function() {
        var form = $(this).parent();
        //alert(form.serialize());
    });
});


