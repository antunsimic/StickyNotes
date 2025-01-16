let content = $("textarea");
let title = $("input[name='title']");

content.on("input", checkContentValidity)

title.on("input", checkTitleValidity)

function checkTitleValidity() {
    if (title[0].value.length < 1 ) {
        title[0].setCustomValidity("A title is obligatory!")
    }
    else if (title[0].value.length > 40 ) {
        title[0].setCustomValidity("The title is too long!")
    }
    else {
        title[0].setCustomValidity("")
    }
}

function checkContentValidity() {
    if (content[0].value.length < 4 ) {
        content[0].setCustomValidity("The note is too short!")
    }

    else {
        content[0].setCustomValidity("")
    }
}



$(".select-button").on("change", function (event) {
    const currentValue = $(this).find("select").val()
    // display flex or none
    $(this).find("svg").css("display", "none")
    $(this).find("#" + currentValue).css("display", "flex")


})

