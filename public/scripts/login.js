/*
$("div.password svg").each( function () {
  console.log(this + ": " + $(this).css("display")) //inline
})
*/

//console.log(error);
//"Wrong username or password"
//"User already exists"

// username: 4-40
// password: 6-50
// password and reentered password must match
let username = $("input[name='username']")
let password = $("input[name='password']")
let passwordReentered = $("input[name='passwordReentered']")
let signup = $("input[type='checkbox']")


username.on("input", checkUsernameValidity)
password.on("input", checkPasswordValidity)
passwordReentered.on("input", checkPasswordValidity)



function loginErrorHandling() {
    $("#validationServerUsernameFeedback").text(error);
    username.addClass("is-invalid")
    
    if (error === "Wrong username or password") {
        password.addClass("is-invalid")
    }
    else if (error === "User already exists") {
        signup.prop("checked", true);
        checkboxChange()
    }

}

if (error !== "No error") {
   
    loginErrorHandling();
}

let passwordVisibility = "hide";

$("input[type='checkbox']").on("change", checkboxChange)

function checkboxChange() {
    if (signup[0].checked) {
        // a new user wants to sign up
        $("div.registration").css("display", "flex")
        $("hr.registration").css("display", "block")
        $("small.registration").css("display", "inline")  
        $("form").attr("action", "/register");

        $(".signin span").each(function () {
            this.innerText = this.innerText.replace("in", "up"); 
        })
    }
    else {
        // an existing user wants to sign in
        $(".registration").css("display", "none")
        $("form").attr("action", "/login");
        
        $(".signin span").each(function () {
            this.innerText = this.innerText.replace("up", "in"); 
        })
    }
}



function checkUsernameValidity() {
    if (username.val().length < 4) {
        username[0].setCustomValidity("Username is too short!");
    }
    else if (username.val().length > 40) {
        username[0].setCustomValidity("Username is too long!");
    }
    else {
        username[0].setCustomValidity("");
    }
}

function checkPasswordValidity() {
    if (password.val().length < 6) {
        password[0].setCustomValidity("Password is too short!");
    }
    else if (password.val().length > 50) {
        password[0].setCustomValidity("Password is too long!");
    }
    else if (signup.prop("checked") && password.val() !== passwordReentered.val())   {
        password[0].setCustomValidity("");
        passwordReentered[0].setCustomValidity("Passwords do not match!");
    }
    else {
        password[0].setCustomValidity("");
        passwordReentered[0].setCustomValidity("");
    }
}

$("#non-oauth").on('click', function(event) {  

    event.preventDefault();
    
    checkUsernameValidity();
    checkPasswordValidity();
   
    if (username[0].reportValidity() && password[0].reportValidity() && passwordReentered[0].reportValidity()) {
        $('form').submit();
    }  
      
});

$(".oauth").on('click', function(event) { 
    username[0].setCustomValidity("");
    password[0].setCustomValidity("");
    passwordReentered[0].setCustomValidity("");
      
});


$("div.password").on("click", function (event) {
    if ($(event.target).closest("button").length > 0) {
        if (passwordVisibility==="hide") {

            $(this).find("input").attr("type", "text");
            $(this).find(".show").css("display", "none");
            $(this).find(".hide").css("display", "inline");
            passwordVisibility="show"
        }
        else {
            $(this).find("input").attr("type", "password");
            $(this).find(".show").css("display", "inline");
            $(this).find(".hide").css("display", "none");
            passwordVisibility="hide"
        }


    } 
}) 

