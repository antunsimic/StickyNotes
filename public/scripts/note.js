
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



function update() {
    
   
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
    else {
        console.log("I was called!")
        let selectDone = $("#EditView")[0];
        if (selectDone.value === "Done") {
            console.log("the value is indeed done!")
            selectDone.querySelector("#SelectDone").toggleAttribute("selected")
            selectDone.querySelector("#SelectEditing").toggleAttribute("selected")
            selectDone.value = "Editing"
            $("#Editing").css("display", "flex")

        }
    }
}


  




$("button[id='delete']").on("click", function(event) {
    $("input[name='_method']").val("DELETE");
    
    $('form').submit();

});


$("#EditView").on("change", function (event) {
    if (this.value === "Done") {
        update()
    }
    else {
        content[0].toggleAttribute("readonly")
        title[0].toggleAttribute("readonly")
    }


})

$("button[type='submit']").on('click', update)