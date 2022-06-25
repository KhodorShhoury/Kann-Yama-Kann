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



//start gallery
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 0,
    freeMode: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
     // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  });
//end gallery