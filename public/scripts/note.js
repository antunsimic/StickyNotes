

let originalTitle = title.val();
let originalContent = content.val();

function putOrPatch(newTitle, newContent) {
    if (newTitle !== originalTitle && newContent !== originalContent) {
        return "PUT";
    }
    else {
        return "PATCH";
    }
}

if (noteCreationTime == noteUpdateTime) {
    $("#updated").css("visibility", "hidden");
}

$("button[type='submit']").on('click', function(event) {

    event.preventDefault();
    let newTitle = title.val();
    let newContent = content.val();

    if (newTitle === originalTitle && newContent === originalContent) {
        window.location.href = "/";
        return;
    }
    
    checkContentValidity();
    checkTitleValidity();

    if (title[0].reportValidity() && content[0].reportValidity()) {

        if (newTitle !== originalTitle && newContent !== originalContent) {
            $("input[name='_method']").val("PUT");
        }
        else {
            $("input[name='_method']").val("PATCH");
            if (newTitle !== originalTitle) {
                $("input[name='toPatch']").val("title");
            }
            else {
                $("input[name='toPatch']").val("content"); 
            }
        }
      $('form').submit();
    }
});


$("button[id='edit']").on("click", function(event) {

   title[0].toggleAttribute("readonly");
    content[0].toggleAttribute("readonly");

       $("#eye").toggle();
       $("#pen").toggle();

    if ($(this).attr("title")==="Edit") {
        $(this).attr("title", "View-Only")
    } else {
        $(this).attr("title", "Edit")
    }
});

$("button[id='delete']").on("click", function(event) {
    $("input[name='_method']").val("DELETE");
    
    $('form').submit();

});

