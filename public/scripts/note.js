
let visibility = $("#visibility")
let originalTitle = title.val();
let originalContent = content.val();
let originalVisibility = visibility.val()

function putOrPatch(newTitle, newContent) {
    if (newTitle !== originalTitle && newContent !== originalContent) {
        return "PUT";
    }
    else {
        return "PATCH";
    }
}



$("button[type='submit']").on('click', function(event) {

    event.preventDefault();
    let newTitle = title.val();
    let newContent = content.val();
    let newVisibility = visibility.val()

    if (newTitle === originalTitle && newContent === originalContent && newVisibility === originalVisibility) {
        window.location.href = "/";
        return;
    }
    
    checkContentValidity();
    checkTitleValidity();

    if (title[0].reportValidity() && content[0].reportValidity()) {

    
      $('form').submit();
    }
});




$("button[id='delete']").on("click", function(event) {
    $("input[name='_method']").val("DELETE");
    
    $('form').submit();

});


$("#EditView").on("change", function (event) {

    content[0].toggleAttribute("readonly")
    title[0].toggleAttribute("readonly")

})