
// handle header position

//variables
let headerSection = document.querySelector(".header"); //header section
let mainSection = document.querySelector(".main"); //main section


// function that handle header position
function handleHeaderPosition(){
    if(document.documentElement.scrollTop >=  mainSection.offsetHeight - 80){
        headerSection.classList.add("fixed");
    }else{
        headerSection.classList.remove("fixed")
    }
}

window.onscroll = function(){
    handleHeaderPosition();
}



//start gallery
var swiper = new Swiper(".gallery-swiper", {
    slidesPerView: 3,
    spaceBetween: 30,
    freeMode: false,
    loop: true,
    keyboard: {
      enabled: true,
    },
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
  breakpoints :{
    0: {slidesPerView : 1},
    480 : {slidesPerView : 2},
    991 : {slidesPerView : 3},
    1200: {slidesPerView : 4},
  }
  });
//end gallery

// start tournaments




// start tournaments


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDc86l5nGQW5BgRZ87g0HiskLQFpojkF80",
  authDomain: "kann-yama-kann-firestore.firebaseapp.com",
  projectId: "kann-yama-kann-firestore",
  storageBucket: "kann-yama-kann-firestore.appspot.com",
  messagingSenderId: "138428441492",
  appId: "1:138428441492:web:03accd6edfc2e4b2b16581"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


import {getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField,onSnapshot} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js"
const db = getFirestore();



async function getTourImageFromFirestoreRealtime(){
  const dbRef = collection(db,"TournamentsImages");

   onSnapshot(dbRef,(querySnapShot)=>{
       var TournamentsImages = [];
   
        querySnapShot.forEach(doc => {
          TournamentsImages.push(doc.data());
        });
        createTournamentsSwiperSlide(TournamentsImages)

    })
}

window.onload = getTourImageFromFirestoreRealtime;

let tournaments = document.getElementById("tournaments");
let tournamentsSwiperWrapper = document.querySelector(".tournaments-swiper-wrapper");


function createTournamentsSwiperSlide(TournamentsImages){

  TournamentsImages.forEach(img=>{
    let tournamentsSwiperSlide = document.createElement("div");
    tournamentsSwiperSlide.classList.add("swiper-slide");

    let tournamentImg = document.createElement("img");
    tournamentImg.src = img.TournamentImgURL;


    tournamentsSwiperSlide.appendChild(tournamentImg);

    tournamentsSwiperWrapper.appendChild(tournamentsSwiperSlide);
  })
}
setTimeout(() => {
  var TourSwiper = new Swiper(".tournaments-swiper", {
    slidesPerView : 3,
    spaceBetween: 30,
    freeMode: false,
    loop: true,
    keyboard: {
      enabled: true,
    },
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
     // Navigation arrows
  
  breakpoints :{
    0: {slidesPerView : 1},
    480 : {slidesPerView : 2},
    991 : {slidesPerView : 3},
    1199: {slidesPerView : 4},
  }
  });
},600);



//register tournament
let popUpRegisterButton = document.getElementById("register-popup-button");
let popUpRegisterForm = document.querySelector(".popup-register-form");
function handleRegisterPopUp(e){
  e.preventDefault()
  popUpRegisterForm.classList.contains("active")
  ?popUpRegisterForm.classList.remove("active")
  :popUpRegisterForm.classList.add("active");
}

popUpRegisterButton.addEventListener("click",handleRegisterPopUp)

//handle popup Close 
let closePopUpIcon = document.getElementById("close-popup-register-form");

function closeRegisterPopUp(){
  popUpRegisterForm.classList.remove("active");
}

closePopUpIcon.addEventListener("click",closeRegisterPopUp)




let TourRegisterButton = document.getElementById("tour-register-button");





//start contact
let contactButton = document.getElementById("contact-button");
function send_handle(e){
e.preventDefault();
  let name=document.getElementById("contact-name").value;

  let msg= document.getElementById("contact-msg").value;

  let num= document.getElementById("contact-number").value;
  
  window.open(`https://wa.me/${+96176090301}?text=%20Name:%20${name}%20Message:%20${msg}`, '_blank');
}
contactButton.addEventListener("click",send_handle);
//end contact



