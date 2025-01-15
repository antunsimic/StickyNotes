


$("button[type='submit']").on('click', function(event) {

    event.preventDefault();
    let content = $("textarea");
    let title = $("input[name='title']");
    
    checkContentValidity();
    checkTitleValidity();

    if (title[0].reportValidity() && content[0].reportValidity()) {
    
        $('form').submit();
    }  
    
});

