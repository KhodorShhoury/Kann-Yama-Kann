// handle header position fixed
//variables
let headerSection = document.querySelector(".header"); //header section
let mainSection = document.querySelector(".main"); //main section

// function that handle header position
function handleHeaderPosition() {
	if (document.documentElement.scrollTop >= mainSection.offsetHeight - 80) {
		headerSection.classList.add("fixed");
	} else {
		headerSection.classList.remove("fixed")
	}
}
//handle header position onscroll and load.
window.addEventListener("load", handleHeaderPosition);
window.addEventListener("scroll", handleHeaderPosition);

//handle mav links
let navLinks = [...document.querySelectorAll(".nav-link")];

function handleNavLinksActive(e) {
	navLinks.forEach(navlink => navlink.classList.remove("active"));
	e.currentTarget.classList.add("active");
}

navLinks.forEach(navlink => navlink.addEventListener("click", handleNavLinksActive))

const sections = [...document.querySelectorAll(".section")];

function navLinksHighLight() {
	var current = "";
	sections.forEach((section) => {
		const sectionTop = section.offsetTop;
		if (scrollY >= sectionTop - headerSection.offsetHeight) {
			current = section.getAttribute("id");
		}
	});

	navLinks.forEach((li) => {
		li.classList.remove("active");
		if (li.querySelector("a").href.includes(current)) {

			li.classList.add("active");
		}
	});
}
window.addEventListener("scroll", navLinksHighLight);

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
	breakpoints: {
		0: {
			slidesPerView: 1
		},
		480: {
			slidesPerView: 2
		},
		991: {
			slidesPerView: 3
		},
		1200: {
			slidesPerView: 4
		},
	}
});
//end gallery
// start tournaments
// Import the functions you need from the SDKs you need
import {
	initializeApp
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
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

import {
	getFirestore,
	doc,
	getDoc,
	getDocs,
	setDoc,
	collection,
	addDoc,
	updateDoc,
	deleteDoc,
	deleteField,
	onSnapshot
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js"
const db = getFirestore();

async function getTourImageFromFirestoreRealtime() {
	const dbRef = collection(db, "TournamentsImages");

	onSnapshot(dbRef, (querySnapShot) => {
		var TournamentsImages = [];

		querySnapShot.forEach(doc => {
			TournamentsImages.push(doc.data());
		});
		createTournamentsSwiperSlide(TournamentsImages)

	})
}
window.addEventListener("load", getTourImageFromFirestoreRealtime)

let tournamentsSwiperWrapper = document.querySelector(".tournaments-swiper-wrapper");

var tourImages;
function createTournamentsSwiperSlide(TournamentsImages) {

	TournamentsImages.forEach(img => {
		let tournamentsSwiperSlide = document.createElement("div");
		tournamentsSwiperSlide.classList.add("swiper-slide");

		let tournamentImg = document.createElement("img");
		tournamentImg.classList.add("tour-img");
		tournamentImg.src = img.TournamentImgURL;
		tournamentImg.alt = "tournament-img";

		tournamentsSwiperSlide.appendChild(tournamentImg);

		tournamentsSwiperWrapper.appendChild(tournamentsSwiperSlide);
	})

	tourImages = [...document.querySelectorAll(".tour-img")];

}

setTimeout(() => {
	var TourSwiper = new Swiper(".tournaments-swiper", {
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
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		// Navigation arrows
		breakpoints: {
			0: {
				slidesPerView: 1
			},
			480: {
				slidesPerView: 2
			},
			991: {
				slidesPerView: 3
			},
			1199: {
				slidesPerView: 4
			},
		}
	});
}, 4000);
 
let showTourImgDiv = document.querySelector(".show-tour-img-div");
let tourImgDiv = document.querySelector(".show-tour-img-container .image");
let cloneElement;
function showTourImg(e){
	cloneElement= e.currentTarget.cloneNode()
	tourImgDiv.appendChild(cloneElement);
	showTourImgDiv.classList.add("active");
	setTimeout(() => {
		showTourImgDiv.style.opacity= 1;
		console.log("ww")
	}, 10);
}
window.addEventListener("load",function(){
	setTimeout(() => {
		tourImages.forEach(img=>img.addEventListener("click",showTourImg)
		)
	}, 3000);
})


let hideTourImgIcon = document.querySelector("#hide-tour-img");
hideTourImgIcon.addEventListener("click",hideTourImg);
function hideTourImg(){
	showTourImgDiv.classList.remove("active");
	showTourImgDiv.style.opacity= 0;
	tourImgDiv.removeChild(cloneElement)
}
//register tournament
let popUpRegisterButton = document.getElementById("register-popup-button");
let popUpRegisterForm = document.querySelector(".popup-register-form");

function handleRegisterPopUp(e) {
	e.preventDefault()
	popUpRegisterForm.classList.add("active");
	setTimeout(() => {
		popUpRegisterForm.style.opacity = 1;

	}, 10);
	document.body.classList.add("overflow-hidden");
}

popUpRegisterButton.addEventListener("click", handleRegisterPopUp)

//handle popup Close 
let closePopUpIcon = document.getElementById("close-popup-register-form");

function closeRegisterPopUp() {
	popUpRegisterForm.style.opacity = 0;
	popUpRegisterForm.classList.remove("active");
	document.body.classList.remove("overflow-hidden");

}

closePopUpIcon.addEventListener("click", closeRegisterPopUp)

let TourRegisterButton = document.getElementById("tour-register-button");

function sendTourInfo(e) {
	e.preventDefault();
	let tourName = document.getElementById("tour-input-tourament-name").value;
	let name = document.getElementById("tour-input-name").value
	let num = document.getElementById("tour-input-number").value;
	let players = document.getElementById("tour-input-players").value;
	let pay = document.getElementById("tour-input-pay").value;
	let payTime = document.getElementById("tour-input-pay-time").value;
	window.location.href = (`https://api.whatsapp.com/send?phone=+96176090301&text=
  %20Game%20Name:${tourName}
  %0aFullName:${name}
  %0aPhone%20Number:${num}
  %0aNumber%20Of%20Players:${players}
  %0aDue:${payTime}
  %0aBy:${pay}`)
}

TourRegisterButton.addEventListener("click", sendTourInfo)


//start contact
let contactButton = document.getElementById("contact-button");

function sendContactMsg(e) {
	e.preventDefault();
	let name = document.getElementById("contact-name").value;

	let msg = document.getElementById("contact-msg").value;

	let num = document.getElementById("contact-number").value;

	window.open(`https://api.whatsapp.com/send?phone=+96176090301&text=
  %20Name:%20${name}
  %0aNumber:${num}
  %0aMessage:${msg}`);
}
contactButton.addEventListener("click", sendContactMsg);
//end contact