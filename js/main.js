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
    slidesPerView: 3,
    spaceBetween: 30,
    freeMode: true,
    loop :true,
    autoplay: {
        delay: 1500,
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
  breakpoints :{
    0: {slidesPerView : 1},
    480 : {slidesPerView : 2},
    991 : {slidesPerView : 3},
    1200: {slidesPerView : 4},
  }
  });
//end gallery