// handle header position

//variables
let headerSection = document.querySelector(".header"); //header section
let mainSection = document.querySelector(".main"); //main section


// function that handle header position
function handleHeaderPosition(){
    if(document.documentElement.scrollTop >=  mainSection.offsetHeight - 80){
        console.log("fixed");
        headerSection.classList.add("fixed");
    }else{
        headerSection.classList.remove("fixed")
    }
}

window.onscroll = function(){
    handleHeaderPosition();
}